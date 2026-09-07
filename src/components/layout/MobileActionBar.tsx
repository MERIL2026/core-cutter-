'use client';

import React from 'react';
import { Phone, MessageSquare, Calculator, Zap } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export const MobileActionBar: React.FC = () => {
  const handleScrollToEstimator = () => {
    const el = document.getElementById('cost-estimator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const quote = document.getElementById('quote-section');
      quote?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappNum = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] pb-safe">
      {/* Mini top status bar */}
      <div className="bg-slate-900 px-3 py-1 text-[11px] font-bold text-slate-300 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400">Same-Day Available</span>
        </div>
        <span className="text-slate-400 font-medium">Fast Dispatch in {defaultBusinessProfile.city}</span>
      </div>

      {/* Main 3 Action Buttons */}
      <div className="grid grid-cols-3 gap-2 p-2.5">
        {/* Call Now */}
        <a
          href={`tel:${defaultBusinessProfile.phone.replace(/[^\d+]/g, '')}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-brand-orange text-white font-bold text-xs shadow transition active:scale-95"
        >
          <Phone className="h-4 w-4 mb-0.5" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to inquire about core cutting services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow transition active:scale-95"
        >
          <MessageSquare className="h-4 w-4 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Cost Calculator */}
        <button
          type="button"
          onClick={handleScrollToEstimator}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition active:scale-95"
        >
          <Calculator className="h-4 w-4 text-brand-orange mb-0.5" />
          <span>Calculate</span>
        </button>
      </div>
    </div>
  );
};
