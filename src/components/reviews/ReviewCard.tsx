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
        'flex flex-col h-full bg-white rounded-xl border border-brand-border p-6 shadow-xs relative',
        className
      )}
    >
      <Quote className="absolute top-4 right-4 h-8 w-8 text-brand-light-blue/60" aria-hidden="true" />

      {/* Star Rating */}
      <div className="flex items-center space-x-1 mb-3" aria-label={`Rated ${starsCount} out of 5 stars`}>
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
      <p className="text-sm sm:text-base text-brand-text leading-relaxed flex-1 italic">
        &ldquo;{reviewText}&rdquo;
      </p>

      {/* Author & Meta */}
      <div className="mt-5 pt-4 border-t border-brand-border/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-brand-light-blue text-brand-navy flex items-center justify-center font-bold text-xs">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="block text-sm font-bold text-brand-navy leading-none">
              {customerName}
            </span>
            <span className="inline-flex items-center text-[11px] text-emerald-600 font-medium mt-0.5">
              <CheckCircle className="h-3 w-3 mr-0.5" /> Verified Customer
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-brand-muted">
          <span className="block capitalize font-medium">{source} Review</span>
          {reviewDate && <span className="text-[11px] text-slate-400">{reviewDate}</span>}
        </div>
      </div>
    </div>
  );
};
