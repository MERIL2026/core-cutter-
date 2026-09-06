import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { ShieldCheck, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { mainNavItems } from '../navigation/navData';

export interface FooterProps {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
}

export const Footer: React.FC<FooterProps> = ({
  businessName = 'AC & RCC Core Cutting',
  phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+919876543210',
  whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  city = 'Local Service Area',
}) => {
  const currentYear = new Date().getFullYear();
  const servicesNav = mainNavItems.find((i) => i.label === 'Services');

  return (
    <footer className="w-full bg-brand-navy text-white pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-lg bg-brand-secondary-blue flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5 text-brand-accent-blue" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">{businessName}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Professional local core cutting, RCC drilling, AC drain hole openings, and concrete wall drilling specialists.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-accent-blue font-semibold">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Serving {city} and surrounding areas</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Our Services</h3>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Direct Contact</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-2.5 hover:text-brand-accent-blue transition-colors"
              >
                <Phone className="h-4 w-4 text-brand-accent-blue shrink-0" aria-hidden="true" />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 hover:text-brand-accent-blue transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>WhatsApp Enquiry</span>
              </a>
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
          <p className="mt-2 md:mt-0">Quality RCC & Concrete Drilling Professional</p>
        </div>
      </Container>
    </footer>
  );
};
