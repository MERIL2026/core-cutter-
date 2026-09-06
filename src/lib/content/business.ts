import { BusinessProfile } from '@/types';
import { defaultBusinessProfile } from '@/content/business';
import { businessProfileSchema } from '@/lib/validations/content';

/**
 * Retrieves the business profile configuration.
 */
export function getBusinessProfile(): BusinessProfile {
  const profile = defaultBusinessProfile;
  // Lightweight runtime validation
  const result = businessProfileSchema.safeParse(profile);
  if (!result.success && process.env.NODE_ENV === 'development') {
    console.warn('Business profile validation warning:', result.error.format());
  }
  return profile;
}
