import { Service } from '@/types';

/**
 * Six Canonical Service Categories
 * Approved by System Architecture and Project Brief specifications.
 */
export const canonicalServices: Service[] = [
  {
    id: 'srv-ac-core-cutting',
    slug: 'ac-core-cutting',
    name: 'AC Core Cutting',
    summary:
      'Clean, accurate 2 to 5 inch circular wall openings for split and window AC copper refrigerant pipes and electrical conduit.',
    description:
      'Precision diamond core drilling specifically designed for split and multi-split air conditioning installations. We drill smooth, crack-free circular holes through brick walls, plaster, and reinforced concrete surfaces, allowing clean passage for copper refrigerant tubing, drain piping, and power wiring.',
    benefits: [
      'Perfect circular holes from 2 to 5 inches diameter',
      'Vibration-free diamond drilling protects wall structure',
      'Smooth edges requiring zero plaster patching or repair',
      'Clean dry or wet drilling options for occupied homes',
    ],
    process: [
      {
        title: 'Marking & Inspection',
        description: 'Precise position marking verifying slope angle, concealed electrical conduits, and wall depth.',
      },
      {
        title: 'Rig Setup & Protection',
        description: 'Securing diamond coring machinery and laying protective drop cloths to keep work areas neat.',
      },
      {
        title: 'Precision Diamond Drilling',
        description: 'Low-vibration core cutting using premium diamond-tipped barrel bits through the wall structure.',
      },
      {
        title: 'Core Removal & Cleanup',
        description: 'Extracting the clean cylindrical concrete core and clearing debris for AC technician installation.',
      },
    ],
    image_url: '/images/ac-core-cutting.jpg',
    seo_title: 'AC Core Cutting Service | Precision Wall Hole Drilling',
    seo_description:
      'Expert diamond AC core cutting services for split and window AC installation. Clean 2-5 inch circular wall openings with zero vibration damage.',
    is_published: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-rcc-core-cutting',
    slug: 'rcc-core-cutting',
    name: 'RCC Core Cutting',
    summary:
      'Heavy-duty diamond core drilling through heavily reinforced cement concrete (RCC) beams, slabs, and shear walls.',
    description:
      'Specialized industrial diamond core cutting engineered to penetrate reinforced cement concrete (RCC) with heavy embedded steel rebar. Utilizing high-torque water-cooled rigs, we cut exact cylindrical holes without transferring shock waves or inducing micro-cracks into the structural framework.',
    benefits: [
      'Cuts seamlessly through dense concrete and heavy rebar',
      'Zero structural impact or micro-fracturing on load-bearing elements',
      'Available for floor slabs, columns, shear walls, and beams',
      'Custom diameters from 2 inches up to heavy industrial sizes',
    ],
    process: [
      {
        title: 'Structural Assessment',
        description: 'Reviewing drilling locations to maintain structural integrity and verify rebar patterns.',
      },
      {
        title: 'Heavy Rig Anchoring',
        description: 'Firm anchoring of heavy-duty core drilling rig for vibration-free execution.',
      },
      {
        title: 'Water-Cooled Coring',
        description: 'Controlled wet diamond drilling that suppresses dust while cutting smoothly through rebar.',
      },
      {
        title: 'Slug Extraction & Inspection',
        description: 'Removing concrete/rebar slug and inspecting the finished opening for exact diameter tolerance.',
      },
    ],
    image_url: '/images/rcc-core-cutting.jpg',
    seo_title: 'RCC Core Cutting Services | Reinforced Concrete Drilling',
    seo_description:
      'Heavy-duty RCC core cutting for concrete slabs, beams, and shear walls. Vibration-free diamond drilling through steel rebar with precision.',
    is_published: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-ac-drain-hole',
    slug: 'ac-drain-hole',
    name: 'AC Drain Hole',
    summary:
      'Slanted precision drilling for smooth gravity-fed AC condensate water drainage without water stagnation or leaks.',
    description:
      'Specialized angled core drilling for air conditioner drain pipes. Ensuring a continuous downward gravity slope is essential to prevent indoor water leakage, moisture accumulation, and drain line backflow in residential and commercial premises.',
    benefits: [
      'Accurate downward angle ensures optimal gravity water flow',
      'Prevents indoor water leakage and mold damage',
      'Smooth inner surface prevents dirt buildup in drainage sleeve',
      'Compact drilling suitable for tight corners and balcony exits',
    ],
    process: [
      {
        title: 'Slope Calculation',
        description: 'Determining the required downward angle from indoor unit tray to external drain point.',
      },
      {
        title: 'Angle Rig Alignment',
        description: 'Calibrating the core drilling tool to the exact angle required for seamless drainage.',
      },
      {
        title: 'Controlled Core Drilling',
        description: 'Drilling the angled drain hole through brick, masonry, or concrete walls.',
      },
      {
        title: 'Drain Line Testing',
        description: 'Verifying continuous downward slope and clearance for standard drain hoses.',
      },
    ],
    image_url: '/images/ac-drain-hole.jpg',
    seo_title: 'AC Drain Hole Drilling | Angled Drainage Core Cutting',
    seo_description:
      'Professional AC drain hole core cutting with proper downward slope to ensure smooth condensate drainage and eliminate indoor water leaks.',
    is_published: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-concrete-wall-drilling',
    slug: 'concrete-wall-drilling',
    name: 'Concrete Wall Drilling',
    summary:
      'Circular core drilling in solid concrete, block work, and brick masonry walls for clean architectural penetrations.',
    description:
      'Comprehensive concrete wall drilling services for residential renovations, commercial retrofits, and new building construction. We provide clean, smooth cylindrical openings that eliminate the need for destructive hammer-and-chisel methods.',
    benefits: [
      'Clean circular openings without perimeter chipping',
      'Suitable for solid concrete, AAC blocks, fly ash, and red brick',
      'Minimized noise, dust, and structural disturbance',
      'Flexible depth capabilities for thick external boundary walls',
    ],
    process: [
      {
        title: 'Opening Layout & Sizing',
        description: 'Marking opening center points according to architectural and MEP drawings.',
      },
      {
        title: 'Equipment Positioning',
        description: 'Aligning specialized diamond coring equipment to match target wall material.',
      },
      {
        title: 'Drilling Execution',
        description: 'Executing smooth circular cut maintaining perpendicular alignment throughout wall thickness.',
      },
      {
        title: 'Site Cleanliness',
        description: 'Extracting debris and leaving the opening ready for immediate sleeve installation.',
      },
    ],
    image_url: '/images/concrete-wall-drilling.jpg',
    seo_title: 'Concrete Wall Drilling | Diamond Core Wall Penetrations',
    seo_description:
      'Precise concrete wall drilling and diamond coring services for residential and commercial walls. No chipping, clean edges, and rapid turnaround.',
    is_published: true,
    display_order: 4,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-pipe-cable-passage',
    slug: 'pipe-cable-passage',
    name: 'Pipe & Cable Passage',
    summary:
      'Precision openings for plumbing pipelines, electrical conduits, gas lines, and HVAC ducting penetrations.',
    description:
      'Dedicated core cutting solutions for plumbing, electrical, and MEP (Mechanical, Electrical, Plumbing) contractors. We deliver accurately dimensioned circular passages through floors, slabs, and partitions for water supply lines, sanitary drainage pipes, and power cable bundles.',
    benefits: [
      'Tailored hole sizes matched exactly to pipe sleeve diameters',
      'Floor and vertical wall drilling with equal precision',
      'Preserves surrounding waterproofing and structural integrity',
      'High-speed multi-hole execution for commercial MEP projects',
    ],
    process: [
      {
        title: 'MEP Coordination',
        description: 'Aligning hole locations and pipe sleeve clearances with plumbing and electrical layouts.',
      },
      {
        title: 'Setup & Containment',
        description: 'Setting up containment for water and dust control during floor and wall coring.',
      },
      {
        title: 'Penetration Coring',
        description: 'Drilling multiple passages accurately aligned across floor slabs or utility shafts.',
      },
      {
        title: 'Verification',
        description: 'Checking dimensions and pipe fitment clearance with contractor requirements.',
      },
    ],
    image_url: '/images/pipe-cable-passage.jpg',
    seo_title: 'Pipe & Cable Passage Core Cutting | MEP Penetration Drilling',
    seo_description:
      'Accurate diamond core cutting for plumbing pipes, electrical conduit, and HVAC cables. Clean floor and wall penetrations for MEP contractors.',
    is_published: true,
    display_order: 5,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-other-services',
    slug: 'other',
    name: 'Other Services',
    summary:
      'Custom diameter coring, specialized opening requirements, and customized drilling solutions upon request.',
    description:
      'Specialized diamond cutting and coring services for non-standard requirements. From anchor bolt holes and exhaust duct openings to stitch coring for larger apertures and specialized industrial penetrations, we provide tailored drilling solutions.',
    benefits: [
      'Custom hole diameters and specialized depths on request',
      'Stitch drilling solutions for square or rectangular wall openings',
      'Support for commercial kitchens, chimney vents, and industrial equipment',
      'Expert advice for unusual structural drilling scenarios',
    ],
    process: [
      {
        title: 'Requirement Consultation',
        description: 'Discussing project specifics, dimensions, wall thickness, and site conditions.',
      },
      {
        title: 'Technical Planning',
        description: 'Selecting appropriate diamond tooling and method statement for non-standard cuts.',
      },
      {
        title: 'Custom Execution',
        description: 'Executing tailored coring or stitch drilling according to custom project specifications.',
      },
      {
        title: 'Handover & Review',
        description: 'Reviewing opening dimensions and ensuring complete customer satisfaction.',
      },
    ],
    image_url: '/images/custom-core-drilling.jpg',
    seo_title: 'Custom Core Cutting & Specialized Drilling Services',
    seo_description:
      'Custom diameter diamond core cutting and specialized concrete drilling solutions for unique residential, commercial, and industrial requirements.',
    is_published: true,
    display_order: 6,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];
