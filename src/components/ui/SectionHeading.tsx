import React from 'react';
import { clsx } from 'clsx';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        'max-w-3xl mb-10 md:mb-14',
        {
          'text-center mx-auto': align === 'center',
          'text-left': align === 'left',
        },
        className
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          {align === 'center' && <span className="h-0.5 w-6 bg-brand-orange/60 inline-block"></span>}
          <span
            className={clsx(
              'text-xs font-black uppercase tracking-wider',
              {
                'text-brand-orange': !light,
                'text-brand-orange-light bg-brand-orange/20 px-3 py-1 rounded-full border border-brand-orange/30': light,
              }
            )}
          >
            {`// ${eyebrow.replace(/^\/\/\s*/, '')}`}
          </span>
          {align === 'center' && <span className="h-0.5 w-6 bg-brand-orange/60 inline-block"></span>}
        </div>
      )}
      <h2
        className={clsx(
          'text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight',
          {
            'text-brand-navy': !light,
            'text-white': light,
          }
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={clsx(
            'mt-3 md:mt-4 text-base sm:text-lg leading-relaxed',
            {
              'text-brand-muted': !light,
              'text-slate-300': light,
            }
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
