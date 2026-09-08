'use client';

import React, { useState, useEffect } from 'react';
import { audioAnalyser } from '@/lib/audioAnalyser';

export type AssistantBlobState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type AssistantBlobSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AssistantBlobProps {
  state?: AssistantBlobState;
  size?: AssistantBlobSize;
  className?: string;
  hasNotification?: boolean;
  isHovered?: boolean;
  interactive?: boolean;
  audioReactive?: boolean;
}

const sizeConfig: Record<
  AssistantBlobSize,
  {
    containerSize: number;
    svgSize: number;
    eyeWidth: number;
    eyeHeight: number;
    eyeRx: number;
    eyeSpacing: number;
    eyeY: number;
    glowBlur: number;
    ringRadius: number;
  }
> = {
  sm: {
    containerSize: 28,
    svgSize: 28,
    eyeWidth: 3.5,
    eyeHeight: 5,
    eyeRx: 1.8,
    eyeSpacing: 3.5,
    eyeY: 12,
    glowBlur: 4,
    ringRadius: 13,
  },
  md: {
    containerSize: 48,
    svgSize: 48,
    eyeWidth: 5.5,
    eyeHeight: 8.5,
    eyeRx: 2.8,
    eyeSpacing: 5.5,
    eyeY: 20,
    glowBlur: 8,
    ringRadius: 22,
  },
  lg: {
    containerSize: 68,
    svgSize: 68,
    eyeWidth: 7.5,
    eyeHeight: 12,
    eyeRx: 3.8,
    eyeSpacing: 8,
    eyeY: 28,
    glowBlur: 12,
    ringRadius: 31,
  },
  xl: {
    containerSize: 104,
    svgSize: 104,
    eyeWidth: 11,
    eyeHeight: 18,
    eyeRx: 5.5,
    eyeSpacing: 12,
    eyeY: 42,
    glowBlur: 18,
    ringRadius: 48,
  },
};

