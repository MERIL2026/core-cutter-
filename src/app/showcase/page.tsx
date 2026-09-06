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
import { FAQ, GalleryItem } from '@/types';

// Development showcase data
const sampleFaqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is AC Core Cutting?',
    answer:
      'AC core cutting is a precise diamond-drilling method used to create clean, circular openings through walls or RCC concrete slabs for AC copper refrigerant pipes, drain pipes, and electrical wiring.',
    display_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'Can you drill through RCC concrete walls?',
    answer:
      'Yes, our heavy-duty diamond core drilling equipment cuts smoothly through reinforced concrete (RCC), brick walls, beam sides, and stone without causing cracks or structural vibration.',
    display_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const sampleGalleryItems: GalleryItem[] = [
  {
    id: 'g-1',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Clean circular core cutting opening in concrete wall for split AC installation',
    title: 'Clean Split AC Core Hole',
    category: 'AC Core Cutting',
    location: 'Main City',
    is_published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g-2',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Heavy duty RCC drilling machine in operation',
    title: 'RCC Wall Drilling',
    category: 'RCC Drilling',
    location: 'Nearby Sector',
    is_published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
              <ServiceCard
                slug="ac-core-cutting"
                name="AC Core Cutting"
                summary="Clean, accurate 2 to 5 inch circular wall openings for split and window AC copper refrigerant pipes and drain hoses."
              />
              <ServiceCard
                slug="rcc-core-cutting"
                name="RCC Core Cutting"
                summary="Heavy-duty diamond core drilling through reinforced concrete (RCC) structures with zero vibration damage."
              />
              <ServiceCard
                slug="ac-drain-hole"
                name="AC Drain Hole"
                summary="Slanted precision wall drilling for smooth water drainage passage from outdoor and indoor units."
              />
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
                  align="left"
                />
                <ReviewCard
                  customerName="Rohan Verma"
                  reviewText="Excellent AC core cutting service! They drilled two clean 3-inch holes through my 9-inch RCC wall for split AC installation without making any mess. Highly professional team."
                  rating={5}
                  source="Google"
                  reviewDate="2 days ago"
                />
              </div>

              <div>
                <SectionHeading
                  eyebrow="Objection Handling"
                  title="FAQAccordion Component"
                  align="left"
                />
                <FAQAccordion items={sampleFaqs} />
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
                  align="left"
                />
                <GalleryGrid items={sampleGalleryItems} categories={['AC Core Cutting', 'RCC Drilling']} />
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
