'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { mainNavItems } from './navData';
import { cn } from '@/lib/utils';

export const DesktopNav: React.FC = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="hidden lg:flex items-center space-x-1" aria-label="Desktop Main Navigation">
      {mainNavItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        if (item.children) {
          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue',
                  isActive
                    ? 'text-brand-navy font-bold bg-brand-light-blue/50'
                    : 'text-brand-text hover:text-brand-navy hover:bg-slate-100'
                )}
                aria-expanded={dropdownOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={cn(
                    'ml-1 h-3.5 w-3.5 transition-transform duration-200',
                    dropdownOpen && 'rotate-180 text-brand-secondary-blue'
                  )}
                  aria-hidden="true"
                />
              </Link>

              {dropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="bg-white rounded-xl shadow-xl border border-brand-border/80 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors duration-150',
                          pathname === child.href
                            ? 'bg-brand-light-blue text-brand-navy font-bold'
                            : 'text-brand-text hover:bg-slate-50 hover:text-brand-navy'
                        )}
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
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
              'px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue',
              isActive
                ? 'text-brand-navy font-bold bg-brand-light-blue/50'
                : 'text-brand-text hover:text-brand-navy hover:bg-slate-100'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