export const AssistantBlob: React.FC<AssistantBlobProps> = ({
  state = 'idle',
  size = 'lg',
  className = '',
  hasNotification = false,
  isHovered = false,
  interactive = false,
  audioReactive = true,
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const cfg = sizeConfig[size];

  // Subscribe to audio amplitude updates during speaking or listening
  useEffect(() => {
    if (!audioReactive) return;

    const unsubscribe = audioAnalyser.subscribe((level) => {
      setAudioLevel(level);
    });

    return () => {
      unsubscribe();
    };
  }, [audioReactive]);

  // Determine dynamic scale and glow based on state and real-time audioLevel
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isError = state === 'error';

  // Audio reaction multipliers
  const reactiveScale = isSpeaking
    ? 1 + audioLevel * 0.14
    : isListening
    ? 1 + audioLevel * 0.08
    : 1;

  const reactiveGlow = isSpeaking
    ? 1 + audioLevel * 0.6
    : isListening
    ? 1 + audioLevel * 0.35
    : 1;

  // Unique ID prefix to avoid SVG gradient collisions when multiple blobs exist
  const idPrefix = `blob-${size}-${React.useId().replace(/:/g, '')}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: `${cfg.containerSize}px`,
        height: `${cfg.containerSize}px`,
      }}
    >
      {/* 1. LISTENING STATE: Concentric Glowing Orange/Amber Pulse Rings */}
      {isListening && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="absolute rounded-full border border-brand-orange/70 animate-ping"
            style={{
              width: `${cfg.containerSize * 1.35}px`,
              height: `${cfg.containerSize * 1.35}px`,
              animationDuration: '1.6s',
            }}
          />
          <span
            className="absolute rounded-full border-2 border-amber-400/50 animate-pulse"
            style={{
              width: `${cfg.containerSize * 1.18}px`,
              height: `${cfg.containerSize * 1.18}px`,
              boxShadow: '0 0 16px rgba(250,74,20,0.55)',
            }}
          />
        </div>
      )}

      {/* 2. THINKING STATE: Orbiting Glowing Diamond Particles */}
      {isThinking && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow"
          style={{ animationDuration: '3.5s' }}
          aria-hidden="true"
        >
          {/* Particle 1: Diamond Orange */}
          <div
            className="absolute rounded-full bg-brand-orange shadow-[0_0_10px_#FA4A14] animate-pulse"
            style={{
              width: `${Math.max(3.5, cfg.containerSize * 0.08)}px`,
              height: `${Math.max(3.5, cfg.containerSize * 0.08)}px`,
              transform: `translate(${cfg.containerSize * 0.52}px, -${cfg.containerSize * 0.25}px)`,
            }}
          />
          {/* Particle 2: Radiant Gold / Amber */}
          <div
            className="absolute rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse"
            style={{
              width: `${Math.max(2.5, cfg.containerSize * 0.06)}px`,
              height: `${Math.max(2.5, cfg.containerSize * 0.06)}px`,
              transform: `translate(-${cfg.containerSize * 0.48}px, ${cfg.containerSize * 0.3}px)`,
              animationDelay: '0.4s',
            }}
          />
          {/* Particle 3: White Diamond Sparkle */}
          <div
            className="absolute rounded-full bg-white shadow-[0_0_8px_#FFFFFF]"
            style={{
              width: `${Math.max(2, cfg.containerSize * 0.05)}px`,
              height: `${Math.max(2, cfg.containerSize * 0.05)}px`,
              transform: `translate(${cfg.containerSize * 0.15}px, ${cfg.containerSize * 0.52}px)`,
            }}
          />
        </div>
      )}

      {/* 3. Ambient Bottom Shadow & Glow */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-300"
        style={{
          width: `${cfg.containerSize * 0.85}px`,
          height: `${cfg.containerSize * 0.35}px`,
          bottom: `-${cfg.containerSize * 0.08}px`,
          background: isError
            ? 'radial-gradient(ellipse, rgba(239,68,68,0.45) 0%, rgba(0,0,0,0) 75%)'
            : isListening
            ? 'radial-gradient(ellipse, rgba(250,74,20,0.6) 0%, rgba(0,0,0,0) 75%)'
            : isHovered
            ? 'radial-gradient(ellipse, rgba(250,74,20,0.55) 0%, rgba(0,0,0,0) 75%)'
            : 'radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, rgba(0,0,0,0) 75%)',
          filter: `blur(${cfg.glowBlur * 0.6}px)`,
        }}
        aria-hidden="true"
      />

      {/* 4. Core 3D Glossy Blob Container with Dynamic State Transitions */}
      <div
        className={`relative flex items-center justify-center transition-transform ${
          state === 'idle'
            ? 'animate-blob-breathe'
            : isSpeaking
            ? 'animate-blob-speak'
            : isThinking
            ? 'animate-blob-think'
            : ''
        }`}
        style={{
          transform: `scale(${
            (isHovered ? 1.06 : 1) * reactiveScale
          })`,
          transition: isSpeaking ? 'transform 80ms ease-out' : 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg
          width={cfg.svgSize}
          height={cfg.svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* Outer Rim Diamond Orange & Gold Glow Filter */}
            <filter id={`${idPrefix}-glow`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur
                stdDeviation={isHovered || isListening ? 4.5 * reactiveGlow : 3}
                result="blur"
              />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Inner 3D Gradient (Website Diamond Orange, Amber & Rich Charcoal Core) */}
            <radialGradient
              id={`${idPrefix}-body-grad`}
              cx="40%"
              cy="34%"
              r="64%"
              fx="36%"
              fy="28%"
            >
              <stop offset="0%" stopColor="#FB923C" stopOpacity="0.98" />
              <stop offset="28%" stopColor="#FA4A14" stopOpacity="0.95" />
              <stop offset="62%" stopColor="#C2360B" stopOpacity="0.96" />
              <stop offset="100%" stopColor={isError ? '#7F1D1D' : '#1A202C'} stopOpacity="1" />
            </radialGradient>

            {/* Diamond Orange Rim Glow Ring Gradient */}
            <linearGradient id={`${idPrefix}-rim-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isError ? '#F87171' : '#FED7AA'}
                stopOpacity={isListening ? 0.95 : 0.9}
              />
              <stop
                offset="40%"
                stopColor={isError ? '#EF4444' : '#FA4A14'}
                stopOpacity={isListening ? 0.95 : 0.85}
              />
              <stop
                offset="75%"
                stopColor="#F59E0B"
                stopOpacity="0.75"
              />
              <stop
                offset="100%"
                stopColor={isError ? '#B91C1C' : '#E03E0B'}
                stopOpacity={isListening ? 0.95 : 0.85}
              />
            </linearGradient>

            {/* Top Gloss Specular Highlight Gradient */}
            <linearGradient id={`${idPrefix}-gloss-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Eye Glow Filter */}
            <filter id={`${idPrefix}-eye-glow`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.8" result="eyeBlur" />
              <feComposite in="SourceGraphic" in2="eyeBlur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Diamond Orange Glowing Aura Layer */}
          <path
            d="M50 8C73 8 92 27 92 50C92 73 73 92 50 92C27 92 8 73 8 50C8 27 27 8 50 8Z"
            fill="none"
            stroke={`url(#${idPrefix}-rim-grad)`}
            strokeWidth={isHovered || isListening ? '3.5' : '2.2'}
            filter={`url(#${idPrefix}-glow)`}
            className="transition-all duration-300"
          />

          {/* 2. Main 3D Organic Blob Body with Asymmetric Curvature */}
          <path
            d="M50 10C71.5 9 89.5 25.5 90 49C90.5 72.5 73.5 89.5 50 90C26.5 90.5 10 74 9.5 51C9 28 28.5 11 50 10Z"
            fill={`url(#${idPrefix}-body-grad)`}
            stroke={`url(#${idPrefix}-rim-grad)`}
            strokeWidth="1.6"
          />

          {/* 3. Deep Internal Warm Amber / Gold Core Highlights */}
          <ellipse
            cx="48"
            cy="52"
            rx="32"
            ry="28"
            fill="#B43407"
            opacity="0.55"
          />
          <ellipse
            cx="38"
            cy="36"
            rx="20"
            ry="16"
            fill="#F59E0B"
            opacity="0.45"
          />

          {/* 4. 3D Glossy Surface Specular Arch */}
          <path
            d="M28 20C34 15 66 15 72 20C68 25 32 25 28 20Z"
            fill={`url(#${idPrefix}-gloss-grad)`}
          />
          <ellipse
            cx="50"
            cy="18"
            rx="18"
            ry="4.5"
            fill="#FFFFFF"
            opacity="0.35"
          />

          {/* 5. Glowing White Eyes */}
          <g
            filter={`url(#${idPrefix}-eye-glow)`}
            className="transition-all duration-200"
          >
            {isSpeaking ? (
              /* Happy Curved Crescent Eyes when Speaking */
              <>
                <path
                  d="M36 49C36 44 44 44 44 49"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M56 49C56 44 64 44 64 49"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : isThinking ? (
              /* Thinking Focused Eyes */
              <>
                <rect
                  x="37"
                  y="46"
                  width="7"
                  height="10"
                  rx="3.5"
                  fill="#FFFFFF"
                  className="animate-pulse"
                />
                <rect
                  x="56"
                  y="46"
                  width="7"
                  height="10"
                  rx="3.5"
                  fill="#FFFFFF"
                  className="animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                />
              </>
            ) : isListening ? (
              /* Attentive Brighter Eyes */
              <>
                <rect
                  x="36.5"
                  y="44"
                  width="7.5"
                  height="13"
                  rx="3.75"
                  fill="#FFFFFF"
                  className="drop-shadow-[0_0_6px_#ffffff]"
                />
                <rect
                  x="56"
                  y="44"
                  width="7.5"
                  height="13"
                  rx="3.75"
                  fill="#FFFFFF"
                  className="drop-shadow-[0_0_6px_#ffffff]"
                />
              </>
            ) : (
              /* Default Glowing Pill Eyes */
              <>
                <rect
                  x="37"
                  y="45"
                  width="7"
                  height="12"
                  rx="3.5"
                  fill="#FFFFFF"
                  className={`transition-all duration-300 ${
                    isHovered ? 'drop-shadow-[0_0_5px_#ffffff]' : ''
                  }`}
                />
                <rect
                  x="56"
                  y="45"
                  width="7"
                  height="12"
                  rx="3.5"
                  fill="#FFFFFF"
                  className={`transition-all duration-300 ${
                    isHovered ? 'drop-shadow-[0_0_5px_#ffffff]' : ''
                  }`}
                />
              </>
            )}
          </g>

          {/* 6. Soft Cheek Glow */}
          <ellipse cx="32" cy="56" rx="4" ry="2" fill="#FDE68A" opacity="0.4" />
          <ellipse cx="68" cy="56" rx="4" ry="2" fill="#FDE68A" opacity="0.4" />
        </svg>
      </div>

      {/* 5. Notification Badge (Top-Right Glow Dot) */}
      {hasNotification && (
        <span
          className="absolute -top-0.5 -right-0.5 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-brand-orange opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange border border-white shadow-xs" />
        </span>
      )}
    </div>
  );
};
