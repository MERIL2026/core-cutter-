'use client';

import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

interface Option {
  id: string;
  name: string;
  desc: string;
  baseRate: number;
}

const holeSizes: Option[] = [
  { id: '2.0', name: '2.0″ (50mm)', desc: 'AC Drain / Water Pipe with Gravity Slope', baseRate: 600 },
  { id: '2.5-3.0', name: '2.5″ – 3.0″ (65–75mm)', desc: 'Standard 1–2 Ton Split AC Copper & Sleeve', baseRate: 850 },
  { id: '4.0-5.0', name: '4.0″ – 5.0″ (100–125mm)', desc: 'Kitchen Chimney / VRV / Duct Sleeve', baseRate: 1300 },
  { id: '6.0+', name: '6.0″+ (150mm+)', desc: 'Heavy Commercial MEP & Exhaust Passages', baseRate: 2000 },
];

const materials: Option[] = [
  { id: 'aac', name: 'AAC Block / Siporex', desc: 'Lightweight block masonry', baseRate: 0.85 },
  { id: 'brick', name: 'Red Clay Brick', desc: 'Standard residential masonry wall', baseRate: 1.0 },
  { id: 'rcc', name: 'Heavy RCC Concrete + Rebar', desc: 'Reinforced concrete with steel bars', baseRate: 1.4 },
];

const thicknesses: Option[] = [
  { id: '4-5', name: '4″ – 5″ Thickness', desc: 'Internal partition wall', baseRate: 0.9 },
  { id: '9-10', name: '9″ – 10″ Thickness', desc: 'Standard external main wall', baseRate: 1.0 },
  { id: '12-18', name: '12″ – 18″+ Heavy Slab/Beam', desc: 'Deep structural beam or thick slab', baseRate: 1.45 },
];

