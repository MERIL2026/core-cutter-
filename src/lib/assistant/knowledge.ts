import { canonicalServices } from '@/content/services';
import { defaultFAQs } from '@/content/faqs';
import { defaultServiceAreas } from '@/content/serviceAreas';
import { defaultBusinessProfile } from '@/content/business';
import { canonicalPricingConfig, ServicePricingConfig } from '@/content/pricing';
import { Service, FAQ, ServiceArea, BusinessProfile } from '@/types';

/**
 * Centralized Business Knowledge Layer
 * Strictly retrieves canonical data without fabricating any metrics, pricing, or claims.
 */

export class BusinessKnowledge {
  public static getProfile(): BusinessProfile {
    return defaultBusinessProfile;
  }

  public static getServices(): Service[] {
    return canonicalServices.filter((s) => s.is_published);
  }

  public static getServiceBySlug(slug: string): Service | undefined {
    return canonicalServices.find(
      (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.id.toLowerCase() === slug.toLowerCase()
    );
  }

  public static findMatchingService(query: string): Service | undefined {
    const q = query.toLowerCase();

    // 1. AC Drain Hole
    if (
      q.includes('drain') ||
      q.includes('leak') ||
      q.includes('પાણી') ||
      q.includes('ડ્રેઇન') ||
      q.includes('ड्रेन') ||
      q.includes('पानी टपक')
    ) {
      return canonicalServices.find((s) => s.slug === 'ac-drain-hole');
    }

    // 2. RCC Core Cutting
    if (
      q.includes('rcc') ||
      q.includes('beam') ||
      q.includes('slab') ||
      q.includes('rebar') ||
      q.includes('steel') ||
      q.includes('બીમ') ||
      q.includes('સ્લેબ') ||
      q.includes('સળિયા') ||
      q.includes('सरिया') ||
      q.includes('कंक्रीट')
    ) {
      return canonicalServices.find((s) => s.slug === 'rcc-core-cutting');
    }

    // 3. Pipe & Cable Passage / MEP
    if (
      q.includes('pipe') ||
      q.includes('cable') ||
      q.includes('plumbing') ||
      q.includes('wire') ||
      q.includes('mep') ||
      q.includes('पाइप') ||
      q.includes('तार') ||
      q.includes('વાયરિંગ')
    ) {
      // If AC is also mentioned, prefer AC core cutting
      if (!q.includes('ac') && !q.includes('એસી') && !q.includes('एसी')) {
        return canonicalServices.find((s) => s.slug === 'pipe-cable-passage');
      }
    }

    // 4. Concrete Wall Drilling
    if (
      q.includes('concrete wall') ||
      q.includes('wall drilling') ||
      q.includes('દીવાલ') ||
      q.includes('દીવાલમાં હોલ') ||
      q.includes('दीवार')
    ) {
      if (!q.includes('ac') && !q.includes('એસી') && !q.includes('एसी')) {
        return canonicalServices.find((s) => s.slug === 'concrete-wall-drilling');
      }
    }

    // 5. AC Core Cutting (Default & Primary)
    if (
      q.includes('ac') ||
      q.includes('split') ||
      q.includes('air conditioner') ||
      q.includes('એસી') ||
      q.includes('एसी') ||
      q.includes('hole') ||
      q.includes('હોલ') ||
      q.includes('होल') ||
      q.includes('core cutting') ||
      q.includes('drilling')
    ) {
      return canonicalServices.find((s) => s.slug === 'ac-core-cutting');
    }

    return undefined;
  }

  public static getFaqs(): FAQ[] {
    return defaultFAQs.filter((f) => f.is_published);
  }

  public static findMatchingFaq(query: string): FAQ | undefined {
    const q = query.toLowerCase();

    // Dust & Cleanliness
    if (q.includes('dust') || q.includes('clean') || q.includes('धूल') || q.includes('ધૂળ') || q.includes('slurry')) {
      return defaultFAQs.find((f) => f.id === 'faq-wall-damage-vibration');
    }

    // Vibration & Crack damage
    if (
      q.includes('crack') ||
      q.includes('vibration') ||
      q.includes('damage') ||
      q.includes('તિરાડ') ||
      q.includes('क्रैक') ||
      q.includes('नुकसान')
    ) {
      return defaultFAQs.find((f) => f.id === 'faq-wall-damage-vibration');
    }

    // RCC & Rebar
    if (q.includes('rcc') || q.includes('rebar') || q.includes('steel') || q.includes('सरिया') || q.includes('સળિયા')) {
      return defaultFAQs.find((f) => f.id === 'faq-rcc-cutting-capable');
    }

    // Hole Sizes
    if (q.includes('size') || q.includes('diameter') || q.includes('inch') || q.includes('साइज़') || q.includes('ઇંચ')) {
      return defaultFAQs.find((f) => f.id === 'faq-hole-sizes-available');
    }

    // Job duration
    if (q.includes('time') || q.includes('duration') || q.includes('how long') || q.includes('कितना समय') || q.includes('સમય')) {
      return defaultFAQs.find((f) => f.id === 'faq-job-duration');
    }

    // Service Areas
    if (q.includes('area') || q.includes('location') || q.includes('city') || q.includes('कहां') || q.includes('ક્યાં')) {
      return defaultFAQs.find((f) => f.id === 'faq-service-areas-coverage');
    }

    // What is core cutting
    if (q.includes('what is') || q.includes('kya hai') || q.includes('શું છે')) {
      return defaultFAQs.find((f) => f.id === 'faq-what-is-core-cutting');
    }

    return undefined;
  }

  public static getServiceAreas(): ServiceArea[] {
    return defaultServiceAreas.filter((a) => a.is_published);
  }

  public static findMatchingServiceArea(query: string): { found: boolean; area?: ServiceArea; city: string } {
    const q = query.toLowerCase().trim();
    const city = defaultBusinessProfile.city.toLowerCase();

    // Check city name match
    if (q.includes(city) || city.includes(q)) {
      return { found: true, city: defaultBusinessProfile.city };
    }

    // Check specific registered service areas
    for (const area of defaultServiceAreas) {
      const areaName = area.name.toLowerCase();
      const areaSlug = area.slug.toLowerCase().replace(/-/g, ' ');
      if (q.includes(areaName) || q.includes(areaSlug)) {
        return { found: true, area, city: defaultBusinessProfile.city };
      }
    }

    return { found: false, city: defaultBusinessProfile.city };
  }

  public static getPricingConfig(serviceSlug?: string): ServicePricingConfig | undefined {
    if (!serviceSlug) {
      return canonicalPricingConfig.services['ac-core-cutting'];
    }
    return canonicalPricingConfig.services[serviceSlug];
  }
}
