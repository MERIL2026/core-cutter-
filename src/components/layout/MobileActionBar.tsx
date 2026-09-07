'use client';

import React from 'react';
import { Phone, MessageSquare, Calculator } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export const MobileActionBar: React.FC = () => {
  const handleScrollToEstimator = () => {
    const el = document.getElementById('cost-estimator') || document.getElementById('quote-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanPhone = defaultBusinessProfile.phone.replace(/[^\d+]/g, '');
  const whatsappNum = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-8px_20px_rgba(0,0,0,0.4)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        {/* Call Now */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-xl bg-brand-orange text-white font-black text-xs shadow-md transition active:scale-95"
        >
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to inquire about core cutting services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md transition active:scale-95"
        >
          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Quote / Cost Calculator */}
        <button
          type="button"
          onClick={handleScrollToEstimator}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-black text-xs border border-slate-700 transition active:scale-95"
        >
          <Calculator className="h-3.5 w-3.5 text-brand-orange shrink-0" />
          <span>Quote</span>
        </button>
      </div>
    </div>
  );
};
