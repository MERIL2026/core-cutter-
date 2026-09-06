'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Drill, ShieldCheck, Compass, Gauge } from 'lucide-react';

export interface DiamondCoreVisualProps {
  className?: string;
  variant?: 'hero' | 'service';
  serviceName?: string;
}

export const DiamondCoreVisual: React.FC<DiamondCoreVisualProps> = ({
  className,
  variant = 'hero',
  serviceName,
}) => {
  return (
    <div
      className={cn(
        'relative w-full max-w-[460px] mx-auto rounded-2xl bg-gradient-to-br from-[#0B2540] via-[#0F3557] to-[#081B2E] border border-brand-accent-blue/30 p-6 sm:p-8 shadow-2xl overflow-hidden',
        className
      )}
      aria-label="Diamond core cutting technical precision diagram"
    >
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-technical-grid opacity-30 pointer-events-none" />

      {/* Radial Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent-blue/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Header Info Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand-accent-blue/20 border border-brand-accent-blue/40 flex items-center justify-center text-brand-accent-blue">
            <Compass className="h-4 w-4 animate-spin-slow" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-xs font-bold text-white tracking-wider uppercase">
              {serviceName || 'Rotary Diamond Coring'}
            </span>
            <span className="block text-[11px] text-brand-accent-blue/80 font-mono">
              PRECISION MATRIX • SPEC 2.0-5.0″
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Calibrated</span>
        </div>
      </div>

      {/* Central Engineering Diagram SVG */}
      <div className="relative z-10 flex items-center justify-center py-4">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* SVG Technical Linework & Rotating Diamond Segments */}
          <svg
            className="w-full h-full"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer Compass Degree Ring */}
            <circle
              cx="150"
              cy="150"
              r="135"
              stroke="#4EA3D1"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx="150"
              cy="150"
              r="125"
              stroke="#DCEFF8"
              strokeOpacity="0.15"
              strokeWidth="1"
            />

            {/* Measurement Caliper Crosshairs */}
            <line x1="150" y1="10" x2="150" y2="290" stroke="#4EA3D1" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="#4EA3D1" strokeOpacity="0.2" strokeWidth="1" />

            {/* Concentric Diameter Rings */}
            {/* 125mm (5") Ring */}
            <circle
              cx="150"
              cy="150"
              r="110"
              stroke="#4EA3D1"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            {/* 100mm (4") Ring */}
            <circle
              cx="150"
              cy="150"
              r="88"
              stroke="#4EA3D1"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* 75mm (3") Ring */}
            <circle
              cx="150"
              cy="150"
              r="66"
              stroke="#4EA3D1"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            {/* 50mm (2") Ring */}
            <circle
              cx="150"
              cy="150"
              r="44"
              stroke="#4EA3D1"
              strokeOpacity="0.6"
              strokeWidth="2"
            />

            {/* Central Core Pilot & Water Coolant Port */}
            <circle
              cx="150"
              cy="150"
              r="18"
              fill="#0F3557"
              stroke="#4EA3D1"
              strokeWidth="2"
            />
            <circle cx="150" cy="150" r="6" fill="#4EA3D1" />

            {/* Precision Angle Degree Labels */}
            <text x="150" y="24" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">0° N</text>
            <text x="278" y="153" textAnchor="start" fill="#64748B" fontSize="8" fontFamily="monospace">90° E</text>
            <text x="150" y="284" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">180° S</text>
            <text x="8" y="153" textAnchor="end" fill="#64748B" fontSize="8" fontFamily="monospace">270° W</text>
          </svg>

          {/* Rotating Diamond Segment Teeth Layer */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* 12 Diamond Teeth Segments arranged in circle at radius 110 */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const x = 150 + 110 * Math.cos(rad);
                const y = 150 + 110 * Math.sin(rad);
                return (
                  <g key={idx} transform={`translate(${x}, ${y}) rotate(${angle + 90})`}>
                    <rect
                      x="-6"
                      y="-3"
                      width="12"
                      height="6"
                      rx="1"
                      fill="#4EA3D1"
                      fillOpacity="0.85"
                      stroke="#FFFFFF"
                      strokeWidth="0.75"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating Dimension Callouts */}
          <div className="absolute top-3 right-4 px-2 py-0.5 rounded bg-brand-navy/90 border border-brand-accent-blue/40 text-[10px] font-mono text-brand-accent-blue shadow">
            5.0″ (125mm)
          </div>
          <div className="absolute bottom-5 left-4 px-2 py-0.5 rounded bg-brand-navy/90 border border-brand-accent-blue/40 text-[10px] font-mono text-brand-accent-blue shadow">
            2.0″ (50mm)
          </div>
        </div>
      </div>

      {/* Engineering Specs & Metric Highlights */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-4 border-t border-white/10 text-xs">
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-brand-accent-blue font-semibold text-[11px]">
            <Gauge className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Rotary Action</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">Non-impact diamond crown</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-brand-accent-blue font-semibold text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>Integrity Safe</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">Zero structural cracking</p>
        </div>
      </div>
    </div>
  );
};