export const CostEstimator: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string>('2.5-3.0');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('brick');
  const [selectedThickness, setSelectedThickness] = useState<string>('9-10');
  const [quantity, setQuantity] = useState<number>(1);
  const [needSlurryGuard, setNeedSlurryGuard] = useState<boolean>(true);

  const currentSizeObj = holeSizes.find((s) => s.id === selectedSize) || holeSizes[1];
  const currentMaterialObj = materials.find((m) => m.id === selectedMaterial) || materials[1];
  const currentThicknessObj = thicknesses.find((t) => t.id === selectedThickness) || thicknesses[1];

  // Base calculation per hole
  const rawPerHole = currentSizeObj.baseRate * currentMaterialObj.baseRate * currentThicknessObj.baseRate;
  
  // Volume discount
  let discountPercent = 0;
  if (quantity >= 10) discountPercent = 20;
  else if (quantity >= 5) discountPercent = 15;
  else if (quantity >= 3) discountPercent = 10;

  const discountedPerHole = Math.round(rawPerHole * (1 - discountPercent / 100));
  const minTotal = Math.round(discountedPerHole * 0.9 * quantity);
  const maxTotal = Math.round(discountedPerHole * 1.1 * quantity);

  const handleWhatsAppBooking = () => {
    const text = `Hello ${defaultBusinessProfile.business_name}! I calculated an instant core cutting estimate on your website:
• Hole Size: ${currentSizeObj.name} (${currentSizeObj.desc})
• Wall Material: ${currentMaterialObj.name}
• Wall Thickness: ${currentThicknessObj.name}
• Quantity: ${quantity} hole(s)
• Slurry Protection: ${needSlurryGuard ? 'Yes (Furnished Room)' : 'Standard'}
• Estimated Total: ₹${minTotal.toLocaleString('en-IN')} - ₹${maxTotal.toLocaleString('en-IN')}

Please confirm technician availability for my location!`;

    const whatsappNum = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div id="cost-estimator" className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mb-8">
        <div className="inline-flex items-center space-x-2 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          <Calculator className="h-4 w-4" />
          <span>Interactive Cost Estimator</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Calculate Your Core Cutting Cost in <span className="text-brand-orange">30 Seconds</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base mt-2">
          Select your requirements below for transparent, itemized diamond drilling pricing with instant technician booking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Form controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Hole Size */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>1. Select Required Hole Diameter</span>
              <span className="text-brand-orange text-xs font-normal">Diamond Core Barrel</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {holeSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    selectedSize === size.id
                      ? 'bg-brand-orange/20 border-brand-orange text-white shadow-lg ring-1 ring-brand-orange'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{size.name}</span>
                    {selectedSize === size.id && <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-snug">{size.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Wall Material */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              2. Select Wall / Slab Material
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`text-left p-3 rounded-2xl border transition-all ${
                    selectedMaterial === mat.id
                      ? 'bg-brand-orange/20 border-brand-orange text-white shadow-lg ring-1 ring-brand-orange'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs md:text-sm text-white flex items-center justify-between">
                    <span>{mat.name}</span>
                    {selectedMaterial === mat.id && <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{mat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Wall Thickness */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              3. Wall / Beam Thickness
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {thicknesses.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setSelectedThickness(th.id)}
                  className={`text-left p-3 rounded-2xl border transition-all ${
                    selectedThickness === th.id
                      ? 'bg-brand-orange/20 border-brand-orange text-white shadow-lg ring-1 ring-brand-orange'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs md:text-sm text-white flex items-center justify-between">
                    <span>{th.name}</span>
                    {selectedThickness === th.id && <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{th.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Quantity & Slurry control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                4. Number of Holes
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-xl bg-slate-700 text-white font-black hover:bg-slate-600 transition flex items-center justify-center text-lg"
                >
                  –
                </button>
                <div className="text-xl font-black text-white px-3">{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="h-10 w-10 rounded-xl bg-brand-orange text-white font-black hover:bg-brand-orange-dark transition flex items-center justify-center text-lg"
                >
                  +
                </button>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Dust & Slurry Control
              </label>
              <label className="inline-flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={needSlurryGuard}
                  onChange={(e) => setNeedSlurryGuard(e.target.checked)}
                  className="rounded bg-slate-700 border-slate-600 text-brand-orange focus:ring-brand-orange h-4 w-4"
                />
                <span>Furnished Room Slurry Catch Ring (Included)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-800 to-slate-850 p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Estimated Breakdown</span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Zap className="h-3 w-3 mr-1" />
                Live Calculation
              </span>
            </div>

            <div className="space-y-3 py-5 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Hole Diameter:</span>
                <span className="font-bold text-white">{currentSizeObj.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Wall Structure:</span>
                <span className="font-bold text-white">{currentMaterialObj.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Wall Depth:</span>
                <span className="font-bold text-white">{currentThicknessObj.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Quantity:</span>
                <span className="font-bold text-white">{quantity} hole{quantity > 1 ? 's' : ''}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Bulk Discount:</span>
                  <span className="font-bold">-{discountPercent}% Applied</span>
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700/60 my-2 text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Cost Range</div>
              <div className="text-3xl md:text-4xl font-black text-white mt-1">
                ₹{minTotal.toLocaleString('en-IN')} – ₹{maxTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                (~₹{discountedPerHole.toLocaleString('en-IN')} per hole • Inclusive of tools & water cooling)
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-brand-orange shrink-0" />
                <span>0% Vibration guarantee — No wall or plaster cracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Same-day technician dispatch available</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-6">
            <button
              type="button"
              onClick={handleWhatsAppBooking}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg hover:shadow-emerald-600/30 active:scale-98"
            >
              <span>💬 Confirm Estimate on WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href={`tel:${defaultBusinessProfile.phone.replace(/[^\d+]/g, '')}`}
              className="w-full py-3 px-6 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition border border-slate-600"
            >
              <Phone className="h-4 w-4 text-brand-orange" />
              <span>Call Technician: {defaultBusinessProfile.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
