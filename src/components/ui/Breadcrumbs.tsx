import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center text-xs sm:text-sm text-brand-muted py-2.5', className)}
    >
      <ol className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="flex items-center text-slate-500 hover:text-brand-orange font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-1.5 sm:space-x-2">
              <ChevronRight className="h-3 w-3 text-brand-orange/60 shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-bold text-brand-dark truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-brand-orange font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
