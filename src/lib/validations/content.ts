import { z } from 'zod';

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const phoneRegex = /^[0-9+()\s-]{7,20}$/;

export const allowlistedAnalyticsEvents = [
  'page_view',
  'phone_click',
  'whatsapp_click',
  'quote_start',
  'quote_submit',
  'map_click',
  'service_cta_click',
] as const;

export const enquiryStatuses = [
  'new',
  'contacted',
  'quoted',
  'closed',
  'spam',
] as const;

export const businessProfileSchema = z.object({
  id: z.string().min(1),
  business_name: z.string().min(2).max(160),
  logo_url: z.string().nullable().optional(),
  phone: z.string().min(5).max(32),
  whatsapp: z.string().max(32).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().min(2).max(100),
  hours: z.record(z.string()).nullable().optional(),
  description: z.string().nullable().optional(),
  google_business_url: z.string().url().nullable().optional().or(z.literal('')),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const serviceProcessStepSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
});

export const serviceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(slugRegex, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  name: z.string().min(2).max(160),
  summary: z.string().min(5).max(300),
  description: z.string().min(10),
  benefits: z.array(z.string()).nullable().optional(),
  process: z.array(serviceProcessStepSchema).nullable().optional(),
  image_url: z.string().nullable().optional(),
  seo_title: z.string().max(180).nullable().optional(),
  seo_description: z.string().max(320).nullable().optional(),
  is_published: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const serviceAreaSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(slugRegex, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  name: z.string().min(2).max(120),
  description: z.string().nullable().optional(),
  map_reference: z.string().nullable().optional(),
  is_published: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  image_url: z.string().min(1),
  alt_text: z.string().min(5).max(300),
  title: z.string().max(180).nullable().optional(),
  category: z.string().min(2).max(80),
  location: z.string().max(120).nullable().optional(),
  service_id: z.string().nullable().optional(),
  project_date: z.string().nullable().optional(),
  is_published: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const reviewSchema = z.object({
  id: z.string().min(1),
  customer_name: z.string().min(2).max(120),
  review_text: z.string().min(5),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  source: z.string().max(60).default('manual'),
  source_url: z.string().url().nullable().optional().or(z.literal('')),
  review_date: z.string().nullable().optional(),
  approved: z.boolean().default(false),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(5).max(300),
  answer: z.string().min(10),
  category: z.string().max(80).nullable().optional(),
  service_id: z.string().nullable().optional(),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const enquirySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(32),
  whatsapp_preference: z.boolean().default(false),
  service_id: z.string().nullable().optional(),
  location: z.string().min(2).max(160),
  message: z.string().nullable().optional(),
  status: z.enum(enquiryStatuses).default('new'),
  source_page: z.string().max(255).nullable().optional(),
  created_at: z.string().datetime().or(z.string()),
  updated_at: z.string().datetime().or(z.string()),
});

export const analyticsEventSchema = z.object({
  id: z.string().min(1),
  event_name: z.enum(allowlistedAnalyticsEvents),
  page_path: z.string().max(255).nullable().optional(),
  service_id: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
  occurred_at: z.string().datetime().or(z.string()),
});

export const siteSettingSchema = z.object({
  key: z.string().min(1).max(80),
  value: z.unknown(),
  updated_at: z.string().datetime().or(z.string()),
});
