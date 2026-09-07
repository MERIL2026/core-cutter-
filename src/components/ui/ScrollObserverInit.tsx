'use client';

import React, { useEffect } from 'react';

/**
 * Global Scroll Observer Initializer
 * Automatically hooks up any elements containing `data-reveal` or `.reveal-init`
 * attributes/classes to trigger `.reveal-active` on scroll entrance.
 */
export const ScrollObserverInit: React.FC = () => {
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-init, [data-reveal]').forEach((el) => {
        el.classList.add('reveal-active');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('reveal-active');
            obs.unobserve(target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-init:not(.reveal-active), [data-reveal]:not(.reveal-active)');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Debounce re-observing so dynamic DOM changes don't thrash CPU/battery
    let debounceTimer: NodeJS.Timeout | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        observeElements();
      }, 300);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
};
