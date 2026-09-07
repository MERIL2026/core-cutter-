import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getApprovedReviews,
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  MessageSquareQuote,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Customer Reviews | AC & RCC Core Cutting Feedback',
  description:
    'Read verified client testimonials and feedback regarding our AC core cutting, concrete drilling, and wall opening services.',
  alternates: {
    canonical: '/reviews',
  },
};

export default function ReviewsPage() {
  const businessProfile = getBusinessProfile();
  const reviews = getApprovedReviews();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Reviews', url: '/reviews' }]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      <JsonLd data={breadcrumbSchema} />
      {/* 1. Header */}
      <Header
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
      />

      <main className="flex-1">
        {/* 2. Hero */}
        <section className="bg-brand-dark text-white pt-8 pb-16 sm:pb-20 border-b border-slate-800 relative overflow-hidden">
          {/* Hero Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroes/reviews-hero.png"
              alt="Customer Reviews AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            <Breadcrumbs items={[{ label: 'Reviews' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// Verified Client Feedback"}</span>
                </div>

                {/* Exactly One H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Customer Reviews &amp; Testimonials
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Read direct feedback from homeowners, HVAC technicians, electrical contractors, and building developers who rely on our diamond core cutting services.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                  <ContactCTA
                    type="quote"
                    quoteHref="#quote-section"
                    size="md"
                    label="Request a Quote"
                    className="w-full sm:w-auto"
                  />
                  <ContactCTA
                    type="call"
                    phone={businessProfile.phone}
                    size="md"
                    label="Call Technician"
                    variant="outline"
                    className="w-full sm:w-auto border-slate-700 text-white hover:bg-white/10 hover:border-white"
                  />
                  <ContactCTA
                    type="whatsapp"
                    whatsapp={businessProfile.whatsapp || businessProfile.phone}
                    size="md"
                    label="WhatsApp Us"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-orange/10 group">
                  <Image
                    src="/images/ac-core-cutting.jpg"
                    alt="Precision AC wall hole diamond core drilling executed cleanly"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    100% Verified
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Reviews List or Transparent Empty State */}
        <Section background="default" spacing="default" id="reviews-list">
          <Container>
            <SectionHeading
              eyebrow="Client Testimonials"
              title="What Our Customers Say"
              description="Authentic feedback from real core cutting, RCC drilling, and AC drain opening projects."
              align="center"
            />

            <div className="mt-10 sm:mt-12">
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto text-center py-14 px-6 sm:px-10 rounded-2xl border-2 border-dashed border-brand-border bg-white shadow-xs space-y-4">
                  <div className="h-14 w-14 rounded-full bg-brand-light-blue text-brand-navy flex items-center justify-center mx-auto">
                    <MessageSquareQuote className="h-7 w-7 text-brand-secondary-blue" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">Genuine Customer Reviews</h3>
                  <p className="text-sm text-brand-muted leading-relaxed max-w-lg mx-auto">
                    Customer ratings and verified reviews will be published here once approved by genuine clients. We adhere to a strict authenticity policy with zero fabricated or unverified testimonials.
                  </p>
                  <div className="pt-2 flex items-center justify-center space-x-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" aria-hidden="true" />
                    ))}
                    <span className="text-xs font-semibold text-brand-muted ml-2">5-Star Quality Standards</span>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>

        {/* 4. Feedback Authenticity Policy */}
        <Section background="white" spacing="default" className="border-t border-brand-border">
          <Container size="narrow">
            <div className="space-y-6 text-center">
              <SectionHeading
                eyebrow="Our Review Policy"
                title="Strict Commitment to Genuine Feedback"
                align="center"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-left">
                <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Verified Clients Only</span>
                  </div>
                  <p className="text-brand-muted">Reviews are collected only from confirmed customers following project completion.</p>
                </div>

                <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Unedited Opinions</span>
                  </div>
                  <p className="text-brand-muted">Feedback is displayed as provided without misleading modifications or enhancements.</p>
                </div>

                <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Zero Paid Ratings</span>
                  </div>
                  <p className="text-brand-muted">We never purchase, incentivize, or generate artificial ratings on our website.</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* 5. Final Conversion & Quote Section */}
        <Section background="light" spacing="default" id="quote-section" className="border-t border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-secondary-blue mb-2">
                    Experience Professional Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Ready to Book Your Core Cutting Job?
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Contact our operators today to schedule your diamond coring service or receive transparent upfront pricing for your property.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-brand-navy">Speak with Our Team:</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ContactCTA
                      type="call"
                      phone={businessProfile.phone}
                      size="md"
                      label={`Call: ${businessProfile.phone}`}
                      className="w-full sm:w-auto"
                    />
                    <ContactCTA
                      type="whatsapp"
                      whatsapp={businessProfile.whatsapp || businessProfile.phone}
                      size="md"
                      label="WhatsApp Us"
                      className="w-full sm:w-auto"
                    />
                  </div>

                  <div className="pt-2 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-muted">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-brand-secondary-blue shrink-0" aria-hidden="true" />
                      <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-brand-secondary-blue shrink-0" aria-hidden="true" />
                      <span>{businessProfile.city} &amp; Surrounding Areas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <ContactFormUI services={serviceOptions} />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      {/* 6. Footer */}
      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
}
