import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Contact Us | Request Core Cutting & Drilling Quote',
  description:
    'Contact our professional AC and RCC diamond core cutting team. Call, WhatsApp, or submit your job details for immediate pricing and scheduling.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const businessProfile = getBusinessProfile();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Contact', url: '/contact' }]);

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
              src="/images/heroes/contact-hero.png"
              alt="Contact AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            <Breadcrumbs items={[{ label: 'Contact' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// Immediate Booking & Estimates"}</span>
                </div>

                {/* Exactly One H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Contact Our Core Cutting Team
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Connect directly with our diamond drilling technicians for quick quotes, hole diameter recommendations, and convenient job scheduling.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
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
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-orange/10 group">
                  <Image
                    src="/images/custom-core-drilling.jpg"
                    alt="Contact our certified core drilling technicians"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    Direct Line
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Main Contact Options & Interactive Form */}
        <Section background="default" spacing="default" id="contact-form">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct Info, Operating Hours & Service Commitments */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
                    {"// FAST RESPONSE"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mt-1">
                    Get in Touch Directly
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Have questions about your wall material, hole count, or urgent timing? Choose your preferred contact method:
                  </p>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-3.5">
                  <a
                    href={`tel:${businessProfile.phone.replace(/\s+/g, '')}`}
                    className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-brand-orange hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5"
                  >
                    <div className="h-12 w-12 rounded-xl bg-orange-50 text-brand-orange border border-brand-orange/20 flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-400">Direct Hotline</span>
                      <span className="block text-base font-black text-brand-dark group-hover:text-brand-orange transition-colors">
                        {businessProfile.phone}
                      </span>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${(businessProfile.whatsapp || businessProfile.phone).replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about your core cutting services.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5"
                  >
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageSquare className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-400">WhatsApp 24/7 Chat</span>
                      <span className="block text-base font-black text-brand-dark group-hover:text-emerald-700 transition-colors">
                        Chat with Technician
                      </span>
                    </div>
                  </a>
                </div>

                {/* Business Information Box */}
                <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-card space-y-4">
                  <h3 className="text-base font-black text-brand-dark border-b border-slate-100 pb-3">
                    Business Details
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm text-brand-muted">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-brand-secondary-blue shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-brand-navy">Working Hours:</strong>
                        <span>Monday – Saturday: 8:00 AM – 8:00 PM</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Sunday: 9:00 AM – 5:00 PM</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <MapPin className="h-4 w-4 text-brand-secondary-blue shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-brand-navy">Primary Service Hub:</strong>
                        <span>{businessProfile.address || businessProfile.city}</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Serving residential &amp; commercial sites</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Link Card */}
                <div className="p-4 bg-brand-light-blue/40 rounded-xl border border-brand-secondary-blue/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-brand-navy">
                    <HelpCircle className="h-4 w-4 text-brand-secondary-blue shrink-0" />
                    <span>Have common questions regarding hole sizes or RCC coring?</span>
                  </div>
                  <Link
                    href="/faq"
                    className="text-xs font-bold text-brand-secondary-blue hover:underline shrink-0 ml-3"
                  >
                    View FAQ
                  </Link>
                </div>
              </div>

              {/* Right Column: Quote Request Form */}
              <div className="lg:col-span-7">
                <ContactFormUI services={serviceOptions} />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      {/* 4. Footer */}
      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
}
