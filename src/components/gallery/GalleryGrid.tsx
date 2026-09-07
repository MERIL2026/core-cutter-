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
        <div className="flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="Gallery Categories">
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                'px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
                {
                  'bg-brand-orange text-white shadow-md shadow-brand-orange/20 scale-105': selectedCategory === category,
                  'bg-white text-brand-dark border border-slate-200 hover:border-brand-orange hover:text-brand-orange':
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
            className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.alt_text}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange-light">
                  {item.category}
                </span>
                <span className="text-sm font-extrabold text-white mt-0.5">{item.title}</span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-orange bg-orange-50 border border-brand-orange/20 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                {item.location && (
                  <span className="inline-flex items-center text-xs font-medium text-slate-500">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-brand-orange" />
                    {item.location}
                  </span>
                )}
              </div>
              {item.title && (
                <h4 className="mt-3 text-base font-extrabold text-brand-dark group-hover:text-brand-orange transition-colors">
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
