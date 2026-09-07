import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Hero,
  TrustSection,
  ServicesOverview,
  ChippingVsCoringSlider,
  ProcessSection,
  AreaChecker,
  PhotoEstimatorCard,
  RecentWorkSection,
  ReviewsSection,
  FAQPreview,
  FinalCTASection,
} from '@/components/home';
import { CostEstimator } from '@/components/calculator';
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

        {/* 5. Interactive Comparison: Hammer Chipping vs Diamond Coring */}
        <ChippingVsCoringSlider />

        {/* 6. Interactive Live Cost Estimator */}
        <section className="py-16 md:py-20 bg-slate-950 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <CostEstimator />
          </div>
        </section>

        {/* 7. How It Works: 5-Step Frictionless Workflow */}
        <ProcessSection />

        {/* 8. WhatsApp Photo Feasibility & Area Dispatch Check */}
        <section className="py-16 md:py-20 bg-brand-bg px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto space-y-10">
            <PhotoEstimatorCard />
            <AreaChecker />
          </div>
        </section>

        {/* 9. Recent Work / Project Gallery Preview */}
        <RecentWorkSection
          galleryItems={galleryItems}
          categories={galleryCategories}
        />

        {/* 10. Customer Reviews & Social Proof */}
        <ReviewsSection reviews={reviews} />

        {/* 11. FAQ Preview: Clear Answers to Common Objections */}
        <FAQPreview faqs={faqs} />

        {/* 12. Final CTA & Quote Request Form */}
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
