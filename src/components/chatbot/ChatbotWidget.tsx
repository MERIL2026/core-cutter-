'use client';

import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show subtle greeting tooltip after 3 seconds on first load
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-[64px] right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 origin-bottom-right transition-all max-w-[calc(100vw-24px)]">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Greeting Pill (before opening) */}
      {!isOpen && showTooltip && (
        <div className="pointer-events-auto mb-2 flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl shadow-xl border border-slate-700 animate-fade-in-up max-w-[280px] sm:max-w-none">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange shrink-0 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold leading-tight">
            Need Help? Ask in <strong className="text-brand-orange">English, ગુજરાતી, हिंदी</strong>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-gray-400 hover:text-white p-0.5 rounded shrink-0"
            aria-label="Dismiss help tooltip"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Floating Launcher Button */}
      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isOpen ? 'Close AI Chat' : 'Open Multilingual AI Chat & Voice Assistant'}
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-orange/40 ${
            isOpen
              ? 'bg-slate-800 rotate-90 hover:bg-slate-700'
              : 'bg-gradient-to-tr from-brand-orange to-amber-500 hover:scale-105 shadow-[0_8px_20px_-4px_rgba(250,74,20,0.5)]'
          }`}
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
              {/* Online Green Indicator */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
