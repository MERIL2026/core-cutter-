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
        <section className="bg-brand-dark text-white pt-8 pb-16 sm:pb-20 border-b border-slate-800 relative overflow-hidden">
          {/* Hero Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroes/gallery-hero.png"
              alt="Project Gallery AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            <Breadcrumbs items={[{ label: 'Gallery' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// On-Site Work Documentation"}</span>
                </div>

                {/* Exactly One H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Project Gallery &amp; Work Proof
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Explore authentic on-site documentation of our precision diamond core cutting, AC pipe openings, RCC slab penetrations, and clean wall coring projects.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
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
                    src="/images/concrete-wall-drilling.jpg"
                    alt="Clean concrete core extraction on job site"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    Verified Projects
                  </div>
                </div>
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
