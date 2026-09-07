export type ChatLanguage = 'en' | 'gu' | 'hi';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language?: ChatLanguage;
  timestamp: string;
  actionChips?: ChatActionChip[];
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
  actionChips?: ChatActionChip[];
}
