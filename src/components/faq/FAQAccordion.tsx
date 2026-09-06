'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '../../types';
import { clsx } from 'clsx';

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
    <div className={clsx('space-y-3.5', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `faq-trigger-${item.id}`;
        const contentId = `faq-content-${item.id}`;

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs transition-colors duration-150"
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(item.id)}
                className={clsx(
                  'w-full flex items-center justify-between p-5 text-left font-bold text-base sm:text-lg transition-colors duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue focus-visible:ring-inset',
                  {
                    'text-brand-navy bg-brand-light-blue/30': isOpen,
                    'text-brand-text hover:text-brand-navy hover:bg-brand-bg': !isOpen,
                  }
                )}
              >
                <span className="pr-4">{item.question}</span>
                <ChevronDown
                  className={clsx(
                    'h-5 w-5 shrink-0 text-brand-secondary-blue transition-transform duration-200',
                    {
                      'rotate-180': isOpen,
                    }
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
                className="p-5 pt-2 text-sm sm:text-base text-brand-muted leading-relaxed border-t border-brand-border/40 animate-in fade-in duration-200"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
