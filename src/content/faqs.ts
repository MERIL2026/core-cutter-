import { FAQ } from '@/types';

/**
 * Canonical Frequently Asked Questions
 * Addresses key customer concerns, technical capabilities, and service boundaries.
 */
export const defaultFAQs: FAQ[] = [
  {
    id: 'faq-what-is-core-cutting',
    question: 'What is AC core cutting?',
    answer:
      'AC core cutting is a precision drilling process using specialized diamond-tipped circular barrel bits to cut perfectly round holes through walls, brick masonry, and reinforced concrete. It creates clean openings for AC refrigerant copper pipes, drain pipes, and electrical cables without causing surrounding wall cracks or vibration damage.',
    category: 'General',
    service_id: 'srv-ac-core-cutting',
    display_order: 1,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq-rcc-cutting-capable',
    question: 'Can you cut through RCC (Reinforced Cement Concrete) with rebar?',
    answer:
      'Yes. Our heavy-duty diamond core drilling rigs easily cut through reinforced concrete (RCC), heavy steel reinforcement bars (rebar), beams, columns, and slabs smoothly without damaging the structural integrity of the building.',
    category: 'Technical',
    service_id: 'srv-rcc-core-cutting',
    display_order: 2,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq-hole-sizes-available',
    question: 'What hole sizes and diameters are possible?',
    answer:
      'We offer a wide range of standard and custom core bit diameters, typically ranging from 2 inches (50 mm) to 5 inches (125 mm) for split AC installations, as well as larger custom diameters for industrial ducting, plumbing, and electrical conduits.',
    category: 'Technical',
    service_id: 'srv-ac-core-cutting',
    display_order: 3,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq-job-duration',
    question: 'How long does a typical core cutting job take?',
    answer:
      'A standard core cutting hole through a regular brick or block wall typically takes 15 to 30 minutes. Coring through thick RCC walls or slabs with heavy rebar generally takes 30 to 60 minutes per hole, depending on the wall thickness and concrete hardness.',
    category: 'Service',
    service_id: 'srv-ac-core-cutting',
    display_order: 4,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq-wall-damage-vibration',
    question: 'Will core cutting cause cracks or damage to surrounding walls and paint?',
    answer:
      'No. Unlike destructive traditional chiseling or hammer drilling, diamond core cutting operates using rotary diamond friction without percussion hammering. This ensures completely smooth circular edges with zero vibration, preventing plaster peeling, structural micro-fractures, or wall cracking.',
    category: 'Safety & Quality',
    service_id: 'srv-concrete-wall-drilling',
    display_order: 5,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq-service-areas-coverage',
    question: 'Which areas do you serve?',
    answer:
      'We serve residential, commercial, and industrial sites across the city and surrounding sectors. Contact us directly with your location to confirm immediate technician availability and scheduling.',
    category: 'Service',
    service_id: null,
    display_order: 6,
    is_published: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];
