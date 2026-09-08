'use client';

import { ChatLanguage, VoiceLanguageCode } from '@/types/chatbot';
import { trackEvent } from '@/lib/analytics';
import { audioAnalyser } from '@/lib/audioAnalyser';

/**
 * Production-Grade Multilingual Voice Synthesis Engine
 * 1. Sarvam AI Bulbul v3 (Server-side via /api/voice/speak)
 * 2. ElevenLabs Studio Voice (Secondary fallback if configured)
 * 3. Client-side Web Speech Synthesis (Graceful offline fallback)
 */

let cachedVoices: SpeechSynthesisVoice[] = [];
let activeAudio: HTMLAudioElement | null = null;
let activeAudioUrl: string | null = null;

// Initialize voice cache on client
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      cachedVoices = updatedVoices;
      resolve(updatedVoices);
    };

    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices() || [];
      resolve(cachedVoices);
    }, 500);
  });
}

/**
 * Detect script from text content (Devanagari, Gujarati, Latin)
 */
export function detectScriptLanguage(text: string, fallbackLang: ChatLanguage): ChatLanguage {
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const devanagariRegex = /[\u0900-\u097F]/;

  if (gujaratiRegex.test(text)) return 'gu';
  if (devanagariRegex.test(text)) return 'hi';
  return fallbackLang;
}

/**
 * Cleans and normalizes text for speech synthesis
 */
