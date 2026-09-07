'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bot, User, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatLanguage, ChatActionChip } from '@/types/chatbot';

export interface ChatMessageProps {
  message: ChatMessageType;
  currentLanguage: ChatLanguage;
  onChipClick?: (chip: ChatActionChip) => void;
}

/**
 * Cleans text for Text-to-Speech playback so the browser's speech synthesis engine
 * sounds natural and human, rather than reading out emojis (e.g. "waving hand sign"),
 * markdown formatting, raw URLs, or phonetic acronym issues.
 */
export function cleanTextForSpeech(text: string, lang: ChatLanguage = 'en'): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove variation selectors and zero-width joiners
  cleaned = cleaned.replace(/[\uFE00-\uFE0F\u200D]/g, '');

  // 2. Remove emojis and pictographs completely (prevents "waving hand sign", "thumbs up", etc.)
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');
  } catch {
    // Fallback if environment doesn't support unicode property escapes
  }
  cleaned = cleaned.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ''
  );

  // 3. Remove markdown links: [Label](url) -> Label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 4. Remove raw URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');

  // 5. Remove markdown bold, italic, code blocks, headers, blockquotes
  cleaned = cleaned.replace(/[*_~`#|>]/g, '');

  // 6. Replace bullet points at the beginning of lines
  cleaned = cleaned.replace(/^[\s*•\-–—]+\s*/gm, '');

  // 7. Natural speech replacements for common symbols
  cleaned = cleaned.replace(/\s*&\s*/g, ' and ');
  cleaned = cleaned.replace(/\s*\/\s*/g, ' or ');
  cleaned = cleaned.replace(/\s*@\s*/g, ' at ');
  cleaned = cleaned.replace(/\+/g, ' plus ');

  // 8. Soften abrupt exclamation greetings so there is a natural conversational pause instead of a dead stop
  cleaned = cleaned.replace(/\b(Hello|Hi|Hey|Greetings)!\s*/gi, '$1, ');

  // 9. Domain & phonetic pronunciation enhancements
  if (lang === 'en') {
    // CRITICAL: Prevent TTS from pronouncing AI as "eye" or "the I"
    cleaned = cleaned.replace(/\bAI\b/g, 'A I');
    cleaned = cleaned.replace(/\bRCC\b/g, 'R C C');
    cleaned = cleaned.replace(/\bAC\b/g, 'A C');
    cleaned = cleaned.replace(/\bCTA\b/g, 'C T A');
    cleaned = cleaned.replace(/\bFAQ\b/g, 'F A Q');
    cleaned = cleaned.replace(/\bmm\b/gi, 'millimeters');
    cleaned = cleaned.replace(/\bcm\b/gi, 'centimeters');
    cleaned = cleaned.replace(/\bft\b/gi, 'feet');
    cleaned = cleaned.replace(/\binch(es)?\b/gi, 'inches');
    cleaned = cleaned.replace(/\bdia\.?\b/gi, 'diameter');
    cleaned = cleaned.replace(/\bsq\.?\s*ft\.?\b/gi, 'square feet');
    cleaned = cleaned.replace(/\bapprox\.?\b/gi, 'approximately');
    cleaned = cleaned.replace(/\be\.?g\.?\b/gi, 'for example');
    cleaned = cleaned.replace(/\bi\.?e\.?\b/gi, 'that is');
    cleaned = cleaned.replace(/\bhrs?\b/gi, 'hours');
    cleaned = cleaned.replace(/\bmins?\b/gi, 'minutes');
    cleaned = cleaned.replace(/\b24\/7\b/g, '24 by 7');
  } else if (lang === 'hi') {
    cleaned = cleaned.replace(/\bAI\b/g, 'ए आई');
    cleaned = cleaned.replace(/\bAC\b/g, 'ए सी');
    cleaned = cleaned.replace(/\bRCC\b/g, 'आर सी सी');
  } else if (lang === 'gu') {
    cleaned = cleaned.replace(/\bAI\b/g, 'એ આઈ');
    cleaned = cleaned.replace(/\bAC\b/g, 'એ સી');
    cleaned = cleaned.replace(/\bRCC\b/g, 'આર સી સી');
  }

  // 10. Clean up extra punctuation, repeated spaces, and newlines
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*\1+/g, '$1')
    .trim();

  return cleaned;
}

/**
 * Intelligently selects the highest quality voice available in the browser.
 * Prioritizes natural/neural/online voices and pleasant assistant voices (e.g. Zira, Neerja, Google),
 * while heavily penalizing harsh, robotic legacy system voices (e.g. Mark, David).
 */
const getPreferredVoice = (targetLocale: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return null;
  }

  const normalizedTarget = targetLocale.toLowerCase().replace('_', '-');
  const targetPrefix = normalizedTarget.split('-')[0];

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    const vName = v.name.toLowerCase();
    let score = 0;

    // Language matching
    if (vLang === normalizedTarget) {
      score += 100;
    } else if (vLang.startsWith(targetPrefix)) {
      score += 60;
    } else if (targetPrefix === 'gu' && vLang.startsWith('hi')) {
      // Gujarati falls back to Hindi much better than English phonetics
      score += 40;
    } else if (targetPrefix === 'en' && vLang.startsWith('en')) {
      score += 40;
    } else {
      return -1; // Incompatible language
    }

    // Natural / Neural / Online cloud-quality voices
    if (vName.includes('natural') || vName.includes('neural') || vName.includes('online')) {
      score += 60;
    }
    if (vName.includes('google')) {
      score += 45;
    }
    if (vName.includes('enhanced') || vName.includes('premium')) {
      score += 35;
    }

    // Modern, clear, and pleasant assistant voices
    if (
      vName.includes('zira') ||
      vName.includes('neerja') ||
      vName.includes('aria') ||
      vName.includes('jenny') ||
      vName.includes('swara') ||
      vName.includes('samantha') ||
      vName.includes('karen') ||
      vName.includes('serena') ||
      vName.includes('female')
    ) {
      score += 30;
    }

    // Strongly penalize robotic legacy desktop voices that sound like 1995 SAPI
    if (vName.includes('mark') || vName.includes('david')) {
      score -= 30;
    }

    return score;
  };

  const scored = voices
    .map((v) => ({ voice: v, score: scoreVoice(v) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].voice : null;
};

export const ChatMessageItem: React.FC<ChatMessageProps> = ({
  message,
  currentLanguage,
  onChipClick,
}) => {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  // Preload / cache browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Map language
    const lang = message.language || currentLanguage;
    const localeMap: Record<ChatLanguage, string> = {
      en: 'en-IN',
      gu: 'gu-IN',
      hi: 'hi-IN',
    };
    const targetLocale = localeMap[lang] || 'en-IN';

    // Clean text to avoid reading out emoji names like "waving hand sign"
    const cleanedText = cleanTextForSpeech(message.text, lang);
    if (!cleanedText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = targetLocale;

    const voice = getPreferredVoice(targetLocale);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.95; // Slightly relaxed pacing for maximum clarity and warmth
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-2.5 space-y-1.5`}>
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isUser && (
          <div className="h-7 w-7 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="h-4 w-4" />
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'bg-brand-orange text-white rounded-br-none'
              : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none shadow-card'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {isUser && (
          <div className="h-7 w-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Voice Readout Button & Timestamp for Assistant */}
      {!isUser && (
        <div className="flex items-center space-x-2 pl-9">
          <button
            type="button"
            onClick={handleSpeak}
            title={isPlaying ? 'Stop Audio' : 'Listen to Answer (Text-to-Speech)'}
            className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-md transition-colors ${
              isPlaying
                ? 'bg-orange-100 text-brand-orange font-bold animate-pulse'
                : 'text-gray-400 hover:text-brand-orange hover:bg-orange-50'
            }`}
          >
            {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
          </button>
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>
      )}

      {/* Action Chips */}
      {!isUser && message.actionChips && message.actionChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 pl-9">
          {message.actionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChipClick?.(chip)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 hover:bg-brand-orange hover:text-white text-brand-orange border border-orange-200 text-xs font-bold transition-all duration-150 shadow-2xs active:scale-95"
            >
              {chip.type === 'call' && <Phone className="h-3 w-3" />}
              {chip.type === 'whatsapp' && <MessageSquare className="h-3 w-3" />}
              {chip.type === 'link' && <ArrowRight className="h-3 w-3" />}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
