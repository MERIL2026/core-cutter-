'use client';

import React from 'react';
import { Camera, Image as ImageIcon, Send, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export const PhotoEstimatorCard: React.FC = () => {
  const handlePhotoWhatsApp = () => {
    const text = `Hello ${defaultBusinessProfile.business_name}! I have attached/am sending a photo of my wall/beam for a core cutting feasibility and price estimate. Please guide me on the hole size and cost.`;
    const whatsappNum = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-brand-dark text-white rounded-3xl p-6 md:p-10 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>Instant Photo Feasibility</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Not Sure About Wall Thickness or RCC Beams? <span className="text-emerald-400">Send a Photo!</span>
          </h3>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Avoid drilling mistakes. Take a quick phone photo of your indoor wall, beam, or outdoor AC installation spot. Our senior diamond drilling technician will inspect the structure and recommend the exact hole diameter and downward drain slope.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div className="h-7 w-7 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black text-xs mb-2">
                1
              </div>
              <div className="font-bold text-xs text-white">Snap Wall Photo</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Capture AC indoor unit area or beam</div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div className="h-7 w-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs mb-2">
                2
              </div>
              <div className="font-bold text-xs text-white">Send on WhatsApp</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Click the button below to open chat</div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div className="h-7 w-7 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-xs mb-2">
                3
              </div>
              <div className="font-bold text-xs text-white">Get Fast Quote</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Technician confirms price & time slot</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-700 text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
            <ImageIcon className="h-8 w-8" />
          </div>

          <h4 className="text-base font-bold text-white mb-1">WhatsApp Photo Assessment</h4>
          <p className="text-xs text-slate-400 mb-6 max-w-xs">
            Directly connect with our core cutting team. Fast, free, and zero obligation.
          </p>

          <button
            type="button"
            onClick={handlePhotoWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition shadow-xl hover:shadow-emerald-600/30 active:scale-98"
          >
            <Camera className="h-5 w-5" />
            <span>Send Wall Photo on WhatsApp</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-4">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" />
            <span>100% Free Technical Advice & Feasibility Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
