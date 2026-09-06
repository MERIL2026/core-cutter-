'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { mainNavItems } from './navData';
import { clsx } from 'clsx';



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
                className={clsx(
                  'inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue',
                  {
                    'text-brand-navy font-bold': isActive,
                    'text-brand-text hover:text-brand-navy hover:bg-brand-light-blue/50':
                      !isActive,
                  }
                )}
                aria-expanded={dropdownOpen}
              >
                <span>{item.label}</span>
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-150" aria-hidden="true" />
              </Link>

              {dropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-1 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="bg-white rounded-md shadow-lg border border-brand-border py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={clsx(
                          'block px-4 py-2.5 text-sm transition-colors duration-150',
                          {
                            'bg-brand-light-blue text-brand-navy font-semibold':
                              pathname === child.href,
                            'text-brand-text hover:bg-brand-bg hover:text-brand-navy':
                              pathname !== child.href,
                          }
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
            className={clsx(
              'px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue',
              {
                'text-brand-navy font-bold bg-brand-light-blue/60': isActive,
                'text-brand-text hover:text-brand-navy hover:bg-brand-light-blue/40':
                  !isActive,
              }
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
