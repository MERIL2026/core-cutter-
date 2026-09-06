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
              'rounded-xl border transition-all duration-200 overflow-hidden',
              isOpen
                ? 'bg-white border-brand-accent-blue/60 shadow-md ring-1 ring-brand-accent-blue/20'
                : 'bg-white border-brand-border hover:border-slate-300 shadow-xs'
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
                  'w-full flex items-center justify-between p-5 text-left font-bold text-base sm:text-lg transition-colors cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue focus-visible:ring-inset',
                  isOpen
                    ? 'text-brand-navy bg-slate-50/50'
                    : 'text-brand-text hover:text-brand-navy'
                )}
              >
                <div className="flex items-center space-x-3 pr-4">
                  <span className="h-6 w-6 rounded-md bg-brand-light-blue/60 text-brand-secondary-blue flex items-center justify-center text-xs font-bold shrink-0">
                    Q
                  </span>
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-brand-secondary-blue transition-transform duration-300 ease-out',
                    isOpen && 'rotate-180 text-brand-navy'
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
                className="p-5 pt-3 text-sm sm:text-base text-brand-muted leading-relaxed border-t border-slate-100 bg-white"
              >
                <div className="pl-9">{item.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
