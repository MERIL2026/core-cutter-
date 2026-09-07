import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-extrabold rounded-full transition-all duration-200',
          'min-h-[44px] min-w-[44px] touch-manipulation select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
          {
            // Primary: Construction Orange
            'bg-brand-orange text-white hover:bg-brand-orange-hover active:scale-[0.98] shadow-md shadow-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/40':
              variant === 'primary',
            // Secondary: Dark Charcoal
            'bg-brand-dark text-white hover:bg-black active:scale-[0.98] shadow-sm hover:shadow-md':
              variant === 'secondary',
            // Accent: Orange tint
            'bg-orange-50 text-brand-orange border border-brand-orange/30 hover:bg-orange-100 active:scale-[0.98]':
              variant === 'accent',
            // Outline: Bordered
            'border-2 border-slate-200 bg-white text-brand-dark hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/20 active:scale-[0.98]':
              variant === 'outline',
            // Ghost: Text only
            'text-brand-dark hover:text-brand-orange hover:bg-orange-50/60 active:bg-orange-100':
              variant === 'ghost',
          },
          {
            'px-4 py-2 text-xs sm:text-sm gap-1.5': size === 'sm',
            'px-6 py-3 text-sm sm:text-base gap-2': size === 'md',
            'px-8 py-3.5 text-base sm:text-lg gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4 mr-2" aria-label="Loading..." />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
