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
    <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" aria-label="Desktop Main Navigation">
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
                  'inline-flex items-center px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-bold rounded-full transition-all duration-150 whitespace-nowrap',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
                  isActive
                    ? 'text-brand-orange font-extrabold bg-brand-orange-light'
                    : 'text-gray-700 hover:text-brand-orange hover:bg-gray-100/80'
                )}
                aria-expanded={dropdownOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={cn(
                    'ml-1 h-3.5 w-3.5 transition-transform duration-200',
                    dropdownOpen && 'rotate-180 text-brand-orange'
                  )}
                  aria-hidden="true"
                />
              </Link>

              {dropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2.5 text-sm font-semibold transition-colors duration-150 whitespace-nowrap',
                          pathname === child.href
                            ? 'bg-brand-orange-light text-brand-orange font-bold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-orange'
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
              'px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-[13px] xl:text-sm font-bold rounded-full transition-all duration-150 whitespace-nowrap',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
              isActive
                ? 'text-brand-orange font-extrabold bg-brand-orange-light'
                : 'text-gray-700 hover:text-brand-orange hover:bg-gray-100/80'
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
