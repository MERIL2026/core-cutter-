import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import { getActiveServices, getActiveFAQs, getActiveGalleryItems, getGalleryCategories } from '@/lib/content';

const canonicalServices = getActiveServices();
const canonicalFaqs = getActiveFAQs();
const canonicalGalleryItems = getActiveGalleryItems();
const galleryCategories = getGalleryCategories();

export default function ComponentShowcasePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <Section background="light" spacing="compact">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-navy text-white rounded-full mb-2">
                Development Showcase
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Phase 02 Design System & Global UI Components
              </h1>
              <p className="mt-2 text-sm text-brand-muted">
                This page showcases all production-ready reusable UI primitives, buttons, cards, forms, and layout structures.
              </p>
            </div>
          </Container>
        </Section>

        {/* Buttons & CTAs */}
        <Section background="white">
          <Container>
            <SectionHeading
              eyebrow="UI Primitives"
              title="Button & Contact CTA System"
              description="Standardized touch-friendly buttons supporting Call, WhatsApp, and Quote actions."
              align="left"
            />

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-brand-navy mb-3">Base Buttons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="accent">Accent Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="primary" isLoading>
                    Loading State
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-brand-navy mb-3">Conversion CTAs</h4>
                <div className="flex flex-wrap gap-3">
                  <ContactCTA type="call" />
                  <ContactCTA type="whatsapp" />
                  <ContactCTA type="quote" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Service Card Showcase */}
        <Section background="default">
          <Container>
            <SectionHeading
              eyebrow="Service Module"
              title="ServiceCard Component"
              description="Data-driven service cards supporting summary, slug routing, and hover effects."
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {canonicalServices.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Container>
        </Section>

        {/* Review & FAQ Showcase */}
        <Section background="white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <SectionHeading
                  eyebrow="Social Proof"
                  title="ReviewCard Component"
                  description="Component demonstration template. Production reviews require verified owner input."
                  align="left"
                />
                <ReviewCard
                  customerName="[Verified Customer Name]"
                  reviewText="Clean and precise diamond core cutting hole through reinforced wall for AC installation without any mess or damage."
                  rating={5}
                  source="Google"
                  reviewDate="Sample Date"
                />
              </div>

              <div>
                <SectionHeading
                  eyebrow="Objection Handling"
                  title="FAQAccordion Component"
                  description="Canonical customer questions loaded from Phase 03 content layer."
                  align="left"
                />
                <FAQAccordion items={canonicalFaqs} />
              </div>
            </div>
          </Container>
        </Section>

        {/* Gallery & Form Showcase */}
        <Section background="light">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <SectionHeading
                  eyebrow="Real Work Proof"
                  title="GalleryGrid Component"
                  description="Consumes canonical gallery layer (displays empty-state until real job photos are uploaded)."
                  align="left"
                />
                <GalleryGrid items={canonicalGalleryItems} categories={galleryCategories} />
              </div>

              <div className="lg:col-span-5">
                <ContactFormUI />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
