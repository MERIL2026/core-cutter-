import { BusinessProfile, Service, FAQ, ServiceArea } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generates Schema.org LocalBusiness JSON-LD structure using verified canonical data.
 */
export function generateLocalBusinessSchema(
  profile: BusinessProfile,
  serviceAreas: ServiceArea[] = []
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: profile.business_name,
    description: profile.description || undefined,
    url: SITE_URL,
    telephone: profile.phone,
    priceRange: '$$',
  };

  if (profile.address || profile.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: profile.address || undefined,
      addressLocality: profile.city,
      addressCountry: 'IN',
    };
  }

  if (serviceAreas.length > 0) {
    schema.areaServed = serviceAreas.map((area) => ({
      '@type': 'Place',
      name: area.name,
      description: area.description || undefined,
    }));
  }

  if (profile.hours) {
    const openingHoursSpecs = Object.entries(profile.hours).map(([days, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.includes('Monday') ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['Sunday'],
      description: `${days}: ${hours}`,
    }));
    schema.openingHoursSpecification = openingHoursSpecs;
  }

  return schema;
}

/**
 * Generates Schema.org Service JSON-LD structure for canonical service detail pages.
 */
export function generateServiceSchema(service: Service, profile?: BusinessProfile) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.summary,
    url: `${SITE_URL}/services/${service.slug}`,
    serviceType: service.name,
  };

  if (profile) {
    schema.provider = {
      '@type': 'LocalBusiness',
      name: profile.business_name,
      telephone: profile.phone,
      url: SITE_URL,
    };
  }

  return schema;
}

/**
 * Generates Schema.org FAQPage JSON-LD structure for FAQs.
 */
export function generateFAQSchema(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD structure.
 */
export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const fullItems = [{ name: 'Home', url: SITE_URL }, ...items];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`) : undefined,
    })),
  };
}