export function normalizeTextForSpeech(text: string, lang: ChatLanguage): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove emojis and non-standard symbols
  cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');

  // 2. Remove markdown links [label](url) -> label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove markdown headers, bold, italics, code blocks
  cleaned = cleaned.replace(/#{1,6}\s+/g, '');
  cleaned = cleaned.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
  cleaned = cleaned.replace(/_{1,3}([^_]+)_{1,3}/g, '$1');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 4. Remove bullet points and replace with gentle pause
  cleaned = cleaned.replace(/^[\s]*[•\-\*\+]\s+/gm, '');
  cleaned = cleaned.replace(/[•\t]/g, ' ');

  // 5. Language specific phonetic expansions
  if (lang === 'gu') {
    cleaned = cleaned
      .replace(/2\.5[\″"”'’]|2\.5\s*ઇંચ|2\.5\s*ઇન્ચ/g, ' અઢી ઇંચ ')
      .replace(/3[\″"”'’]/g, ' ત્રણ ઇંચ ')
      .replace(/2[\″"”'’]/g, ' બે ઇંચ ')
      .replace(/4[\″"”'’]/g, ' ચાર ઇંચ ')
      .replace(/5[\″"”'’]/g, ' પાંચ ઇંચ ')
      .replace(/6[\″"”'’]/g, ' છ ઇંચ ')
      .replace(/(\d+)[\″"”'’]/g, '$1 ઇંચ ')
      .replace(/0%/g, ' ઝીરો ટકા ')
      .replace(/100%/g, ' સો ટકા ')
      .replace(/(\d+)%/g, '$1 ટકા ')
      .replace(/\bRCC\b|\brcc\b/gi, ' આર સી સી ')
      .replace(/\bAC\b|\bac\b/gi, ' એસી ')
      .replace(/\bVRV\b|\bVRF\b/gi, ' વી આર વી ')
      .replace(/\bAAC\b/gi, ' એ એ સી ')
      .replace(/5°\s*થી\s*10°|5°-10°/g, ' પાંચ થી દસ ડિગ્રી ')
      .replace(/\bWhatsApp\b/gi, ' વ્હોટ્સએપ ')
      .replace(/\bCall\b/gi, ' કોલ ');
  } else if (lang === 'hi') {
    cleaned = cleaned
      .replace(/2\.5[\″"”'’]|2\.5\s*इंच/g, ' ढाई इंच ')
      .replace(/3[\″"”'’]/g, ' तीन इंच ')
      .replace(/2[\″"”'’]/g, ' दो इंच ')
      .replace(/4[\″"”'’]/g, ' चार इंच ')
      .replace(/5[\″"”'’]/g, ' पाँच इंच ')
      .replace(/6[\″"”'’]/g, ' छह इंच ')
      .replace(/(\d+)[\″"”'’]/g, '$1 इंच ')
      .replace(/0%/g, ' ज़ीरो परसेंट ')
      .replace(/100%/g, ' सौ परसेंट ')
      .replace(/(\d+)%/g, '$1 प्रतिशत ')
      .replace(/\bRCC\b|\brcc\b/gi, ' आर सी सी ')
      .replace(/\bAC\b|\bac\b/gi, ' एसी ')
      .replace(/\bVRV\b|\bVRF\b/gi, ' वी आर वी ')
      .replace(/\bAAC\b/gi, ' ए ए सी ')
      .replace(/5°\s*से\s*10°|5°-10°/g, ' पांच से दस डिग्री ')
      .replace(/\bWhatsApp\b/gi, ' व्हाट्सएप ')
      .replace(/\bCall\b/gi, ' कॉल ');
  } else {
    cleaned = cleaned
      .replace(/2\.5[\″"”'’]/g, ' 2.5 inches ')
      .replace(/(\d+)[\″"”'’]/g, '$1 inches ')
      .replace(/\bRCC\b/gi, ' R.C.C. ')
      .replace(/\bAC\b/gi, ' A C ')
      .replace(/\b0%/g, ' zero percent ')
      .replace(/5°-10°/g, ' 5 to 10 degrees ');
  }

  // Remove URLs or hashes
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');
  cleaned = cleaned.replace(/#\S+/g, '');

  return cleaned.replace(/\n+/g, '. ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Finds highest quality browser voice for offline fallback
 */
export function getBestVoice(lang: ChatLanguage): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'gu') {
    const guVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('gu') ||
        v.name.toLowerCase().includes('gujarati') ||
        v.name.toLowerCase().includes('dhwani') ||
        v.name.toLowerCase().includes('niranjan')
    );
    if (guVoices.length > 0) {
      const preferred = guVoices.find(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Online')
      );
      return preferred || guVoices[0];
    }

    const hiVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('madhur')
    );
    if (hiVoices.length > 0) return hiVoices[0];
  }

  if (lang === 'hi') {
    const hiVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('madhur') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('hemant')
    );
    if (hiVoices.length > 0) {
      const preferred = hiVoices.find(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Online')
      );
      return preferred || hiVoices[0];
    }
  }

  const inEnVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase() === 'en-in' ||
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('neerja') ||
      v.name.toLowerCase().includes('prabhat')
  );
  if (inEnVoices.length > 0) return inEnVoices[0];

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  if (enVoices.length > 0) {
    const preferred = enVoices.find(
      (v) => v.name.includes('Natural') || v.name.includes('Google')
    );
    return preferred || enVoices[0];
  }

  return voices[0] || null;
}

/**
 * Stop any active playback immediately
 */
export function stopSpeaking() {
  audioAnalyser.stop();
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}
    activeAudio = null;
  }

  if (activeAudioUrl) {
    try {
      URL.revokeObjectURL(activeAudioUrl);
    } catch {}
    activeAudioUrl = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak assistant response using Sarvam AI Bulbul v3 with multi-tier fallback
 */
export async function speakAssistantMessage(
  rawText: string,
  preferredLang: ChatLanguage,
  voiceLanguageCode?: VoiceLanguageCode,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  stopSpeaking();

  const effectiveLang = detectScriptLanguage(rawText, preferredLang);
  const cleanText = normalizeTextForSpeech(rawText, effectiveLang);

  if (!cleanText) {
    onEnd?.();
    return;
  }

  const targetLangCode: VoiceLanguageCode =
    voiceLanguageCode || (effectiveLang === 'gu' ? 'gu-IN' : effectiveLang === 'hi' ? 'hi-IN' : 'en-IN');

  trackEvent({
    event_name: 'voice_response_started',
    metadata: { language: effectiveLang, language_code: targetLangCode },
  });

  // 1. Try Server Voice Route (/api/voice/speak) -> Sarvam Bulbul v3
  try {
    const response = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language: effectiveLang,
        language_code: targetLangCode,
      }),
    });

    const contentType = response.headers.get('Content-Type') || '';

    if (response.ok && (contentType.includes('audio/wav') || contentType.includes('audio/mpeg') || contentType.includes('audio/mp3'))) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      activeAudioUrl = audioUrl;

      const audio = new Audio(audioUrl);
      activeAudio = audio;

      audio.onplay = () => {
        audioAnalyser.attachAudioElement(audio);
        onStart?.();
      };

      audio.onended = () => {
        trackEvent({
          event_name: 'voice_response_completed',
          metadata: { language: effectiveLang },
        });
        stopSpeaking();
        onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('[Audio Playback Error] Falling back to browser speech:', e);
        stopSpeaking();
        speakWithBrowserSpeech(cleanText, effectiveLang, onStart, onEnd, onError);
      };

      try {
        await audio.play();
      } catch (playErr) {
        console.warn('[Audio play() failed] Falling back to browser speech:', playErr);
        stopSpeaking();
        speakWithBrowserSpeech(cleanText, effectiveLang, onStart, onEnd, onError);
      }
      return;
    }
  } catch (err) {
    console.info('[Server TTS unavailable] Falling back to browser speech:', err);
  }

  // 2. Fallback to client-side browser Web Speech API
  speakWithBrowserSpeech(cleanText, effectiveLang, onStart, onEnd, onError);
}

/**
 * Client-side browser speech synthesis fallback
 */
async function speakWithBrowserSpeech(
  cleanText: string,
  effectiveLang: ChatLanguage,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('SpeechSynthesis not supported');
    return;
  }

  await initVoices();
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);

  const localeMap: Record<ChatLanguage, string> = {
    en: 'en-IN',
    gu: 'gu-IN',
    hi: 'hi-IN',
  };
  utterance.lang = localeMap[effectiveLang] || 'en-IN';

  const voice = getBestVoice(effectiveLang);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  if (effectiveLang === 'gu') {
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
  } else if (effectiveLang === 'hi') {
    utterance.rate = 0.90;
    utterance.pitch = 1.0;
  } else {
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    trackEvent({
      event_name: 'voice_response_completed',
      metadata: { language: effectiveLang, mode: 'browser_tts' },
    });
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('[Browser Speech Synthesis Error]:', e);
    trackEvent({
      event_name: 'voice_error',
      metadata: { error_type: 'browser_tts_error' },
    });
    onEnd?.();
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
}
