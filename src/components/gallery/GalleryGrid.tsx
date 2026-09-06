'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '../../types';
import { Camera, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

export interface GalleryGridProps {
  items: GalleryItem[];
  categories?: string[];
  showCategoryFilter?: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  categories = [],
  showCategoryFilter = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const allCategories = ['All', ...categories];

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-brand-border bg-white">
        <Camera className="mx-auto h-12 w-12 text-brand-muted/60" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-bold text-brand-navy">No Project Photos Available</h3>
        <p className="mt-1 text-sm text-brand-muted max-w-md mx-auto">
          Real project photographs of AC core cutting and RCC drilling will appear here once updated by the owner.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Gallery Categories">
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue',
                {
                  'bg-brand-navy text-white shadow-xs': selectedCategory === category,
                  'bg-white text-brand-text border border-brand-border hover:bg-brand-light-blue/40':
                    selectedCategory !== category,
                }
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative aspect-4/3 w-full bg-brand-light-blue/30 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.alt_text}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 text-white" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-secondary-blue bg-brand-light-blue px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                {item.location && (
                  <span className="inline-flex items-center text-xs text-brand-muted">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}
                  </span>
                )}
              </div>
              {item.title && (
                <h4 className="mt-2 text-base font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                  {item.title}
                </h4>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
