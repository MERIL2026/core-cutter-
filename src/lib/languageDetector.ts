import { ChatLanguage, VoiceLanguageCode } from '@/types/chatbot';

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
 * Intelligent Language Detector for Indian multilingual voice interactions
 * Detects Gujarati, Hindi, Hinglish, Gujlish, and Indian English seamlessly.
 */
export function inferMessageLanguage(
  text: string,
  currentLang: ChatLanguage
): { language: ChatLanguage; voiceLanguageCode: VoiceLanguageCode } {
  if (!text) return { language: currentLang, voiceLanguageCode: currentLang === 'gu' ? 'gu-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN' };

  const lower = text.toLowerCase();

  // 1. Gujarati Script
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return { language: 'gu', voiceLanguageCode: 'gu-IN' };
  }

  // 2. Hindi Devanagari Script
  if (/[\u0900-\u097F]/.test(text)) {
    return { language: 'hi', voiceLanguageCode: 'hi-IN' };
  }

  // 3. Gujlish (Romanized Gujarati)
  const gujlishKeywords = [
    'karavanu',
    'karavvu',
    'che',
    'ketla',
    'karo',
    'karvu',
    'mate',
    'maate',
    'diwal',
    'diwalma',
    'kadhavanu',
    'pani',
    'nathi',
    'aavse',
    'hoy',
    'joiye',
    'joie',
  ];
  if (gujlishKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower))) {
    return { language: 'gu', voiceLanguageCode: 'gu-IN' };
  }

  // 4. Hinglish (Romanized Hindi)
  const hinglishKeywords = [
    'karvana',
    'karwana',
    'hai',
    'karna',
    'chahiye',
    'kitna',
    'kaise',
    'deewar',
    'mein',
    'hoga',
    'lagta',
    'padega',
    'nahi',
    'bataye',
    'batao',
    'kijiye',
    'kholo',
    'kholna',
  ];
  if (hinglishKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower))) {
    return { language: 'hi', voiceLanguageCode: 'hi-IN' };
  }

  if (currentLang === 'gu') return { language: 'gu', voiceLanguageCode: 'gu-IN' };
  if (currentLang === 'hi') return { language: 'hi', voiceLanguageCode: 'hi-IN' };
  return { language: 'en', voiceLanguageCode: 'en-IN' };
}
