import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export type CTAType = 'call' | 'whatsapp' | 'quote';

export interface ContactCTAProps {
  type: CTAType;
  label?: string;
  phone?: string;
  whatsapp?: string;
  quoteHref?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  type,
  label,
  phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+919876543210',
  whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  quoteHref = '/contact',
  variant,
  size = 'md',
  fullWidth = false,
  className,
}) => {
  if (type === 'call') {
    const displayLabel = label || 'Call Now';
    const href = `tel:${phone.replace(/\s+/g, '')}`;
    return (
      <a
        href={href}
        aria-label={`Call business at ${phone}`}
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150',
          'min-h-[44px] min-w-[44px] touch-manipulation select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue focus-visible:ring-offset-2',
          {
            'bg-brand-navy text-white hover:bg-[#09233B] shadow-sm hover:shadow':
              variant === 'primary' || (!variant && true),
            'bg-brand-secondary-blue text-white hover:bg-[#1C5172]':
              variant === 'secondary',
            'bg-brand-light-blue text-brand-navy hover:bg-[#CBE4F5]':
              variant === 'accent',
            'border-2 border-brand-border bg-white text-brand-navy hover:border-brand-navy':
              variant === 'outline',
          },
          {
            'px-3.5 py-2 text-xs sm:text-sm gap-1.5': size === 'sm',
            'px-5 py-2.5 text-sm sm:text-base gap-2': size === 'md',
            'px-6 py-3.5 text-base sm:text-lg gap-2.5': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{displayLabel}</span>
      </a>
    );
  }

  if (type === 'whatsapp') {
    const displayLabel = label || 'WhatsApp';
    const cleanWhatsApp = whatsapp.replace(/\D/g, '');
    const href = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello! I would like to inquire about your core cutting / drilling services.')}`;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150',
          'min-h-[44px] min-w-[44px] touch-manipulation select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
          {
            'bg-[#128C7E] text-white hover:bg-[#075E54] shadow-sm hover:shadow':
              !variant || variant === 'primary',
            'bg-brand-light-blue text-[#075E54] hover:bg-[#CBE4F5]':
              variant === 'accent',
            'border-2 border-[#128C7E] bg-white text-[#128C7E] hover:bg-[#128C7E] hover:text-white':
              variant === 'outline',
          },
          {
            'px-3.5 py-2 text-xs sm:text-sm gap-1.5': size === 'sm',
            'px-5 py-2.5 text-sm sm:text-base gap-2': size === 'md',
            'px-6 py-3.5 text-base sm:text-lg gap-2.5': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
      >
        <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{displayLabel}</span>
      </a>
    );
  }

  // Quote CTA
  const displayLabel = label || 'Get a Quote';
  return (
    <Link
      href={quoteHref}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150',
        'min-h-[44px] min-w-[44px] touch-manipulation select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue focus-visible:ring-offset-2',
        {
          'bg-brand-secondary-blue text-white hover:bg-[#1C5172] shadow-sm hover:shadow':
            !variant || variant === 'primary' || variant === 'secondary',
          'bg-brand-light-blue text-brand-navy hover:bg-[#CBE4F5]':
            variant === 'accent',
          'border-2 border-brand-secondary-blue text-brand-secondary-blue bg-white hover:bg-brand-secondary-blue hover:text-white':
            variant === 'outline',
        },
        {
          'px-3.5 py-2 text-xs sm:text-sm gap-1.5': size === 'sm',
          'px-5 py-2.5 text-sm sm:text-base gap-2': size === 'md',
          'px-6 py-3.5 text-base sm:text-lg gap-2.5': size === 'lg',
          'w-full': fullWidth,
        },
        className
      )}
    >
      <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </Link>
  );
};
