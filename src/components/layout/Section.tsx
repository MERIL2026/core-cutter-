import React from 'react';
import { clsx } from 'clsx';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'white' | 'light' | 'navy';
  spacing?: 'default' | 'compact' | 'spacious';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  background = 'default',
  spacing = 'default',
  id,
  ...props
}) => {
  return (
    <section
      id={id}
      className={clsx(
        'w-full transition-colors duration-200',
        {
          'bg-brand-bg text-brand-text': background === 'default',
          'bg-white text-brand-text': background === 'white',
          'bg-brand-light-blue text-brand-navy': background === 'light',
          'bg-brand-navy text-white': background === 'navy',
        },
        {
          'py-14 sm:py-16 md:py-24 lg:py-28': spacing === 'default',
          'py-10 sm:py-12 md:py-16': spacing === 'compact',
          'py-20 sm:py-24 md:py-32 lg:py-36': spacing === 'spacious',
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
