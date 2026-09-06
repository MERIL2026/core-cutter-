import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Hero,
  TrustSection,
  ServicesOverview,
  ProcessSection,
  RecentWorkSection,
  ReviewsSection,
  FAQPreview,
  FinalCTASection,
} from '@/components/home';
import {
  getBusinessProfile,
  getActiveServices,
  getActiveGalleryItems,
  getGalleryCategories,
  getApprovedReviews,
  getActiveFAQs,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'AC Core Cutting & RCC Concrete Drilling Services',
  description:
    'Professional diamond AC core cutting, RCC beam/slab drilling, AC drain holes, and concrete wall penetrations with clean vibration-free execution.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const businessProfile = getBusinessProfile();
  const services = getActiveServices();
  const galleryItems = getActiveGalleryItems();
  const galleryCategories = getGalleryCategories();
  const reviews = getApprovedReviews();
  const faqs = getActiveFAQs();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      {/* 1. Header with sticky navigation and direct quote action */}
      <Header
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
      />

      {/* Main Content Sections in Approved Information Architecture Order */}
      <main className="flex-1">
        {/* 2. Hero Section: Primary Service, Value Prop, Conversion Actions */}
        <Hero businessProfile={businessProfile} />

        {/* 3. Trust Section: Core Value Propositions & Capabilities */}
        <TrustSection />

        {/* 4. Services Overview: 6 Canonical Service Categories */}
        <ServicesOverview services={services} />

        {/* 5. How It Works: 5-Step Frictionless Workflow */}
        <ProcessSection />

        {/* 6. Recent Work / Project Gallery Preview */}
        <RecentWorkSection
          galleryItems={galleryItems}
          categories={galleryCategories}
        />

        {/* 7. Customer Reviews & Social Proof */}
        <ReviewsSection reviews={reviews} />

        {/* 8. FAQ Preview: Clear Answers to Common Objections */}
        <FAQPreview faqs={faqs} />

        {/* 9. Final CTA & Quote Request Form */}
        <FinalCTASection
          businessProfile={businessProfile}
          services={services}
        />
      </main>

      {/* 10. Footer with Business Information and Navigation */}
      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
}
