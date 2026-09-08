import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { ShieldCheck, Phone, MessageSquare, MapPin, Clock, Lock } from 'lucide-react';
import { mainNavItems, footerQuickLinks } from '../navigation/navData';
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
    <footer className="w-full bg-[#12151B] text-white pt-16 pb-[calc(96px+env(safe-area-inset-bottom,0px))] md:pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-14 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-brand-orange flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-orange/30">
                {businessName ? businessName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white uppercase">
                  {businessName.split(' ')[0] || 'CORE'}<span className="text-brand-orange">.</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Diamond Core Drilling
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Precision rotary diamond core cutting, RCC slab & beam drilling, AC pipe passages, and structural penetrations.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-orange font-bold pt-1">
              <MapPin className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
              <span>Serving {city} and surrounding regions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange"></span> Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              {footerQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-orange hover:translate-x-1 transition-all inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange"></span> Core Services
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              {servicesNav?.children?.map((child) => (
                <li key={child.href}>
                  <Link href={child.href} className="hover:text-brand-orange hover:translate-x-1 transition-all inline-block">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange"></span> Direct Hotline
            </h3>
            <div className="space-y-3.5 text-sm text-slate-300">
              {cleanPhone ? (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center space-x-3 text-white font-bold hover:text-brand-orange transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-800 group-hover:bg-brand-orange flex items-center justify-center transition-colors">
                    <Phone className="h-4 w-4 text-brand-orange group-hover:text-white shrink-0" aria-hidden="true" />
                  </div>
                  <span>{phone}</span>
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 hover:text-brand-orange transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-brand-orange shrink-0" aria-hidden="true" />
                  </div>
                  <span>Contact Our Team</span>
                </Link>
              )}

              {cleanWhatsApp ? (
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-emerald-400 font-bold hover:text-emerald-300 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-800 group-hover:bg-emerald-600 flex items-center justify-center transition-colors">
                    <MessageSquare className="h-4 w-4 text-emerald-400 group-hover:text-white shrink-0" aria-hidden="true" />
                  </div>
                  <span>WhatsApp 24/7 Enquiry</span>
                </a>
              ) : null}

              <div className="flex items-center space-x-3 text-slate-400 text-xs pt-1">
                <Clock className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright & Secret Admin Access */}
        <div className="pt-8 text-center md:flex md:justify-between md:items-center md:text-left text-xs text-slate-500 font-medium">
          <p>© {currentYear} {businessName}. All rights reserved.</p>
          <div className="flex items-center justify-center md:justify-end space-x-3 mt-2 md:mt-0">
            <span className="font-bold text-slate-400">Precision Rotary Diamond Core Cutting Standard</span>
            <Link
              href="/admin/login"
              title="Staff & Owner Portal"
              className="inline-flex items-center space-x-1 text-slate-700 hover:text-brand-orange transition-colors text-[11px] py-0.5 px-1.5 rounded opacity-60 hover:opacity-100"
            >
              <Lock className="h-3 w-3" />
              <span>Staff</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
