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

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const activeEngineRef = useRef<'webSpeech' | 'mediaRecorder' | null>(null);
  const hasResultRef = useRef<boolean>(false);

  const updateState = (state: VoiceState) => {
    setVoiceState(state);
    onVoiceStateChange?.(state);
  };

  const getTargetLocale = (lang: ChatLanguage): VoiceLanguageCode => {
    return lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  };

  const stopAllAudioTracks = () => {
    audioAnalyser.stop();
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
  };

  const stopAllVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    stopAllAudioTracks();
    activeEngineRef.current = null;
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
    hasResultRef.current = false;

    trackEvent({ event_name: 'voice_start' });
    const targetLocale = getTargetLocale(language);

    // Check if Browser SpeechRecognition is available and functional
    const SpeechRecognitionClass =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    // Detect if mobile Android/iOS where SpeechRecognition often crashes or gives Google service error
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (SpeechRecognitionClass && !isMobile) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = targetLocale;
        recognition.maxAlternatives = 1;

        recognition.onstart = async () => {
          activeEngineRef.current = 'webSpeech';
          updateState('LISTENING');
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            await audioAnalyser.attachMediaStream(stream);
          } catch {}
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current = transcript;
              hasResultRef.current = true;
            } else {
              interimText += transcript;
            }
          }

          if (interimText && onInterimTranscript) {
            onInterimTranscript(interimText);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Browser SpeechRecognition error]:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access denied.');
            updateState('ERROR');
            setTimeout(() => {
              setErrorMessage(null);
              updateState('IDLE');
            }, 3000);
            return;
          }

          // If speech recognition failed due to network or service error, seamlessly switch to Sarvam STT
          if (!hasResultRef.current) {
            stopAllAudioTracks();
            recognitionRef.current = null;
            startMediaRecorderSTT();
          }
        };

        recognition.onend = () => {
          stopAllAudioTracks();
          recognitionRef.current = null;

          if (hasResultRef.current && finalTranscriptRef.current.trim()) {
            updateState('IDLE');
            onTranscript(finalTranscriptRef.current.trim(), language, targetLocale);
          } else if (activeEngineRef.current === 'webSpeech') {
            // If no transcript produced by Web Speech, try MediaRecorder fallback
            startMediaRecorderSTT();
          } else {
            updateState('IDLE');
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition initialization failed, using Sarvam STT:', e);
      }
    }

    // Direct High-Quality MediaRecorder + Sarvam STT (Optimal for mobile & desktop)
    startMediaRecorderSTT();
  };

  const startMediaRecorderSTT = async () => {
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
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopAllAudioTracks();

        if (audioChunksRef.current.length === 0) {
          updateState('IDLE');
          return;
        }

        updateState('PROCESSING');
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language_code', getTargetLocale(language));

          const res = await fetch('/api/voice/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Server returned status ${res.status}`);
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
            onTranscript(data.text.trim(), detectedLang, data.language_code);
          } else {
            setErrorMessage('No voice detected. Please speak closer to the mic.');
            updateState('ERROR');
            setTimeout(() => {
              setErrorMessage(null);
              updateState('IDLE');
            }, 3000);
          }
        } catch (err: any) {
          console.error('Sarvam STT failed:', err);
          setErrorMessage('Voice processing error. Please try again.');
          updateState('ERROR');
          setTimeout(() => {
            setErrorMessage(null);
            updateState('IDLE');
          }, 3000);
        }
      };

      activeEngineRef.current = 'mediaRecorder';
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      updateState('LISTENING');
    } catch (micErr: any) {
      console.error('Microphone error:', micErr);
      setErrorMessage('Microphone access denied. Please grant permission.');
      updateState('ERROR');
      setTimeout(() => {
        setErrorMessage(null);
        updateState('IDLE');
      }, 3500);
    }
  };

  const handleToggle = () => {
    if (voiceState === 'LISTENING') {
      if (activeEngineRef.current === 'webSpeech' && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      } else if (activeEngineRef.current === 'mediaRecorder' && mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      } else {
        stopAllVoice();
        updateState('IDLE');
      }
    } else if (voiceState === 'IDLE' || voiceState === 'ERROR') {
      startListening();
    }
  };

  const isListening = voiceState === 'LISTENING';
  const isProcessing = voiceState === 'PROCESSING';

  const titleText = {
    en: isListening ? 'Listening live... Click when done' : isProcessing ? 'Processing voice...' : 'Click to Speak (English, Hindi, Gujarati)',
    gu: isListening ? 'સાંભળી રહ્યા છીએ... બોલીને ક્લિક કરો' : isProcessing ? 'પ્રોસેસિંગ...' : 'બોલવા માટે ક્લિક કરો',
    hi: isListening ? 'सुन रहे हैं... बोलने के बाद क्लिक करें' : isProcessing ? 'प्रोसेसिंग...' : 'बोलने के लिए क्लिक करें',
  }[language];

  return (
    <div className="relative inline-flex items-center shrink-0">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || isProcessing}
        title={titleText}
        aria-label={isListening ? 'Stop voice recording' : 'Start voice conversation'}
        className={`relative h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-[#12151B] ${
          isListening
            ? 'bg-gradient-to-r from-red-600 to-brand-orange text-white shadow-[0_0_20px_rgba(250,74,20,0.85)] scale-105 ring-2 ring-brand-orange animate-pulse'
            : isProcessing
            ? 'bg-[#1E2430] text-amber-400 cursor-wait'
            : 'bg-[#181E28] hover:bg-brand-orange/20 text-brand-orange border border-slate-700/80 hover:border-brand-orange active:scale-95'
        }`}
      >
        {isListening ? (
          <span className="relative flex items-center justify-center">
            <Square className="h-3.5 w-3.5 fill-white text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-xs" />
            </span>
          </span>
        ) : isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>

      {/* Clean In-Line Floating Error Notification */}
      {errorMessage && (
        <div className="absolute bottom-full mb-3 left-0 w-56 p-2 bg-[#12151B]/95 backdrop-blur-md text-white text-[11px] rounded-xl shadow-2xl border border-brand-orange/50 flex items-start space-x-1.5 z-50 animate-fade-in-up pointer-events-none">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-tight text-gray-200">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
