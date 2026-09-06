import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getActiveGalleryItems,
  getGalleryCategories,
  getActiveServices,
} from '@/lib/content';
import { ShieldCheck, Camera, Clock, MapPin } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Project Gallery | AC Core Cutting & Concrete Drilling Proof',
  description:
    'View real documentation of our diamond core cutting, AC pipe holes, RCC slab drilling, and concrete wall penetrations.',
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryPage() {
  const businessProfile = getBusinessProfile();
  const galleryItems = getActiveGalleryItems();
  const galleryCategories = getGalleryCategories();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Gallery', url: '/gallery' }]);

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
        <section className="bg-gradient-to-b from-brand-navy via-brand-navy to-[#0A192F] text-white pt-6 pb-14 sm:pb-18 border-b border-slate-800">
          <Container>
            <Breadcrumbs items={[{ label: 'Gallery' }]} className="text-slate-400 mb-6" />

            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-secondary-blue/30 border border-brand-secondary-blue/40 text-brand-accent-blue text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>On-Site Work Documentation</span>
              </div>

              {/* Exactly One H1 */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Project Gallery &amp; Work Proof
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Explore authentic on-site documentation of our precision diamond core cutting, AC pipe openings, RCC slab penetrations, and clean wall coring projects.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <ContactCTA
                  type="quote"
                  quoteHref="#quote-section"
                  size="md"
                  label="Request a Free Quote"
                  className="w-full sm:w-auto"
                />
                <ContactCTA
                  type="call"
                  phone={businessProfile.phone}
                  size="md"
                  label="Call Technician"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white"
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
          </Container>
        </section>

        {/* 3. Gallery Grid Section */}
        <Section background="default" spacing="default" id="gallery-grid">
          <Container>
            <SectionHeading
              eyebrow="Recent Work Portfolio"
              title="Coring &amp; Drilling Projects"
              description="Filter by project category to view diamond drilling applications across residential and commercial settings."
              align="center"
            />

            <div className="mt-10 sm:mt-12">
              <GalleryGrid items={galleryItems} categories={galleryCategories} />
            </div>
          </Container>
        </Section>

        {/* 4. Transparency Policy Note */}
        <Section background="white" spacing="compact" className="border-t border-brand-border">
          <Container size="narrow">
            <div className="p-6 bg-brand-bg rounded-2xl border border-brand-border flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-brand-light-blue text-brand-navy flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="h-5 w-5 text-brand-secondary-blue" aria-hidden="true" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-brand-muted leading-relaxed">
                <strong className="block text-brand-navy font-bold">Authentic Photography Commitment</strong>
                We only showcase verified on-site photographs of actual core drilling jobs executed by our team. No stock photography is misrepresented as our work.
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
                    Book Your Core Cutting
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Have a Similar Drilling Project?
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Whether you need a single 3-inch hole for a split AC indoor unit or multiple utility penetrations through RCC slabs, contact us for prompt on-site execution.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-brand-navy">Contact a Technician:</h3>
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
