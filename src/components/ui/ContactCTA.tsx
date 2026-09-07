'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { defaultBusinessProfile } from '@/content/business';
import { trackEvent } from '@/lib/analytics';

export type CTAType = 'call' | 'whatsapp' | 'quote';

export interface ContactCTAProps {
  type: CTAType;
  label?: string;
  phone?: string;
  whatsapp?: string;
  quoteHref?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'pill-orange' | 'pill-dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  type,
  label,
  phone = defaultBusinessProfile.phone,
  whatsapp = defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone,
  quoteHref = '#quote-section',
  variant,
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] touch-manipulation select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 active:scale-[0.98] rounded-full';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs sm:text-sm gap-1.5',
    md: 'px-6 py-2.5 text-sm sm:text-base gap-2',
    lg: 'px-7 py-3.5 text-base sm:text-lg gap-2.5',
  }[size];

  if (type === 'call') {
    const displayLabel = label || (phone ? 'Call Now' : 'Contact Us');
    const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
    const href = cleanPhone ? `tel:${cleanPhone}` : '/contact';

    const variantClasses = {
      primary: 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-orange-glow',
      secondary: 'bg-brand-dark text-white hover:bg-black shadow-md',
      accent: 'bg-brand-orange-light text-brand-orange hover:bg-orange-100',
      outline: 'border-2 border-white/30 text-white hover:bg-white/10 hover:border-white',
      'pill-orange': 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-orange-glow',
      'pill-dark': 'bg-brand-dark text-white hover:bg-black',
    }[variant || 'primary'];

    return (
      <a
        href={href}
        aria-label={cleanPhone ? `Call business at ${phone}` : 'Contact customer support'}
        onClick={() => {
          trackEvent({
            event_name: 'phone_click',
            metadata: { cta_label: displayLabel },
          });
        }}
        className={cn(baseClasses, sizeClasses, variantClasses, fullWidth && 'w-full', className)}
      >
        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center -ml-1">
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </div>
        <span>{displayLabel}</span>
      </a>
    );
  }

  if (type === 'whatsapp') {
    const displayLabel = label || 'WhatsApp';
    const cleanWhatsApp = whatsapp ? whatsapp.replace(/\D/g, '') : '';
    const href = cleanWhatsApp
      ? `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello! I would like to inquire about your core cutting / drilling services.')}`
      : '/contact';

    const variantClasses = {
      primary: 'bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-md',
      secondary: 'bg-[#128C7E] text-white hover:bg-[#075E54] shadow-md',
      accent: 'bg-emerald-50 text-[#075E54] hover:bg-emerald-100',
      outline: 'border-2 border-[#25D366] bg-transparent text-[#25D366] hover:bg-[#25D366] hover:text-white',
      'pill-orange': 'bg-brand-orange text-white hover:bg-brand-orange-hover',
      'pill-dark': 'bg-brand-dark text-white hover:bg-black',
    }[variant || 'primary'];

    return (
      <a
        href={href}
        target={cleanWhatsApp ? '_blank' : '_self'}
        rel={cleanWhatsApp ? 'noopener noreferrer' : undefined}
        aria-label="Chat on WhatsApp"
        onClick={() => {
          trackEvent({
            event_name: 'whatsapp_click',
            metadata: { cta_label: displayLabel },
          });
        }}
        className={cn(baseClasses, sizeClasses, variantClasses, fullWidth && 'w-full', className)}
      >
        <MessageSquare className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
        <span>{displayLabel}</span>
      </a>
    );
  }

  // Quote CTA (Primary Conversion Action)
  const displayLabel = label || 'Get a Quote';
  const variantClasses = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-orange-glow',
    secondary: 'bg-brand-dark text-white hover:bg-black shadow-md',
    accent: 'bg-brand-orange-light text-brand-orange hover:bg-orange-100',
    outline: 'border-2 border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange hover:text-white',
    'pill-orange': 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-orange-glow',
    'pill-dark': 'bg-brand-dark text-white hover:bg-black',
  }[variant || 'primary'];

  return (
    <Link
      href={quoteHref}
      onClick={() => {
        trackEvent({
          event_name: 'quote_start',
          metadata: { cta_label: displayLabel, trigger: 'quote_button_click' },
        });
      }}
      className={cn(
        baseClasses,
        sizeClasses,
        variantClasses,
        'group transition-all duration-200',
        fullWidth && 'w-full',
        className
      )}
    >
      <span>{displayLabel}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
};
