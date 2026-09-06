import { GalleryItem } from '@/types';
import { defaultGalleryItems, galleryCategories } from '@/content/gallery';
import { galleryItemSchema } from '@/lib/validations/content';

/**
 * Returns all gallery items.
 */
export function getAllGalleryItems(): GalleryItem[] {
  return defaultGalleryItems;
}

/**
 * Returns all active published gallery items sorted by display order.
 */
export function getActiveGalleryItems(): GalleryItem[] {
  return defaultGalleryItems
    .filter((item) => item.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Returns list of supported gallery categories.
 */
export function getGalleryCategories(): string[] {
  return galleryCategories;
}

/**
 * Validates a gallery item using Zod schema.
 */
export function validateGalleryItem(item: unknown): boolean {
  return galleryItemSchema.safeParse(item).success;
}
