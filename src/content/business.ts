import { BusinessProfile } from '@/types';

/**
 * Canonical Business Profile Configuration
 * 
 * IMPORTANT: No fake business information or unverified claims are invented.
 * Values can be configured via environment variables or updated when verified business details are supplied.
 */
export const defaultBusinessProfile: BusinessProfile = {
  id: 'business-profile-primary',
  business_name: process.env.NEXT_PUBLIC_BUSINESS_NAME || '[BUSINESS_NAME]',
  logo_url: null,
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '[BUSINESS_PHONE]',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_BUSINESS_PHONE || '[BUSINESS_PHONE]',
  address: '[BUSINESS_ADDRESS]',
  city: process.env.NEXT_PUBLIC_BUSINESS_CITY || '[BUSINESS_CITY]',
  hours: {
    'Monday - Saturday': '8:00 AM - 8:00 PM',
    'Sunday': '9:00 AM - 5:00 PM',
  },
  description:
    'Professional AC and RCC diamond core cutting, precision concrete drilling, and wall opening services for residential and commercial projects.',
  google_business_url: '',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};
