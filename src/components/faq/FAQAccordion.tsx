'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ } from '../../types';
import { cn } from '@/lib/utils';

export interface FAQAccordionProps {
  items: FAQ[];
  allowMultiple?: boolean;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `faq-trigger-${item.id}`;
        const contentId = `faq-content-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-2xl border transition-all duration-300 overflow-hidden',
              isOpen
                ? 'bg-white border-brand-orange shadow-lg shadow-brand-orange/10 ring-1 ring-brand-orange/20'
                : 'bg-white border-slate-200/90 hover:border-brand-orange/40 shadow-xs'
            )}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  'w-full flex items-center justify-between p-5 sm:p-6 text-left font-extrabold text-base sm:text-lg transition-colors cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-inset',
                  isOpen
                    ? 'text-brand-orange bg-orange-50/40'
                    : 'text-brand-dark hover:text-brand-orange'
                )}
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <span className={cn(
                    'h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors',
                    isOpen
                      ? 'bg-brand-orange text-white'
                      : 'bg-orange-50 text-brand-orange border border-brand-orange/20'
                  )}>
                    Q
                  </span>
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-brand-orange transition-transform duration-300 ease-out',
                    isOpen && 'rotate-180 text-brand-orange'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                className="p-6 pt-3 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-white"
              >
                <div className="pl-10.5">{item.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
