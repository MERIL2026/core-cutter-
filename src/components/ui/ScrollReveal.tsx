'use client';

import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

export type RevealAnimation =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'flip-up';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number; // In ms
  duration?: number; // In ms
  threshold?: number; // 0 to 1
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  className,
  as: Component = 'div',
  once = true,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const animationClass = {
    'fade-up': 'reveal-fade-up',
    'fade-down': 'reveal-fade-down',
    'slide-left': 'reveal-slide-left',
    'slide-right': 'reveal-slide-right',
    'zoom-in': 'reveal-zoom-in',
    'flip-up': 'reveal-flip-up',
  }[animation];

  const style: React.CSSProperties = {
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
    ...(duration ? { transitionDuration: `${duration}ms` } : {}),
  };

  return (
    <Component
      ref={ref}
      style={style}
      className={clsx(
        'reveal-init',
        animationClass,
        isRevealed && 'reveal-active',
        className
      )}
    >
      {children}
    </Component>
  );
};
