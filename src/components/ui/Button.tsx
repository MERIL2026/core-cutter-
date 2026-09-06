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
          'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150',
          'min-h-[44px] min-w-[44px] touch-manipulation select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
          {
            // Primary: Navy fill, white text
            'bg-brand-navy text-white hover:bg-[#09233B] active:scale-[0.99] shadow-sm hover:shadow':
              variant === 'primary',
            // Secondary: Secondary blue
            'bg-brand-secondary-blue text-white hover:bg-[#1C5172] active:scale-[0.99] shadow-sm':
              variant === 'secondary',
            // Accent: Light blue bg with navy text
            'bg-brand-light-blue text-brand-navy hover:bg-[#CBE4F5] active:scale-[0.99]':
              variant === 'accent',
            // Outline: Bordered
            'border-2 border-brand-border bg-white text-brand-navy hover:border-brand-secondary-blue hover:bg-brand-bg active:scale-[0.99]':
              variant === 'outline',
            // Ghost: Text only
            'text-brand-navy hover:bg-brand-light-blue/50 active:bg-brand-light-blue':
              variant === 'ghost',
          },
          {
            'px-3.5 py-2 text-xs sm:text-sm gap-1.5': size === 'sm',
            'px-5 py-2.5 text-sm sm:text-base gap-2': size === 'md',
            'px-6 py-3.5 text-base sm:text-lg gap-2.5': size === 'lg',
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
