import { SiteSetting } from '@/types';

/**
 * Site Settings and Global Metadata
 */
export const defaultSiteSettings: SiteSetting[] = [
  {
    key: 'site_metadata',
    value: {
      site_name: 'AC Core Cutting Services',
      tagline: 'Precision Diamond Core Cutting & Concrete Drilling Services',
      support_email: '',
      operating_hours: '8:00 AM - 8:00 PM (Daily)',
      emergency_service_available: true,
    },
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    key: 'branding',
    value: {
      primary_color: '#0F172A',
      accent_color: '#0284C7',
      enable_watermark: false,
    },
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];
