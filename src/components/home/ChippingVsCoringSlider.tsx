'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  MoveHorizontal,
  Flame,
  Wrench,
} from 'lucide-react';

export const ChippingVsCoringSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs md:text-sm font-black px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Structural Safety Comparison</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Hammer Chipping <span className="text-red-500">VS</span> Diamond Coring
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3">
            Drag the slider below to see why traditional hammer demolition destroys walls and why rotary diamond core cutting guarantees 100% structural integrity.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative h-[480px] sm:h-[420px] md:h-[460px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl select-none cursor-ew-resize group"
        >
          {/* RIGHT SIDE: Diamond Core Cutting (Safe) */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex justify-end">
              <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Diamond Core Cutting (Our Standard)</span>
              </span>
            </div>

            <div className="max-w-md ml-auto text-right space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400">
                0% Vibration • Laser-Circular Finish
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center justify-end space-x-2">
                  <span>Zero micro-fractures in surrounding concrete/plaster</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </li>
                <li className="flex items-center justify-end space-x-2">
                  <span>Internal steel rebar cleanly segmented without bending</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </li>
                <li className="flex items-center justify-end space-x-2">
                  <span>Exact downward gravity slope for 0% AC water leakage</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </li>
                <li className="flex items-center justify-end space-x-2">
                  <span>Controlled water suppression — Zero toxic cement dust</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </li>
              </ul>
            </div>

            <div className="flex justify-end text-[11px] text-slate-400 font-medium">
              ✨ Safe for Furnished Homes, RCC Beams & High-Rise Apartments
            </div>
          </div>

          {/* LEFT SIDE: Hammer Chipping (Destructive) - Clipped by sliderPosition */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-950/90 via-stone-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <div className="flex justify-start">
              <span className="inline-flex items-center space-x-1.5 bg-red-500/20 text-red-400 border border-red-500/40 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4" />
                <span>Hammer / Chisel Chipping (Dangerous)</span>
              </span>
            </div>

            <div className="max-w-md text-left space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-red-400">
                Severe Wall Cracks & Structural Weakening
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Heavy shockwaves loosen plaster and split brick joints</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Jagged, uneven hole creates permanent AC air/water leaks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Rebar gets bent, damaging beam load-bearing capacity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Hazardous cement dust coats furniture and living spaces</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-start text-[11px] text-red-300 font-medium">
              ⚠️ Causes costly structural wall repairs & water seepage
            </div>
          </div>

          {/* Slider Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Handle Button */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-brand-orange text-white shadow-2xl border-2 border-white flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <MoveHorizontal className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Quick presets / click buttons below slider */}
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setSliderPosition(15)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              sliderPosition <= 20
                ? 'bg-red-500/20 text-red-400 border-red-500'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            View Hammer Chipping
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              sliderPosition > 20 && sliderPosition < 80
                ? 'bg-brand-orange/20 text-brand-orange border-brand-orange'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            50/50 Split Comparison
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(85)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              sliderPosition >= 80
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            View Diamond Coring
          </button>
        </div>
      </div>
    </section>
  );
};
