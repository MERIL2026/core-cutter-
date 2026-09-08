'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Loader2, AlertCircle, Square } from 'lucide-react';
import { ChatLanguage, VoiceState, VoiceLanguageCode } from '@/types/chatbot';
import { stopSpeaking } from '@/lib/speechSynthesis';
import { trackEvent } from '@/lib/analytics';
import { audioAnalyser } from '@/lib/audioAnalyser';

export interface VoiceInputButtonProps {
  language: ChatLanguage;
  onTranscript: (transcript: string, detectedLang?: ChatLanguage, voiceLangCode?: VoiceLanguageCode) => void;
  onInterimTranscript?: (text: string) => void;
  onVoiceStateChange?: (state: VoiceState) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  language,
  onTranscript,
  onInterimTranscript,
  onVoiceStateChange,
  disabled = false,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveAudioLevel, setLiveAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const unsubscribeAudioRef = useRef<(() => void) | null>(null);

  const updateState = (state: VoiceState) => {
    setVoiceState(state);
    onVoiceStateChange?.(state);
  };

  const getTargetLocale = (lang: ChatLanguage): VoiceLanguageCode => {
    return lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  };

  const stopAllVoice = () => {
    if (unsubscribeAudioRef.current) {
      unsubscribeAudioRef.current();
      unsubscribeAudioRef.current = null;
    }
    audioAnalyser.stop();
    setLiveAudioLevel(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAllVoice();
    };
  }, []);

  const startListening = async () => {
    if (disabled) return;
    setErrorMessage(null);
    stopSpeaking();
    stopAllVoice();
    finalTranscriptRef.current = '';

    trackEvent({ event_name: 'voice_start' });

    const targetLocale = getTargetLocale(language);

    // Engine A: Browser Real-time Streaming SpeechRecognition (Chrome, Edge, Safari, Android)
    const SpeechRecognitionClass =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = targetLocale;
        recognition.maxAlternatives = 1;

        let gotFinalResult = false;

        recognition.onstart = async () => {
          updateState('LISTENING');
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            await audioAnalyser.attachMediaStream(stream);
            unsubscribeAudioRef.current = audioAnalyser.subscribe((lvl) => setLiveAudioLevel(lvl));
          } catch {}
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current = transcript;
              gotFinalResult = true;
            } else {
              interimText += transcript;
            }
          }

          if (interimText && onInterimTranscript) {
            onInterimTranscript(interimText);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Speech Recognition Error]:', event.error);
          if (event.error !== 'no-speech') {
            fallbackToSarvamSTT();
          } else {
            stopAllVoice();
            updateState('IDLE');
          }
        };

        recognition.onend = () => {
          stopAllVoice();
          if (gotFinalResult && finalTranscriptRef.current.trim()) {
            updateState('IDLE');
            onTranscript(finalTranscriptRef.current.trim(), language, targetLocale);
          } else {
            fallbackToSarvamSTT();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn('Browser SpeechRecognition start failed, switching to Sarvam fallback:', e);
      }
    }

    // Engine B: High-Accuracy Sarvam AI STT Fallback
    fallbackToSarvamSTT();
  };

  const fallbackToSarvamSTT = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaStreamRef.current = stream;
      await audioAnalyser.attachMediaStream(stream);
      unsubscribeAudioRef.current = audioAnalyser.subscribe((lvl) => setLiveAudioLevel(lvl));

      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          updateState('IDLE');
          return;
        }

        updateState('PROCESSING');
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language_code', getTargetLocale(language));

          const res = await fetch('/api/voice/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error('STT transcription failed');
          }

          const data = await res.json();
          if (data.text && data.text.trim()) {
            const detectedLang: ChatLanguage =
              data.language === 'gu' || data.language === 'gu-IN'
                ? 'gu'
                : data.language === 'hi' || data.language === 'hi-IN'
                ? 'hi'
                : 'en';

            updateState('IDLE');
            onTranscript(data.text.trim(), detectedLang, data.detected_language_code);
          } else {
            updateState('IDLE');
          }
        } catch (err: any) {
          console.error('Sarvam STT failed:', err);
          setErrorMessage('Voice not detected clearly. Please try speaking closer to mic.');
          updateState('ERROR');
          setTimeout(() => {
            setErrorMessage(null);
            updateState('IDLE');
          }, 3500);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      updateState('LISTENING');
    } catch (micErr: any) {
      console.error('Microphone access denied:', micErr);
      setErrorMessage('Microphone access denied. Please enable mic permissions.');
      updateState('ERROR');
      setTimeout(() => {
        setErrorMessage(null);
        updateState('IDLE');
      }, 4000);
    }
  };

  const handleToggle = () => {
    if (voiceState === 'LISTENING') {
      stopAllVoice();
      updateState('IDLE');
      const text = finalTranscriptRef.current.trim();
      if (text) {
        onTranscript(text, language, getTargetLocale(language));
      }
    } else if (voiceState === 'IDLE' || voiceState === 'ERROR') {
      startListening();
    }
  };

  const isListening = voiceState === 'LISTENING';
  const isProcessing = voiceState === 'PROCESSING';

  const titleText = {
    en: isListening ? 'Listening live... Click when done' : isProcessing ? 'Thinking...' : 'Click to Speak (English, Hindi, Gujarati)',
    gu: isListening ? 'સાંભળી રહ્યા છીએ... બોલીને ક્લિક કરો' : isProcessing ? 'વિચારી રહ્યા છીએ...' : 'બોલવા માટે ક્લિક કરો',
    hi: isListening ? 'सुन रहे हैं... बोलने के बाद क्लिक करें' : isProcessing ? 'सोच रहे हैं...' : 'बोलने के लिए क्लिक करें',
  }[language];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || isProcessing}
        title={titleText}
        aria-label={isListening ? 'Stop voice recording' : 'Start voice conversation'}
        className={`relative p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-[#12151B] ${
          isListening
            ? 'bg-gradient-to-r from-red-600 to-brand-orange text-white shadow-[0_0_24px_rgba(250,74,20,0.85)] scale-110 ring-2 ring-brand-orange animate-pulse'
            : isProcessing
            ? 'bg-[#1E2430] text-amber-400 cursor-wait'
            : 'bg-[#181E28] hover:bg-brand-orange/20 text-brand-orange border border-slate-700/80 hover:border-brand-orange/80 active:scale-95'
        }`}
      >
        {isListening ? (
          <span className="relative flex items-center justify-center">
            <Square className="h-4 w-4 fill-white text-white" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-xs" />
            </span>
          </span>
        ) : isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>

      {/* Floating Status Bubble while Speaking */}
      {isListening && (
        <div className="absolute bottom-full mb-3 left-0 whitespace-nowrap px-3 py-1.5 bg-[#12151B]/95 backdrop-blur-md text-white text-xs rounded-xl shadow-2xl border border-brand-orange/50 flex items-center space-x-2 z-50 animate-fade-in-up pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-brand-orange animate-ping" />
          <span className="font-semibold text-brand-orange">Listening...</span>
          <span className="text-[10px] text-gray-300">Speak now</span>
        </div>
      )}

      {/* Floating Error Tooltip */}
      {errorMessage && (
        <div className="absolute bottom-full mb-2.5 left-0 w-64 p-2.5 bg-[#12151B] text-white text-xs rounded-xl shadow-2xl border border-brand-orange/40 flex items-start space-x-2 z-50 animate-fade-in-up">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-tight text-gray-200">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
