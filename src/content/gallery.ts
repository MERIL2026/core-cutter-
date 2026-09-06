import { GalleryItem } from '@/types';

export const galleryCategories: string[] = [
  'AC Core Cutting',
  'RCC Core Cutting',
  'AC Drain Hole',
  'Concrete Wall Drilling',
  'Pipe & Cable Passage',
];

/**
 * Gallery Items
 * Real project documentation showing precision core drilling and wall penetrations.
 */
export const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'AC Copper Pipe Wall Core Cutting',
    image_url: '/images/ac-core-cutting.jpg',
    category: 'AC Core Cutting',
    location: 'Residential Site',
    alt_text: 'Diamond core drilling machine drilling circular hole in concrete wall for AC unit',
    display_order: 1,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Heavy RCC Beam Rebar Coring',
    image_url: '/images/rcc-core-cutting.jpg',
    category: 'RCC Core Cutting',
    location: 'Commercial Building',
    alt_text: 'RCC core cutting machine rig anchored to reinforced concrete beam on construction site',
    display_order: 2,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'Precision Slanted AC Drain Hole',
    image_url: '/images/ac-drain-hole.jpg',
    category: 'AC Drain Hole',
    location: 'Apartment Complex',
    alt_text: 'Clean circular core hole in concrete block wall with AC refrigerant lines and drain pipe',
    display_order: 3,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Solid Concrete Wall Core Penetration',
    image_url: '/images/concrete-wall-drilling.jpg',
    category: 'Concrete Wall Drilling',
    location: 'Industrial Facility',
    alt_text: 'Diamond core drill machine extracting cylindrical concrete slug from structural wall',
    display_order: 4,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'MEP Floor Slab Pipe & Cable Penetrations',
    image_url: '/images/pipe-cable-passage.jpg',
    category: 'Pipe & Cable Passage',
    location: 'Commercial Tower',
    alt_text: 'Plumbing PVC pipes and electrical conduits passing through cored holes in concrete floor slab',
    display_order: 5,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Heavy-Duty Diamond Coring Rig Execution',
    image_url: '/images/custom-core-drilling.jpg',
    category: 'RCC Core Cutting',
    location: 'Infrastructure Site',
    alt_text: 'Professional core drilling contractor operating high powered diamond rotary drill rig',
    display_order: 6,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

