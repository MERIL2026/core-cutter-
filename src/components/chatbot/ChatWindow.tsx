'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  Globe,
  Loader2,
} from 'lucide-react';
import { ChatMessage, ChatLanguage, ChatActionChip, VoiceLanguageCode, VoiceState } from '@/types/chatbot';
import { ChatMessageItem } from './ChatMessage';
import { VoiceInputButton } from './VoiceInputButton';
import { AssistantBlob } from './AssistantBlob';
import { defaultBusinessProfile } from '@/content/business';
import { initVoices, stopSpeaking, speakAssistantMessage } from '@/lib/speechSynthesis';

export interface ChatWindowProps {
  onClose: () => void;
}

const starterPrompts: Record<ChatLanguage, string[]> = {
  en: [
    'What hole size do I need for Split AC?',
    'Can you drill RCC beams without cracking?',
    'How do I get an immediate price quote?',
    'Is dust control included for furnished homes?',
  ],
  gu: [
    'સ્પ્લિટ AC માટે કેટલા ઇંચનું કાણું જોઈએ?',
    'RCC સ્લેબમાં વાઇબ્રેશન વગર કટિંગ થાય?',
    'કોર કટિંગનો ચાર્જ કેટલો થશે?',
    'ધૂળ કે કચરો ઊડશે?',
  ],
  hi: [
    'स्प्लिट एसी के लिए कितने इंच का होल चाहिए?',
    'क्या RCC बीम में बिना क्रैक ड्रिलिंग होती है?',
    'कोर कटिंग का कितना रेट है?',
    'क्या घर में धूल उड़ेगी?',
  ],
};

