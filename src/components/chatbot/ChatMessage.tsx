'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Bot, User, Phone, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatLanguage, ChatActionChip } from '@/types/chatbot';

export interface ChatMessageProps {
  message: ChatMessageType;
  currentLanguage: ChatLanguage;
  onChipClick?: (chip: ChatActionChip) => void;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({
  message,
  currentLanguage,
  onChipClick,
}) => {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);

    // Map language
    const lang = message.language || currentLanguage;
    const localeMap: Record<ChatLanguage, string> = {
      en: 'en-IN',
      gu: 'gu-IN',
      hi: 'hi-IN',
    };
    utterance.lang = localeMap[lang] || 'en-IN';
    utterance.rate = 1.0;
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
