/**
 * Canonical Pricing Configuration
 * 
 * Centralized, deterministic pricing configuration for Diamond Core Cutting & Concrete Drilling.
 * 
 * IMPORTANT:
 * - Pricing calculations are executed in code (never hallucinated or estimated by LLM).
 * - When is_configured is false or a rule is missing, the system gracefully tells the customer
 *   that pricing for that criteria is awaiting team confirmation and prepares a quote request.
 */

export interface PricingDiameterTier {
  id: string;
  name: string;
  minInch: number;
  maxInch: number;
  description: string;
  baseRatePerHole: number; // Base rate in INR for standard brick/masonry wall up to 9-10"
}

export interface MaterialFactor {
  id: string;
  name: string;
  multiplier: number;
}

export interface ThicknessFactor {
  id: string;
  name: string;
  minInch: number;
  maxInch: number;
  multiplier: number;
}

export interface VolumeDiscountTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface ServicePricingConfig {
  serviceSlug: string;
  isConfigured: boolean;
  pricingMode: 'per_hole' | 'per_foot' | 'custom_quote';
  currency: string;
  minimumBillingCharge?: number;
  diameterTiers: PricingDiameterTier[];
  materialFactors: MaterialFactor[];
  thicknessFactors: ThicknessFactor[];
  volumeDiscounts: VolumeDiscountTier[];
  slurryGuardSurchargePerJob?: number;
}

export interface CanonicalPricingSystem {
  isGloballyConfigured: boolean;
  currency: string;
  services: Record<string, ServicePricingConfig>;
}

