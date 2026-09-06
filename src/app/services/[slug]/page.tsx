import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetailTemplate } from '@/components/services/ServiceDetailTemplate';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structuredData';
import {
  getAllServices,
  getActiveServices,
  getServiceBySlug,
  getRelatedServices,
  getFAQsByService,
  getActiveFAQs,
  getBusinessProfile,
} from '@/lib/content';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested core cutting service could not be found.',
    };
  }

  const title = service.seo_title || `${service.name} | Professional Core Cutting Services`;
  const description = service.seo_description || service.summary;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/services/${service.slug}`,
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const allServices = getActiveServices();
  const relatedServices = getRelatedServices(service.slug, 3);
  const businessProfile = getBusinessProfile();

  // Combine service-specific FAQs with general FAQs
  const serviceFaqs = getFAQsByService(service.id);
  const generalFaqs = getActiveFAQs().filter((f) => f.service_id === null);
  const combinedFaqs = Array.from(
    new Map([...serviceFaqs, ...generalFaqs].map((item) => [item.id, item])).values()
  );

  const serviceSchema = generateServiceSchema(service, businessProfile);
  const faqSchema = generateFAQSchema(combinedFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ]);

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServiceDetailTemplate
        service={service}
        allServices={allServices}
        relatedServices={relatedServices}
        faqs={combinedFaqs}
        businessProfile={businessProfile}
      />
    </>
  );
}
