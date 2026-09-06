import { ServiceArea } from '@/types';

/**
 * Service Areas Data
 * 
 * IMPORTANT: No fake geographical areas or unverified locations are invented.
 * These configurable placeholders represent local coverage areas and can be updated with verified local zones.
 */
export const defaultServiceAreas: ServiceArea[] = [
  {
    id: 'area-central-zone',
    slug: 'central-zone',
    name: 'Central Zone',
    description: 'Fast response AC core cutting and diamond drilling across central city sectors and surrounding neighborhoods.',
    map_reference: null,
    is_published: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'area-north-zone',
    slug: 'north-zone',
    name: 'North Zone',
    description: 'Complete residential and commercial core drilling services covering northern residential societies and commercial hubs.',
    map_reference: null,
    is_published: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'area-south-zone',
    slug: 'south-zone',
    name: 'South Zone',
    description: 'Same-day diamond core cutting for split AC installation, plumbing passages, and RCC slabs in southern sectors.',
    map_reference: null,
    is_published: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'area-east-zone',
    slug: 'east-zone',
    name: 'East Zone',
    description: 'Professional core drilling equipment and skilled operators serving eastern residential and industrial areas.',
    map_reference: null,
    is_published: true,
    display_order: 4,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'area-west-zone',
    slug: 'west-zone',
    name: 'West Zone',
    description: 'Reliable concrete drilling and AC drain hole coring services across western suburbs and development zones.',
    map_reference: null,
    is_published: true,
    display_order: 5,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];
