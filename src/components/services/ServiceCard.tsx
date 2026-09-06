import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wrench } from 'lucide-react';
import { clsx } from 'clsx';

export interface ServiceCardProps {
  slug: string;
  name: string;
  summary: string;
  image_url?: string | null;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  slug,
  name,
  summary,
  image_url,
  className,
}) => {
  const href = `/services/${slug}`;

  return (
    <div
      className={clsx(
        'group relative flex flex-col h-full bg-white rounded-xl border border-brand-border shadow-xs hover:shadow-md hover:border-brand-secondary-blue/50 transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {/* Image Container / Visual Slot */}
      <div className="relative w-full h-48 sm:h-52 bg-brand-light-blue/40 overflow-hidden flex items-center justify-center">
        {image_url ? (
          <Image
            src={image_url}
            alt={`${name} service image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-brand-secondary-blue p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform">
              <Wrench className="h-6 w-6 text-brand-navy" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Professional Service
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
          <Link
            href={href}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue rounded-sm after:absolute after:inset-0"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-2 text-sm sm:text-base text-brand-muted leading-relaxed flex-1">
          {summary}
        </p>

        {/* Action link */}
        <div className="mt-5 pt-4 border-t border-brand-border/60 flex items-center justify-between text-sm font-bold text-brand-navy group-hover:text-brand-secondary-blue">
          <span>Learn More</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
