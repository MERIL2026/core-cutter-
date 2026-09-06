import { ServiceArea } from '@/types';
import { defaultServiceAreas } from '@/content/serviceAreas';
import { serviceAreaSchema } from '@/lib/validations/content';

/**
 * Returns all configured service areas.
 */
export function getAllServiceAreas(): ServiceArea[] {
  return defaultServiceAreas;
}

/**
 * Returns active published service areas sorted by display order.
 */
export function getActiveServiceAreas(): ServiceArea[] {
  return defaultServiceAreas
    .filter((area) => area.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Retrieves a single service area by its slug.
 */
export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return defaultServiceAreas.find((area) => area.slug === slug);
}

/**
 * Validates a service area object using Zod schema.
 */
export function validateServiceArea(area: unknown): boolean {
  return serviceAreaSchema.safeParse(area).success;
}
