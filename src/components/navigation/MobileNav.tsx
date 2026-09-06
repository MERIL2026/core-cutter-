'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { mainNavItems } from './navData';
import { ContactCTA } from '../ui/ContactCTA';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

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

  return (
    <div className="lg:hidden">
      {/* Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2.5 rounded-lg text-brand-navy hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue min-h-[44px] min-w-[44px] transition-colors"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      {/* Backdrop & Drawer */}
      {isOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 top-[65px] z-50 flex flex-col bg-white border-t border-brand-border animate-in fade-in duration-200"
        >
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
            {mainNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              if (item.children) {
                return (
                  <div key={item.label} className="border-b border-brand-border/60 pb-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={cn(
                          'py-3 text-lg font-bold transition-colors',
                          isActive ? 'text-brand-navy' : 'text-brand-text'
                        )}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesExpanded(!servicesExpanded)}
                        className="p-2 text-brand-muted hover:text-brand-navy"
                        aria-label="Toggle service sub-items"
                      >
                        <ChevronDown
                          className={cn('h-5 w-5 transition-transform duration-200', {
                            'rotate-180': servicesExpanded,
                          })}
                        />
                      </button>
                    </div>

                    {servicesExpanded && (
                      <div className="pl-4 space-y-2.5 pt-1 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn('block py-2 text-base font-medium transition-colors', {
                              'text-brand-navy font-semibold': pathname === child.href,
                              'text-brand-muted hover:text-brand-navy': pathname !== child.href,
                            })}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-3 text-lg font-bold border-b border-brand-border/60 transition-colors',
                    {
                      'text-brand-navy font-extrabold': isActive,
                      'text-brand-text hover:text-brand-navy': !isActive,
                    }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Action Footer in Drawer */}
          <div className="p-5 border-t border-brand-border bg-slate-50 space-y-3">
            <ContactCTA type="call" fullWidth size="lg" />
            <ContactCTA type="whatsapp" fullWidth size="lg" />
          </div>
        </div>
      )}
    </div>
  );
};
