export type ChatLanguage = 'en' | 'gu' | 'hi';

export type VoiceLanguageCode = 'en-IN' | 'hi-IN' | 'gu-IN';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export type VoiceErrorType =
  | 'STT_ERROR'
  | 'TTS_ERROR'
  | 'MICROPHONE_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'INVALID_AUDIO'
  | 'INVALID_REQUEST';

export interface VoiceTranscriptionResult {
  text: string;
  language: VoiceLanguageCode | ChatLanguage;
  detected_language_code?: string;
  confidence?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language?: ChatLanguage;
  timestamp: string;
  actionChips?: ChatActionChip[];
  isVoice?: boolean;
}

export interface ChatActionChip {
  label: string;
  type: 'link' | 'prompt' | 'call' | 'whatsapp';
  value: string;
}

export interface ChatRequest {
  message: string;
  language: ChatLanguage;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

export interface ChatResponse {
  reply: string;
  language: ChatLanguage;
  voice_language_code?: VoiceLanguageCode;
  actionChips?: ChatActionChip[];
}