export const canonicalPricingConfig: CanonicalPricingSystem = {
  isGloballyConfigured: true,
  currency: 'INR',
  services: {
    'ac-core-cutting': {
      serviceSlug: 'ac-core-cutting',
      isConfigured: true,
      pricingMode: 'per_hole',
      currency: 'INR',
      minimumBillingCharge: 800,
      diameterTiers: [
        {
          id: 'tier-2-inch',
          name: '2.0 inch (50mm)',
          minInch: 1.5,
          maxInch: 2.2,
          description: 'AC Drain / Water pipe',
          baseRatePerHole: 600,
        },
        {
          id: 'tier-3-inch',
          name: '2.5 - 3.0 inch (65-75mm)',
          minInch: 2.3,
          maxInch: 3.5,
          description: 'Standard 1-2 Ton Split AC Copper & Sleeve',
          baseRatePerHole: 850,
        },
        {
          id: 'tier-4-5-inch',
          name: '4.0 - 5.0 inch (100-125mm)',
          minInch: 3.6,
          maxInch: 5.5,
          description: 'Kitchen Chimney / VRV / Duct Sleeve',
          baseRatePerHole: 1300,
        },
        {
          id: 'tier-6-inch-plus',
          name: '6.0+ inch (150mm+)',
          minInch: 5.6,
          maxInch: 12.0,
          description: 'Heavy Commercial MEP & Exhaust Passages',
          baseRatePerHole: 2000,
        },
      ],
      materialFactors: [
        { id: 'aac', name: 'AAC Block / Siporex', multiplier: 0.85 },
        { id: 'brick', name: 'Red Clay Brick / Masonry', multiplier: 1.0 },
        { id: 'rcc', name: 'Heavy RCC Concrete + Rebar', multiplier: 1.4 },
      ],
      thicknessFactors: [
        { id: 'thin', name: '4" - 5" Partition Wall', minInch: 1, maxInch: 5, multiplier: 0.9 },
        { id: 'standard', name: '9" - 10" External Wall', minInch: 6, maxInch: 10, multiplier: 1.0 },
        { id: 'thick', name: '12" - 18"+ Structural Beam/Slab', minInch: 11, maxInch: 24, multiplier: 1.45 },
      ],
      volumeDiscounts: [
        { minQuantity: 10, discountPercentage: 20 },
        { minQuantity: 5, discountPercentage: 15 },
        { minQuantity: 3, discountPercentage: 10 },
      ],
      slurryGuardSurchargePerJob: 300,
    },
    'rcc-core-cutting': {
      serviceSlug: 'rcc-core-cutting',
      isConfigured: true,
      pricingMode: 'per_hole',
      currency: 'INR',
      minimumBillingCharge: 1200,
      diameterTiers: [
        {
          id: 'tier-2-inch-rcc',
          name: '2.0 inch (50mm)',
          minInch: 1.5,
          maxInch: 2.2,
          description: 'RCC Plumbing / Conduit',
          baseRatePerHole: 850,
        },
        {
          id: 'tier-3-inch-rcc',
          name: '2.5 - 3.0 inch (65-75mm)',
          minInch: 2.3,
          maxInch: 3.5,
          description: 'RCC AC Passage through Beam/Slab',
          baseRatePerHole: 1200,
        },
        {
          id: 'tier-4-5-inch-rcc',
          name: '4.0 - 5.0 inch (100-125mm)',
          minInch: 3.6,
          maxInch: 5.5,
          description: 'RCC Heavy Drain / Duct Sleeve',
          baseRatePerHole: 1800,
        },
        {
          id: 'tier-6-inch-plus-rcc',
          name: '6.0+ inch (150mm+)',
          minInch: 5.6,
          maxInch: 12.0,
          description: 'RCC Commercial MEP Penetration',
          baseRatePerHole: 2800,
        },
      ],
      materialFactors: [
        { id: 'rcc', name: 'Reinforced Cement Concrete (RCC)', multiplier: 1.0 },
      ],
      thicknessFactors: [
        { id: 'standard', name: '6" - 9" RCC Slab/Wall', minInch: 1, maxInch: 9, multiplier: 1.0 },
        { id: 'thick', name: '10" - 18"+ Heavy Beam/Column', minInch: 10, maxInch: 24, multiplier: 1.5 },
      ],
      volumeDiscounts: [
        { minQuantity: 10, discountPercentage: 20 },
        { minQuantity: 5, discountPercentage: 15 },
        { minQuantity: 3, discountPercentage: 10 },
      ],
    },
    'ac-drain-hole': {
      serviceSlug: 'ac-drain-hole',
      isConfigured: true,
      pricingMode: 'per_hole',
      currency: 'INR',
      minimumBillingCharge: 600,
      diameterTiers: [
        {
          id: 'tier-2-inch-drain',
          name: '2.0 inch Slanted Drain',
          minInch: 1.5,
          maxInch: 2.5,
          description: 'Gravity-sloped AC Drain Hole',
          baseRatePerHole: 600,
        },
      ],
      materialFactors: [
        { id: 'brick', name: 'Brick / AAC Wall', multiplier: 1.0 },
        { id: 'rcc', name: 'RCC Beam / Lintel', multiplier: 1.4 },
      ],
      thicknessFactors: [
        { id: 'standard', name: 'Standard Wall (up to 9")', minInch: 1, maxInch: 9, multiplier: 1.0 },
      ],
      volumeDiscounts: [
        { minQuantity: 5, discountPercentage: 15 },
        { minQuantity: 3, discountPercentage: 10 },
      ],
    },
    'concrete-wall-drilling': {
      serviceSlug: 'concrete-wall-drilling',
      isConfigured: true,
      pricingMode: 'per_hole',
      currency: 'INR',
      minimumBillingCharge: 800,
      diameterTiers: [
        {
          id: 'tier-std-concrete',
          name: '2.0 - 4.0 inch',
          minInch: 2.0,
          maxInch: 4.0,
          description: 'Precision Concrete Core Drilling',
          baseRatePerHole: 950,
        },
      ],
      materialFactors: [
        { id: 'concrete', name: 'Solid Concrete', multiplier: 1.0 },
      ],
      thicknessFactors: [
        { id: 'standard', name: 'Standard Depth', minInch: 1, maxInch: 10, multiplier: 1.0 },
      ],
      volumeDiscounts: [
        { minQuantity: 5, discountPercentage: 15 },
      ],
    },
    'pipe-cable-passage': {
      serviceSlug: 'pipe-cable-passage',
      isConfigured: true,
      pricingMode: 'per_hole',
      currency: 'INR',
      minimumBillingCharge: 800,
      diameterTiers: [
        {
          id: 'tier-mep-passage',
          name: '2.0 - 5.0 inch MEP Passage',
          minInch: 2.0,
          maxInch: 5.0,
          description: 'Plumbing & Electrical Cable Openings',
          baseRatePerHole: 900,
        },
      ],
      materialFactors: [
        { id: 'brick', name: 'Brick / Masonry', multiplier: 1.0 },
        { id: 'rcc', name: 'RCC Concrete', multiplier: 1.4 },
      ],
      thicknessFactors: [
        { id: 'standard', name: 'Standard Depth', minInch: 1, maxInch: 10, multiplier: 1.0 },
      ],
      volumeDiscounts: [
        { minQuantity: 5, discountPercentage: 15 },
      ],
    },
    'other-services': {
      serviceSlug: 'other-services',
      isConfigured: false, // Custom quote required for specialized/industrial coring
      pricingMode: 'custom_quote',
      currency: 'INR',
      diameterTiers: [],
      materialFactors: [],
      thicknessFactors: [],
      volumeDiscounts: [],
    },
  },
};
