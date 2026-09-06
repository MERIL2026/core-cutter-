import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { DesktopNav } from '../navigation/DesktopNav';
import { MobileNav } from '../navigation/MobileNav';
import { ContactCTA } from '../ui/ContactCTA';
import { ShieldCheck } from 'lucide-react';

export interface HeaderProps {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
}

export const Header: React.FC<HeaderProps> = ({
  businessName = 'AC & RCC Core Cutting',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-brand-border shadow-xs transition-shadow">
      <Container>
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo / Brand Slot */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue rounded-sm"
            aria-label="Homepage"
          >
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-brand-navy flex items-center justify-center text-white shadow-xs group-hover:bg-[#09233B] transition-colors">
              <ShieldCheck className="h-6 w-6 text-brand-accent-blue" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold text-brand-navy tracking-tight leading-tight group-hover:text-brand-secondary-blue transition-colors">
                {businessName}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-brand-muted tracking-wide uppercase">
                Professional Drilling & Core Cutting
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Header Action & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <ContactCTA type="quote" size="sm" />
            </div>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
};
