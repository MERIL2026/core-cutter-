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
      {/* 1. Vibrant Top Announcement Bar */}
      <div className="bg-brand-orange text-white text-[11px] sm:text-xs font-semibold py-1.5 px-4 border-b border-orange-600/30">
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

      {/* 2. Main Navigation Bar (Spacious, elegant, uncluttered) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <Container>
          <div className="flex h-18 sm:h-20 items-center justify-between gap-2 lg:gap-4">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 sm:space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm shrink-0"
              aria-label="Homepage"
            >
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-dark flex items-center justify-center text-brand-orange shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-base sm:text-lg font-black text-brand-dark tracking-tight leading-none group-hover:text-brand-orange transition-colors">
                    {businessName.split(' ')[0] || 'CONOZ'}<span className="text-brand-orange">.</span>
                    <span className="text-slate-800 font-extrabold text-sm sm:text-base ml-1 hidden sm:inline">Core Cutting</span>
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">
                  Diamond Drilling Standard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Header Action & Mobile Menu */}
            <div className="flex items-center space-x-3 shrink-0 ml-1 sm:ml-2 pl-1 sm:pl-2 lg:ml-3 lg:pl-3 lg:border-l lg:border-gray-200">
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
