'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Drill, Disc, Layers, Building2, Cpu, Wrench } from 'lucide-react';
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
  'ac-core-cutting': <Drill className="h-6 w-6" aria-hidden="true" />,
  'rcc-core-cutting': <Disc className="h-6 w-6" aria-hidden="true" />,
  'ac-drain-hole': <Layers className="h-6 w-6" aria-hidden="true" />,
  'concrete-wall-drilling': <Building2 className="h-6 w-6" aria-hidden="true" />,
  'pipe-cable-passage': <Cpu className="h-6 w-6" aria-hidden="true" />,
  'other': <Wrench className="h-6 w-6" aria-hidden="true" />,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  slug = service?.slug || '',
  name = service?.name || '',
  summary = service?.summary || '',
  image_url = service?.image_url,
  className,
}) => {
  const href = `/services/${slug}`;
  const icon = serviceIcons[slug] || <Drill className="h-6 w-6" aria-hidden="true" />;

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-card-elevated hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300',
        className
      )}
    >
      {/* Top Details & Category Icon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
            {icon}
          </div>
          <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
            Diamond Coring
          </span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-brand-dark group-hover:text-brand-orange transition-colors">
            <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm">
              {name}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed font-normal line-clamp-3">
            {summary}
          </p>
        </div>
      </div>

      {/* Bottom Photo with Floating Circular Orange Action Button */}
      <div className="relative mt-6 pt-2">
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-100">
          {image_url ? (
            <Image
              src={image_url}
              alt={`${name} illustration`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-orange-50 flex items-center justify-center text-brand-orange">
              {icon}
            </div>
          )}
        </div>

        {/* Circular Action Button hovering at the bottom right */}
        <Link
          href={href}
          aria-label={`View details for ${name}`}
          className="absolute -bottom-3 right-4 h-11 w-11 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white shadow-orange-glow flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};
