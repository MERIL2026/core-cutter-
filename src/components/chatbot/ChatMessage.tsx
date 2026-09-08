'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, User, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatLanguage, ChatActionChip, VoiceLanguageCode } from '@/types/chatbot';
import { speakAssistantMessage, stopSpeaking } from '@/lib/speechSynthesis';
import { AssistantBlob } from './AssistantBlob';

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

  const handleSpeak = async () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    const lang = message.language || currentLanguage;
    const voiceLangCode: VoiceLanguageCode =
      lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

    await speakAssistantMessage(
      message.text,
      lang,
      voiceLangCode,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const listenLabel = {
    en: isPlaying ? 'Stop' : 'Listen',
    gu: isPlaying ? 'બંધ કરો' : 'સાંભળો',
    hi: isPlaying ? 'रोकें' : 'सुनें',
  }[message.language || currentLanguage] || (isPlaying ? 'Stop' : 'Listen');

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-3 space-y-1.5 animate-message-pop`}>
      <div className="flex items-end gap-2.5 max-w-[88%]">
        {!isUser && (
          <div className="shrink-0 mb-1 flex items-center justify-center transition-transform hover:scale-110">
            <AssistantBlob
              state={isPlaying ? 'speaking' : 'idle'}
              size="sm"
              audioReactive={isPlaying}
            />
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all shadow-md ${
            isUser
              ? 'bg-gradient-to-r from-brand-orange to-[#FA4A14] text-white rounded-br-none shadow-orange-glow font-medium hover:brightness-105'
              : 'bg-[#181E28] text-slate-100 border border-slate-700/70 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-slate-600'
          }`}
        >
          <p className="whitespace-pre-wrap font-normal">{message.text}</p>
        </div>

        {isUser && (
          <div className="h-7 w-7 rounded-full bg-brand-orange/20 border border-brand-orange/50 text-brand-orange flex items-center justify-center shrink-0 mb-1 shadow-sm transition-transform hover:scale-110">
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
            title={isPlaying ? 'Stop Audio' : 'Listen to Answer via Sarvam Voice'}
            className={`inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
              isPlaying
                ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/60 shadow-[0_0_14px_rgba(250,74,20,0.4)] animate-pulse scale-105'
                : 'text-gray-400 hover:text-brand-orange hover:bg-slate-800 bg-[#12151B] border border-slate-800 hover:scale-105 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <div className="flex items-center space-x-0.5">
                <span className="h-2.5 w-0.5 bg-brand-orange rounded-full animate-pulse" />
                <span className="h-3.5 w-0.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                <span className="h-2 w-0.5 bg-brand-orange rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              </div>
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
            <span>{isPlaying ? `${listenLabel}...` : listenLabel}</span>
          </button>
          <span className="text-[10px] text-gray-500">{message.timestamp}</span>
        </div>
      )}

      {/* Action Chips with Hover Lift and Glowing Ring */}
      {!isUser && message.actionChips && message.actionChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 pl-9">
          {message.actionChips.map((chip, idx) => {
            const cleanLabel = chip.label.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '').trim();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChipClick?.(chip)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#181E28] hover:bg-brand-orange/20 hover:border-brand-orange text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-orange-glow/30 hover:-translate-y-0.5 active:scale-95"
              >
                {chip.type === 'call' && <Phone className="h-3 w-3 text-emerald-400" />}
                {chip.type === 'whatsapp' && <MessageSquare className="h-3 w-3 text-emerald-400" />}
                {chip.type === 'link' && <ArrowRight className="h-3 w-3 text-brand-orange" />}
                <span>{cleanLabel || chip.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
