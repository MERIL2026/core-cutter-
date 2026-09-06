import { Service } from '@/types';
import { canonicalServices } from '@/content/services';
import { serviceSchema } from '@/lib/validations/content';

/**
 * Returns all configured services.
 */
export function getAllServices(): Service[] {
  return canonicalServices;
}

/**
 * Returns all published/active services sorted by display_order.
 */
export function getActiveServices(): Service[] {
  return canonicalServices
    .filter((service) => service.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Retrieves a single service by its unique slug.
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return canonicalServices.find((service) => service.slug === slug);
}

/**
 * Validates a service object using Zod schema.
 */
export function validateService(service: unknown): boolean {
  return serviceSchema.safeParse(service).success;
}
