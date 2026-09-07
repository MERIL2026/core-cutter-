import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { DesktopNav } from '../navigation/DesktopNav';
import { MobileNav } from '../navigation/MobileNav';
import { ContactCTA } from '../ui/ContactCTA';
import { ShieldCheck, Phone, Clock, Mail, MessageSquare } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export interface HeaderProps {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
}

export const Header: React.FC<HeaderProps> = ({
  businessName = defaultBusinessProfile.business_name,
  phone = defaultBusinessProfile.phone,
  whatsapp = defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone,
}) => {
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* 1. Vibrant Top Announcement Bar (like in template) */}
      <div className="bg-brand-orange text-white text-xs font-semibold py-2 px-4 border-b border-orange-600/30">
        <Container>
          <div className="flex items-center justify-between">
            {/* Left: Contact Info */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center space-x-1.5 hover:text-white/90 transition-colors"
                aria-label={`Call ${phone}`}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{phone}</span>
              </a>
              <div className="hidden md:flex items-center space-x-1.5 text-white/90">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Mon-Sat: 8:00 AM - 8:00 PM</span>
              </div>
              <div className="hidden lg:flex items-center space-x-1.5 text-white/90">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>info@corecutting.com</span>
              </div>
            </div>

            {/* Right: WhatsApp / Urgent Hotline */}
            <div className="flex items-center space-x-3">
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about core cutting services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-black/15 hover:bg-black/25 px-2.5 py-1 rounded-full text-white transition-colors"
              >
                <MessageSquare className="h-3 w-3" />
                <span className="hidden sm:inline">WhatsApp Fast Response</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <Container>
          <div className="flex h-18 sm:h-20 items-center justify-between">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm"
              aria-label="Homepage"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-brand-dark flex items-center justify-center text-brand-orange shadow-md group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-brand-orange" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg sm:text-xl font-black text-brand-dark tracking-tight leading-none group-hover:text-brand-orange transition-colors">
                    {businessName}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase mt-1">
                  Diamond Core Drilling &amp; RCC Cutting
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Header Action & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <ContactCTA type="quote" label="Get Free Quote" size="sm" variant="pill-orange" />
              </div>
              <MobileNav phone={phone} whatsapp={whatsapp} businessName={businessName} />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};
