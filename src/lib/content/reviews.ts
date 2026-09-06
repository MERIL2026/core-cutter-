import { Review } from '@/types';
import { defaultReviews } from '@/content/reviews';
import { reviewSchema } from '@/lib/validations/content';

/**
 * Returns all reviews.
 */
export function getAllReviews(): Review[] {
  return defaultReviews;
}

/**
 * Returns only approved customer reviews.
 */
export function getApprovedReviews(): Review[] {
  return defaultReviews.filter((review) => review.approved);
}

/**
 * Validates a review object using Zod schema.
 */
export function validateReview(review: unknown): boolean {
  return reviewSchema.safeParse(review).success;
}
