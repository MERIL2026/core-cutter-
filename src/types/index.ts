// Core Entity Types matching approved Database Schema Document v1.0

export interface BusinessProfile {
  id: string;
  business_name: string;
  logo_url?: string | null;
  phone: string;
  whatsapp?: string | null;
  address?: string | null;
  city: string;
  hours?: Record<string, string> | null;
  description?: string | null;
  google_business_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  benefits?: string[] | null;
  process?: { title: string; description: string }[] | null;
  image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  map_reference?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  alt_text: string;
  title?: string | null;
  category: string;
  location?: string | null;
  service_id?: string | null;
  project_date?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number | null;
  source: 'manual' | 'google' | string;
  source_url?: string | null;
  review_date?: string | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  service_id?: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'closed' | 'spam';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  whatsapp_preference: boolean;
  service_id?: string | null;
  location: string;
  message?: string | null;
  status: EnquiryStatus;
  source_page?: string | null;
  created_at: string;
  updated_at: string;
}

export type AllowlistedAnalyticsEvent =
  | 'page_view'
  | 'phone_click'
  | 'whatsapp_click'
  | 'quote_start'
  | 'quote_submit'
  | 'map_click'
  | 'service_cta_click';

export interface AnalyticsEvent {
  id: string;
  event_name: AllowlistedAnalyticsEvent;
  page_path?: string | null;
  service_id?: string | null;
  metadata?: Record<string, unknown> | null;
  occurred_at: string;
}
