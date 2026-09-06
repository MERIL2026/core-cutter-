import { FAQ } from '@/types';
import { defaultFAQs } from '@/content/faqs';
import { faqSchema } from '@/lib/validations/content';

/**
 * Returns all configured FAQs.
 */
export function getAllFAQs(): FAQ[] {
  return defaultFAQs;
}

/**
 * Returns active published FAQs sorted by display order.
 */
export function getActiveFAQs(): FAQ[] {
  return defaultFAQs
    .filter((faq) => faq.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Returns FAQs associated with a specific service ID (or general FAQs).
 */
export function getFAQsByService(serviceId: string): FAQ[] {
  return defaultFAQs.filter(
    (faq) => faq.is_published && (faq.service_id === serviceId || faq.service_id === null)
  );
}

/**
 * Validates a FAQ object using Zod schema.
 */
export function validateFAQ(faq: unknown): boolean {
  return faqSchema.safeParse(faq).success;
}
