'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { ChatLanguage } from '@/types/chatbot';

export interface VoiceInputButtonProps {
  language: ChatLanguage;
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  language,
  onTranscript,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language locale
      const localeMap: Record<ChatLanguage, string> = {
        en: 'en-IN',
        gu: 'gu-IN',
        hi: 'hi-IN',
      };
      recognition.lang = localeMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        const localeMap: Record<ChatLanguage, string> = {
          en: 'en-IN',
          gu: 'gu-IN',
          hi: 'hi-IN',
        };
        if (recognitionRef.current) {
          recognitionRef.current.lang = localeMap[language] || 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  const titleText = {
    en: isListening ? 'Listening... Speak now' : 'Click to Speak (English)',
    gu: isListening ? 'સાંભળી રહ્યા છીએ... બોલો' : 'બોલવા માટે ક્લિક કરો (ગુજરાતી)',
    hi: isListening ? 'सुन रहे हैं... बोलिए' : 'बोलने के लिए क्लिक करें (हिंदी)',
  }[language];

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      title={titleText}
      aria-label={titleText}
      className={`relative p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse scale-110'
          : 'bg-orange-50 hover:bg-brand-orange hover:text-white text-brand-orange border border-orange-200'
      }`}
    >
      {isListening ? (
        <span className="relative flex items-center justify-center">
          <Mic className="h-4 w-4 text-white" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </span>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
};
