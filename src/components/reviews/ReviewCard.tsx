import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { clsx } from 'clsx';

import { Review } from '@/types';

export interface ReviewCardProps {
  review?: Review;
  customerName?: string;
  reviewText?: string;
  rating?: number | null;
  source?: 'manual' | 'google' | string;
  sourceUrl?: string | null;
  reviewDate?: string | null;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  customerName = review?.customer_name || 'Customer',
  reviewText = review?.review_text || '',
  rating = review?.rating ?? 5,
  source = review?.source || 'Google',
  reviewDate = review?.review_date || null,
  className,
}) => {
  const starsCount = Math.min(5, Math.max(1, rating || 5));

  return (
    <div
      className={clsx(
        'flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 p-7 shadow-card hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 relative group hover:-translate-y-1',
        className
      )}
    >
      <Quote className="absolute top-5 right-5 h-8 w-8 text-orange-100 group-hover:text-orange-200 transition-colors" aria-hidden="true" />

      {/* Star Rating */}
      <div className="flex items-center space-x-1 mb-4" aria-label={`Rated ${starsCount} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={clsx('h-4 w-4', {
              'text-amber-400 fill-amber-400': i < starsCount,
              'text-slate-200': i >= starsCount,
            })}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed flex-1 italic">
        &ldquo;{reviewText}&rdquo;
      </p>

      {/* Author & Meta */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-black text-sm shadow-sm shadow-brand-orange/30">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="block text-sm font-extrabold text-brand-dark leading-none">
              {customerName}
            </span>
            <span className="inline-flex items-center text-[11px] text-emerald-600 font-bold mt-1">
              <CheckCircle className="h-3 w-3 mr-1" /> Verified Customer
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          <span className="block capitalize font-bold text-slate-500">{source} Review</span>
          {reviewDate && <span className="text-[11px] text-slate-400">{reviewDate}</span>}
        </div>
      </div>
    </div>
  );
};
