import { SiteSetting } from '@/types';
import { defaultSiteSettings } from '@/content/settings';
import { siteSettingSchema } from '@/lib/validations/content';

/**
 * Returns all site settings.
 */
export function getAllSiteSettings(): SiteSetting[] {
  return defaultSiteSettings;
}

/**
 * Retrieves a single site setting by key.
 */
export function getSiteSetting(key: string): SiteSetting | undefined {
  return defaultSiteSettings.find((setting) => setting.key === key);
}

/**
 * Validates a site setting using Zod schema.
 */
export function validateSiteSetting(setting: unknown): boolean {
  return siteSettingSchema.safeParse(setting).success;
}
