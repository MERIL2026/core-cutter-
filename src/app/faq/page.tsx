import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getActiveFAQs,
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  HelpCircle,
  Clock,
  MapPin,
  FileQuestion,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | AC & RCC Core Cutting FAQs',
  description:
    'Find clear answers to common questions about diamond core cutting hole sizes, RCC wall penetration, timing, wall safety, and pricing.',
  alternates: {
    canonical: '/faq',
  },
};

export default function FAQPage() {
  const businessProfile = getBusinessProfile();
  const faqs = getActiveFAQs();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));

  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'FAQ', url: '/faq' }]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      <JsonLd data={faqSchema} />
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
            <Breadcrumbs items={[{ label: 'FAQ' }]} className="text-slate-400 mb-6" />

            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-secondary-blue/30 border border-brand-secondary-blue/40 text-brand-accent-blue text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Knowledge &amp; Technical Support</span>
              </div>

              {/* Exactly One H1 */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Frequently Asked Questions
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Find clear, technical answers regarding diamond core cutting hole diameters, reinforced concrete (RCC) capabilities, project timing, and wall safety.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <ContactCTA
                  type="quote"
                  quoteHref="#quote-section"
                  size="md"
                  label="Ask a Question / Get Quote"
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
                  label="WhatsApp"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Main FAQ Section */}
        <Section background="default" spacing="default" id="faqs-list">
          <Container>
            <SectionHeading
              eyebrow="Helpful Information"
              title="Common Customer Questions"
              description="Everything you need to know before booking your core cutting or concrete drilling job."
              align="center"
            />

            <div className="max-w-3xl mx-auto mt-10 sm:mt-12">
              <FAQAccordion items={faqs} allowMultiple />
            </div>
          </Container>
        </Section>

        {/* 4. Still Have Questions Callout */}
        <Section background="white" spacing="compact" className="border-t border-brand-border">
          <Container size="narrow">
            <div className="p-6 sm:p-8 bg-brand-light-blue/40 rounded-2xl border border-brand-secondary-blue/30 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-white text-brand-secondary-blue flex items-center justify-center mx-auto shadow-2xs">
                <FileQuestion className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                Have a Specific Technical Question?
              </h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                If your project involves non-standard wall depths, specialized diameter requirements, or tight spatial constraints, our technicians are available to help.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <ContactCTA
                  type="call"
                  phone={businessProfile.phone}
                  size="sm"
                  label={`Call: ${businessProfile.phone}`}
                />
                <ContactCTA
                  type="whatsapp"
                  whatsapp={businessProfile.whatsapp || businessProfile.phone}
                  size="sm"
                  label="Message on WhatsApp"
                />
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
                    Direct Quote Request
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Get an Exact Price for Your Work
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Tell us your wall material, hole count, and location. We will confirm technician availability and provide upfront transparent pricing.
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
