import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageSquare,
  ShieldCheck,
  Home,
  Drill,
  MapPin,
  Image as ImageIcon,
  Star,
  Info,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { mainNavItems } from './navData';
import { defaultBusinessProfile } from '@/content/business';
import { cn } from '@/lib/utils';

export interface MobileNavProps {
  phone?: string;
  whatsapp?: string;
  businessName?: string;
}

const navIcons: Record<string, React.ReactNode> = {
  '/': <Home className="h-5 w-5 text-brand-orange" />,
  '/services': <Drill className="h-5 w-5 text-brand-orange" />,
  '/service-areas': <MapPin className="h-5 w-5 text-brand-orange" />,
  '/gallery': <ImageIcon className="h-5 w-5 text-brand-orange" />,
  '/reviews': <Star className="h-5 w-5 text-amber-500" />,
  '/about': <Info className="h-5 w-5 text-brand-orange" />,
  '/faq': <HelpCircle className="h-5 w-5 text-brand-orange" />,
  '/contact': <Phone className="h-5 w-5 text-brand-orange" />,
};

export const MobileNav: React.FC<MobileNavProps> = ({
  phone = defaultBusinessProfile.phone,
  whatsapp = defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone,
  businessName = defaultBusinessProfile.business_name,
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/\D/g, '');

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const drawerContent = isOpen && mounted ? (
    <div
      id="mobile-navigation-drawer"
      className="fixed inset-0 z-[99999] flex flex-col bg-white overflow-hidden animate-in fade-in duration-200"
      style={{ height: '100dvh' }}
    >
      {/* 1. Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-200 shrink-0">
        <Link
          href="/"
          onClick={handleClose}
          className="flex items-center space-x-2.5 focus:outline-none"
        >
          <div className="h-9 w-9 rounded-xl bg-brand-dark flex items-center justify-center text-brand-orange shadow">
            <ShieldCheck className="h-5 w-5 text-brand-orange" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-brand-dark leading-tight">
              {businessName}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Menu &amp; Quick Navigation
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-xl text-gray-500 hover:text-brand-dark hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
          aria-label="Close navigation menu"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Scrollable Navigation Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 divide-y divide-gray-100">
        <div className="space-y-1 pb-2">
          <span className="block px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
            Explore Website
          </span>

          {mainNavItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const icon = navIcons[item.href];

            if (item.children) {
              return (
                <div key={item.label} className="rounded-2xl overflow-hidden bg-gray-50/60 border border-gray-100/80 mb-1">
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      className={cn(
                        'flex items-center space-x-3 text-base font-bold transition-colors',
                        isActive ? 'text-brand-orange' : 'text-brand-dark'
                      )}
                    >
                      <span className="h-8 w-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center shrink-0">
                        {icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setServicesExpanded(!servicesExpanded)}
                      className="p-2 text-gray-400 hover:text-brand-dark rounded-lg hover:bg-gray-200/50 transition-colors"
                      aria-label="Toggle service sub-items"
                    >
                      <ChevronDown
                        className={cn('h-5 w-5 transition-transform duration-200', {
                          'rotate-180 text-brand-orange': servicesExpanded,
                        })}
                      />
                    </button>
                  </div>

                  {servicesExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-1 border-t border-gray-200/60 bg-white/70">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={handleClose}
                            className={cn(
                              'flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                              isChildActive
                                ? 'bg-brand-orange text-white shadow-sm'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-brand-orange'
                            )}
                          >
                            <span>{child.label}</span>
                            <ArrowRight className={cn('h-3.5 w-3.5 opacity-60', isChildActive && 'opacity-100 text-white')} />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-150',
                  isActive
                    ? 'bg-brand-orange-light text-brand-orange font-black border border-brand-orange/20 shadow-xs'
                    : 'text-gray-800 font-bold hover:bg-gray-50'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0">
                    {icon}
                  </span>
                  <span className="text-base">{item.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            );
          })}
        </div>

        {/* Quick Dispatch Info Badge */}
        <div className="pt-3 pb-1">
          <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3.5 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                Same-Day Dispatch Ready
              </span>
              <span className="block text-[11px] text-gray-600">
                Precision diamond core drilling with zero vibration cracking.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Direct Action Bar inside Drawer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5 shrink-0 shadow-2xl">
        {/* Primary Quote CTA */}
        <Link
          href="/#quote-section"
          onClick={handleClose}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-sm shadow-orange-glow active:scale-98 transition-all"
        >
          <span>Get Free Instant Quote</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Direct Call & WhatsApp row */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition active:scale-95"
          >
            <Phone className="h-4 w-4 text-brand-orange shrink-0" />
            <span className="truncate">Call: {phone}</span>
          </a>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello! I would like to inquire about core cutting services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="lg:hidden">
      {/* Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-2 rounded-xl text-brand-dark hover:bg-orange-50 hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange min-h-[44px] min-w-[44px] transition-colors border border-gray-200"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="h-6 w-6 text-brand-dark" aria-hidden="true" />
      </button>

      {/* Fullscreen Mobile Drawer via Portal */}
      {mounted && typeof document !== 'undefined' && drawerContent
        ? createPortal(drawerContent, document.body)
        : null}
    </div>
  );
};
