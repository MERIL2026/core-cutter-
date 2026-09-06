import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Drill, Disc, Building2, Layers, Cpu, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@/types';

export interface ServiceCardProps {
  service?: Service;
  slug?: string;
  name?: string;
  summary?: string;
  image_url?: string | null;
  index?: number;
  className?: string;
}

const serviceIcons: Record<string, React.ReactNode> = {
  'ac-core-cutting': <Drill className="h-5 w-5" aria-hidden="true" />,
  'rcc-core-cutting': <Disc className="h-5 w-5" aria-hidden="true" />,
  'ac-drain-hole': <Layers className="h-5 w-5" aria-hidden="true" />,
  'concrete-wall-drilling': <Building2 className="h-5 w-5" aria-hidden="true" />,
  'pipe-cable-passage': <Cpu className="h-5 w-5" aria-hidden="true" />,
  'other': <Wrench className="h-5 w-5" aria-hidden="true" />,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  slug = service?.slug || '',
  name = service?.name || '',
  summary = service?.summary || '',
  image_url = service?.image_url,
  index,
  className,
}) => {
  const href = `/services/${slug}`;
  const icon = serviceIcons[slug] || <Drill className="h-5 w-5" aria-hidden="true" />;
  const formattedIndex = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;

  return (
    <div
      className={cn(
        'group relative flex flex-col h-full bg-white rounded-xl border border-brand-border/80 shadow-xs hover:shadow-xl hover:border-brand-accent-blue/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden',
        className
      )}
    >
      {/* Top Accent Line that smoothly expands on hover */}
      <div className="h-1 w-10 bg-brand-accent-blue group-hover:w-full transition-all duration-300 ease-out" />

      {/* Image Container / Visual Slot */}
      {image_url ? (
        <div className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden">
          <Image
            src={image_url}
            alt={`${name} service illustration`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : null}

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Header with Icon and Service Index */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 rounded-lg bg-brand-light-blue/60 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
            {icon}
          </div>
          {formattedIndex && (
            <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-brand-secondary-blue transition-colors">
              {formattedIndex}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors leading-snug">
          <Link
            href={href}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue rounded-sm after:absolute after:inset-0"
          >
            {name}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="mt-2.5 text-sm text-brand-muted leading-relaxed flex-1">
          {summary}
        </p>

        {/* Bottom CTA Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-brand-secondary-blue group-hover:text-brand-navy transition-colors">
          <span>View Service Details</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-200" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
