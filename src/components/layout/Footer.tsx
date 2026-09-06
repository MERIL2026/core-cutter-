import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { ShieldCheck, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { mainNavItems } from '../navigation/navData';
import { defaultBusinessProfile } from '@/content/business';

export interface FooterProps {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
}

export const Footer: React.FC<FooterProps> = ({
  businessName = defaultBusinessProfile.business_name || 'AC & RCC Core Cutting Services',
  phone = defaultBusinessProfile.phone,
  whatsapp = defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone,
  city = defaultBusinessProfile.city,
}) => {
  const currentYear = new Date().getFullYear();
  const servicesNav = mainNavItems.find((i) => i.label === 'Services');
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
  const cleanWhatsApp = whatsapp ? whatsapp.replace(/\D/g, '') : '';

  return (
    <footer className="w-full bg-[#091F33] text-white pt-14 pb-24 md:pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-lg bg-brand-navy border border-brand-accent-blue/30 flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5 text-brand-accent-blue" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">{businessName}</span>
            </div>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Professional local diamond core cutting, RCC slab drilling, AC drain hole openings, and concrete penetrations.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-accent-blue font-semibold">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Serving {city} and surrounding areas</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-accent-blue transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Core Solutions</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {servicesNav?.children?.map((child) => (
                <li key={child.href}>
                  <Link href={child.href} className="hover:text-brand-accent-blue transition-colors">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Direct Contact</h3>
            <div className="space-y-3 text-sm text-slate-300">
              {cleanPhone ? (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center space-x-2.5 hover:text-brand-accent-blue transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-accent-blue shrink-0" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="flex items-center space-x-2.5 hover:text-brand-accent-blue transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-accent-blue shrink-0" aria-hidden="true" />
                  <span>Contact Our Team</span>
                </Link>
              )}

              {cleanWhatsApp ? (
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-brand-accent-blue transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>WhatsApp Enquiry</span>
                </a>
              ) : null}

              <div className="flex items-center space-x-2.5 text-slate-400 text-xs pt-1">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-6 text-center md:flex md:justify-between md:text-left text-xs text-slate-400">
          <p>© {currentYear} {businessName}. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium">Precision Diamond Rotary Coring Standard</p>
        </div>
      </Container>
    </footer>
  );
};