const welcomeMessages: Record<ChatLanguage, string> = {
  en: `Hello! 👋 I'm Priya, your AI Technical Specialist for ${defaultBusinessProfile.business_name}. How can I help you today? Ask me about AC pipe holes, RCC slab core cutting, or get an instant quote!`,
  gu: `નમસ્તે! 👋 હું પ્રિયા છું, ${defaultBusinessProfile.business_name} ની AI ટેકનિકલ સહાયક. હું તમને આજે શું મદદ કરી શકું? ડાયમંડ કોર કટિંગ, AC ડ્રેઇન હોલ અથવા ભાવ અંદાજ બાબતે કંઈપણ પૂછો.`,
  hi: `नमस्ते! 👋 मैं प्रिया हूँ, ${defaultBusinessProfile.business_name} की AI टेक्निकल असिस्टेंट। आज मैं आपकी क्या मदद करूँ? डायमंड कोर कटिंग, एसी पाइप होल या रेट के बारे में आप कुछ भी पूछ सकते हैं!`,
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [language, setLanguage] = useState<ChatLanguage>('en');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: '1',
      sender: 'assistant',
      text: welcomeMessages['en'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionChips: [
        { label: '📞 Call Now', type: 'call', value: defaultBusinessProfile.phone },
        { label: '💬 WhatsApp', type: 'whatsapp', value: (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '') },
        { label: '📝 Get Quote', type: 'link', value: '#quote-section' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    initVoices();
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, voiceState]);

  const handleLanguageChange = (newLang: ChatLanguage) => {
    stopSpeaking();
    setLanguage(newLang);
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: '1',
            sender: 'assistant',
            text: welcomeMessages[newLang],
            language: newLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionChips: [
              {
                label: newLang === 'gu' ? '📞 કોલ કરો' : newLang === 'hi' ? '📞 कॉल करें' : '📞 Call Now',
                type: 'call',
                value: defaultBusinessProfile.phone,
              },
              {
                label: '💬 WhatsApp',
                type: 'whatsapp',
                value: (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, ''),
              },
              {
                label: newLang === 'gu' ? '📝 ભાવ અંદાજ' : newLang === 'hi' ? '📝 फ्री कोट' : '📝 Get Quote',
                type: 'link',
                value: '#quote-section',
              },
            ],
          },
        ];
      }
      return prev;
    });
  };

  const handleReset = () => {
    stopSpeaking();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: welcomeMessages[language],
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: [
          { label: language === 'gu' ? '📞 કોલ કરો' : language === 'hi' ? '📞 कॉल करें' : '📞 Call Now', type: 'call', value: defaultBusinessProfile.phone },
          { label: '💬 WhatsApp', type: 'whatsapp', value: (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '') },
          { label: language === 'gu' ? '📝 ભાવ અંદાજ' : language === 'hi' ? '📝 फ्री कोट' : '📝 Get Quote', type: 'link', value: '#quote-section' },
        ],
      },
    ]);
  };

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  const handleSendMessage = async (textToSend?: string, autoSpeakResponse = false, forcedLang?: ChatLanguage) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    stopSpeaking();

    const activeLang = forcedLang || language;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      language: activeLang,
      isVoice: autoSpeakResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: activeLang,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await res.json();
      const resolvedLang = data.language || activeLang;
      const voiceLangCode: VoiceLanguageCode =
        data.voice_language_code || (resolvedLang === 'gu' ? 'gu-IN' : resolvedLang === 'hi' ? 'hi-IN' : 'en-IN');

      if (resolvedLang !== language) {
        setLanguage(resolvedLang);
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply,
        language: resolvedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: data.actionChips,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (autoSpeakResponse && data.reply) {
        speakAssistantMessage(
          data.reply,
          resolvedLang,
          voiceLangCode,
          () => setVoiceState('SPEAKING'),
          () => setVoiceState('IDLE'),
          () => setVoiceState('IDLE')
        );
      }
    } catch (err) {
      const errorReplies = {
        en: `I'm having a little trouble connecting right now. Please call our technical team directly at ${defaultBusinessProfile.phone}`,
        gu: `કનેક્શનમાં થોડી સમસ્યા આવી છે. કૃપા કરીને સીધા અમારા ટેકનિશિયનને કૉલ કરો: ${defaultBusinessProfile.phone}`,
        hi: `कनेक्ट करने में थोड़ी समस्या आ रही है। कृपया सीधे हमारे तकनीशियन से संपर्क करें: ${defaultBusinessProfile.phone}`,
      };

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: errorReplies[language],
          language,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionChips: [
            { label: '📞 Call Now', type: 'call', value: defaultBusinessProfile.phone },
            { label: '💬 WhatsApp', type: 'whatsapp', value: (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '') },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chip: ChatActionChip) => {
    if (chip.type === 'call') {
      window.location.href = `tel:${chip.value.replace(/[^\d+]/g, '')}`;
    } else if (chip.type === 'whatsapp') {
      window.open(`https://wa.me/${chip.value.replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about core cutting services.')}`, '_blank');
    } else if (chip.type === 'link') {
      const el = document.getElementById(chip.value.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        handleClose();
      } else {
        window.location.href = chip.value;
      }
    } else if (chip.type === 'prompt') {
      handleSendMessage(chip.value);
    }
  };

  const handleVoiceTranscript = (transcript: string, detectedLang?: ChatLanguage) => {
    if (transcript.trim()) {
      if (detectedLang && detectedLang !== language) {
        setLanguage(detectedLang);
      }
      handleSendMessage(transcript, true, detectedLang);
    }
  };

  const inputPlaceholder = {
    en: 'Ask Priya a question or click mic to speak...',
    gu: 'પ્રિયાને પ્રશ્ન પૂછો અથવા બોલવા માઇક દબાવો...',
    hi: 'प्रिया से प्रश्न पूछें या बोलने के लिए माइक दबाएं...',
  }[language];

  const blobState =
    voiceState === 'SPEAKING'
      ? 'speaking'
      : voiceState === 'LISTENING'
      ? 'listening'
      : isLoading || voiceState === 'PROCESSING'
      ? 'thinking'
      : 'idle';

  return (
    <div className="flex flex-col h-[calc(100dvh-90px)] sm:h-[580px] max-h-[620px] w-full sm:w-[420px] bg-[#0E1218] text-gray-100 rounded-2xl sm:rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] border border-slate-800 overflow-hidden animate-chat-window transition-all">
      {/* Header with Priya's Identity - Styled to Match Website Dark Hero & Navbar */}
      <div className="bg-[#12151B] px-4 py-3 flex flex-col border-b border-slate-800 relative overflow-hidden">
        {/* Subtle Brand Orange & Amber Glow */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            {/* Header Animated Blob with Reactive Scale */}
            <div className="relative shrink-0 transition-transform hover:scale-110">
              <AssistantBlob state={blobState} size="md" audioReactive />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Priya <span className="text-brand-orange font-semibold text-xs tracking-normal">· Diamond AI Specialist</span>
                </span>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1.5">
                  {blobState === 'speaking' ? (
                    <span className="text-brand-orange font-semibold flex items-center space-x-1">
                      <span className="flex space-x-0.5 items-center">
                        <span className="h-2 w-0.5 bg-brand-orange rounded-full animate-pulse" />
                        <span className="h-3 w-0.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '120ms' }} />
                        <span className="h-2 w-0.5 bg-brand-orange rounded-full animate-pulse" style={{ animationDelay: '240ms' }} />
                      </span>
                      <span>Priya is speaking...</span>
                    </span>
                  ) : blobState === 'listening' ? (
                    <span className="text-brand-orange font-semibold animate-pulse">Listening to you...</span>
                  ) : blobState === 'thinking' ? (
                    <span className="text-amber-400 font-medium animate-pulse">Calculating & Thinking...</span>
                  ) : (
                    'Online · Voice & Chat Ready'
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 z-10">
            <button
              type="button"
              onClick={handleReset}
              title="Reset Chat"
              aria-label="Reset conversation"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-1 focus:ring-brand-orange"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              title="Close"
              aria-label="Close chat window"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-1 focus:ring-brand-orange"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Language Selection Switcher Pills (Top Header Bar) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs z-10">
          <div className="flex items-center space-x-1.5 text-gray-400 font-medium">
            <Globe className="h-3.5 w-3.5 text-brand-orange" />
            <span>Select Language:</span>
          </div>

          <div className="flex items-center space-x-1 bg-[#090C11] p-0.5 rounded-full border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                language === 'en'
                  ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-orange-glow scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                language === 'hi'
                  ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-orange-glow scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('gu')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                language === 'gu'
                  ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-orange-glow scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              ગુજરાતી
            </button>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0E1218] space-y-2.5 chatbot-scroll">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            currentLanguage={language}
            onChipClick={handleChipClick}
          />
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2.5 my-3 pl-1 animate-message-pop">
            <div className="shrink-0">
              <AssistantBlob state="thinking" size="sm" />
            </div>
            <div className="bg-[#181E28] border border-slate-700/80 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-md flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 font-medium ml-1">Priya is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Carousel (Clean No-Scrollbar Horizontal Slider) */}
      {messages.length <= 3 && (
        <div
          className="px-3 py-2 bg-[#12151B] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-orange shrink-0 ml-0.5 animate-pulse" />
          {starterPrompts[language].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap bg-[#181E28] hover:bg-brand-orange/20 text-gray-300 hover:text-white border border-slate-700/80 hover:border-brand-orange/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200 shrink-0 focus:outline-none focus:ring-1 focus:ring-brand-orange hover:-translate-y-0.5 active:scale-95 shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-3 bg-[#12151B] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 bg-[#0A0D14] border border-slate-800 rounded-full px-2 py-1.5 focus-within:border-brand-orange/80 transition-all shadow-inner"
        >
          {/* Voice Input Button */}
          <VoiceInputButton
            language={language}
            onTranscript={handleVoiceTranscript}
            onInterimTranscript={setInput}
            onVoiceStateChange={setVoiceState}
            disabled={isLoading}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={isLoading}
            className="flex-1 px-2 py-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="p-2.5 rounded-full bg-gradient-to-tr from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 disabled:opacity-40 disabled:hover:from-brand-orange disabled:hover:to-amber-500 text-white shadow-orange-glow transition-all active:scale-95 hover:scale-105 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer Brand & AI Indicator */}
        <div className="mt-2 px-1 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center space-x-1.5">
            <span className="text-gray-300 font-medium">{defaultBusinessProfile.business_name}</span>
            <span>· 2-Hour Fast Dispatch</span>
          </div>

          <div className="flex items-center space-x-1.5 text-gray-400">
            <span className="flex space-x-0.5 items-center">
              <span className="h-2 w-0.5 bg-brand-orange/90 rounded-full animate-pulse" />
              <span className="h-3 w-0.5 bg-amber-400/90 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-0.5 bg-brand-orange/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="text-brand-orange font-medium text-[10px]">Sarvam Voice AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
