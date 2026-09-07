'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  Bot,
  Globe,
  Loader2,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage, ChatLanguage, ChatActionChip } from '@/types/chatbot';
import { ChatMessageItem } from './ChatMessage';
import { VoiceInputButton } from './VoiceInputButton';
import { defaultBusinessProfile } from '@/content/business';

export interface ChatWindowProps {
  onClose: () => void;
}

const starterPrompts: Record<ChatLanguage, string[]> = {
  en: [
    'What hole size do I need for Split AC?',
    'Can you drill RCC beams without cracking?',
    'How do I get an immediate price quote?',
  ],
  gu: [
    'સ્પ્લિટ AC માટે કેટલા ઇંચનું કાણું જોઈએ?',
    'RCC સ્લેબમાં વાઇબ્રેશન વગર કટિંગ થાય?',
    'કોર કટિંગનો ચાર્જ કેટલો થશે?',
  ],
  hi: [
    'स्प्लिट एसी के लिए कितने इंच का होल चाहिए?',
    'क्या RCC बीम में बिना क्रैक ड्रिलिंग होती है?',
    'कोर कटिंग का कितना रेट है?',
  ],
};

const welcomeMessages: Record<ChatLanguage, string> = {
  en: `Hello! 👋 I am the AI Assistant for ${defaultBusinessProfile.business_name}. How can I assist you with diamond core cutting, AC pipe holes, or RCC slab drilling?`,
  gu: `નમસ્તે! 👋 હું ${defaultBusinessProfile.business_name} નો AI સહાયક છું. તમને ડાયમંડ કોર કટિંગ, AC ડ્રેઇન હોલ અથવા RCC સ્લેબ ડ્રિલિંગ બાબતે શું માહિતી જોઈએ છે?`,
  hi: `नमस्ते! 👋 मैं ${defaultBusinessProfile.business_name} का AI असिस्टेंट हूँ। डायमंड कोर कटिंग, एसी पाइप होल या RCC स्लैब ड्रिलिंग में आपकी क्या मदद करूँ?`,
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [language, setLanguage] = useState<ChatLanguage>('en');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: '1',
      sender: 'assistant',
      text: welcomeMessages['en'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionChips: [
        { label: '📞 Call', type: 'call', value: defaultBusinessProfile.phone },
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
    scrollToBottom();
  }, [messages, isLoading]);

  const handleLanguageChange = (newLang: ChatLanguage) => {
    setLanguage(newLang);
    // If only initial message is present, update the initial message in place
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

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply,
        language: data.language || language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: data.actionChips,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorReplies = {
        en: "I'm having a little trouble connecting right now. Please call our technician directly at " + defaultBusinessProfile.phone,
        gu: "કનેક્શનમાં થોડી સમસ્યા આવી છે. કૃપા કરીને સીધા અમારા ટેકનિશિયનને કૉલ કરો: " + defaultBusinessProfile.phone,
        hi: "कनेक्ट करने में थोड़ी समस्या आ रही है। कृपया सीधे हमारे तकनीशियन से संपर्क करें: " + defaultBusinessProfile.phone,
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
        onClose();
      } else {
        window.location.href = chip.value;
      }
    } else if (chip.type === 'prompt') {
      handleSendMessage(chip.value);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const inputPlaceholder = {
    en: 'Ask a question or click the mic...',
    gu: 'પ્રશ્ન પૂછો અથવા માઇક પર ક્લિક કરો...',
    hi: 'सवाल पूछें या माइक पर क्लिक करें...',
  }[language];

  return (
    <div className="flex flex-col h-[560px] max-h-[85vh] w-full sm:w-[410px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up transition-all z-50">
      {/* Top Header */}
      <div className="bg-brand-dark text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black text-sm shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-brand-dark" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">Conoz Core AI</span>
              <span className="text-[10px] font-bold bg-brand-orange/30 text-brand-orange px-1.5 py-0.2 rounded uppercase">
                Gemini Pro
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              Online • Voice &amp; Text
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleReset}
            title="Reset Chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-medium">
          <Globe className="h-3.5 w-3.5 text-brand-orange" />
          <span>Language:</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('gu')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              language === 'gu'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            ગુજરાતી
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('hi')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              language === 'hi'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/70 space-y-2">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            currentLanguage={language}
            onChipClick={handleChipClick}
          />
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 my-2.5 pl-2">
            <div className="h-7 w-7 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Carousel (when conversation is short) */}
      {messages.length <= 3 && (
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange shrink-0 ml-1" />
          {starterPrompts[language].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap bg-orange-50 hover:bg-brand-orange hover:text-white text-gray-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Form with Voice Button */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Voice Input Button (Speech-to-Text) */}
          <VoiceInputButton
            language={language}
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="p-2.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover disabled:bg-gray-200 text-white shadow-orange-glow disabled:shadow-none transition-all active:scale-95 shrink-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
