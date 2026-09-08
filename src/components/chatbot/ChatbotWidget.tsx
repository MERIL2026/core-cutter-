'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { AssistantBlob } from './AssistantBlob';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('core_assistant_tooltip_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowTooltip(true);
          setHasNotification(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setShowTooltip(false);
      setHasNotification(false);
      try {
        localStorage.setItem('core_assistant_tooltip_dismissed', 'true');
      } catch {}
    }
  };

  const dismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    setHasNotification(false);
    try {
      localStorage.setItem('core_assistant_tooltip_dismissed', 'true');
    } catch {}
  };

  return (
    <>
      {/* Expanded Chat Window (Positioned cleanly for both mobile and desktop) */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-[74px] sm:inset-x-auto sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-auto">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Widget Launcher & Greeting Tooltip */}
      <div className="fixed bottom-[74px] right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
        {/* Floating Greeting Tooltip with Brand Orange Glow */}
        {!isOpen && showTooltip && (
          <div
            onClick={toggleChat}
            className="pointer-events-auto mb-3.5 cursor-pointer flex items-center space-x-2.5 bg-[#12151B]/95 backdrop-blur-xl text-white px-3.5 py-2.5 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.7)] border border-brand-orange/40 hover:border-brand-orange transition-all duration-300 animate-fade-in-up hover:scale-105 group max-w-[290px] sm:max-w-none shadow-orange-glow/30"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-brand-orange animate-ping shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white tracking-wide flex items-center space-x-1">
                <span>Need core cutting help?</span>
                <span className="text-brand-orange font-bold">Ask Priya</span>
              </span>
              <span className="text-[10px] text-gray-400">
                Instant Quote in English · ગુજરાતી · हिंदी
              </span>
            </div>
            <button
              type="button"
              onClick={dismissTooltip}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 shrink-0 transition-colors ml-1"
              aria-label="Dismiss help tooltip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Floating 3D Blob Launcher Button */}
        {!isOpen && (
          <div className="pointer-events-auto relative">
            <button
              type="button"
              onClick={toggleChat}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              aria-label="Open Multilingual AI Assistant"
              title="Chat with Priya (English, Gujarati, Hindi)"
              className="relative flex items-center justify-center p-1 rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-orange/40 hover:scale-110 animate-launcher-halo"
            >
              <AssistantBlob
                state="idle"
                size="lg"
                isHovered={isHovered}
                hasNotification={hasNotification}
                interactive
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
