import React from 'react';
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Contact Us | Request Core Cutting & Drilling Quote',
  description:
    'Contact our professional AC and RCC diamond core cutting team. Call, WhatsApp, or submit your job details for immediate pricing and scheduling.',
};

export default function ContactPage() {
  const businessProfile = getBusinessProfile();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
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
            <Breadcrumbs items={[{ label: 'Contact' }]} className="text-slate-400 mb-6" />

            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-secondary-blue/30 border border-brand-secondary-blue/40 text-brand-accent-blue text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Immediate Booking &amp; Estimates</span>
              </div>

              {/* Exactly One H1 */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Contact Our Core Cutting Team
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Connect directly with our diamond drilling technicians for quick quotes, hole diameter recommendations, and convenient job scheduling.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <ContactCTA
                  type="call"
                  phone={businessProfile.phone}
                  size="md"
                  label={`Call: ${businessProfile.phone}`}
                  className="w-full sm:w-auto shadow-md"
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

        {/* 3. Main Contact Options & Interactive Form */}
        <Section background="default" spacing="default" id="contact-form">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct Info, Operating Hours & Service Commitments */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                    Get in Touch Directly
                  </h2>
                  <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                    Have questions about your wall material, hole count, or urgent timing? Choose your preferred contact method:
                  </p>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-3.5">
                  <a
                    href={`tel:${businessProfile.phone.replace(/\s+/g, '')}`}
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-brand-border shadow-xs hover:border-brand-secondary-blue/50 transition-colors group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-brand-light-blue text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-white transition-colors">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-brand-muted">Phone Call</span>
                      <span className="block text-base font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                        {businessProfile.phone}
                      </span>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${(businessProfile.whatsapp || businessProfile.phone).replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about your core cutting services.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-brand-border shadow-xs hover:border-emerald-500/50 transition-colors group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-[#128C7E] group-hover:text-white transition-colors">
                      <MessageSquare className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-brand-muted">WhatsApp Messaging</span>
                      <span className="block text-base font-bold text-brand-navy group-hover:text-emerald-700 transition-colors">
                        Chat with Technician
                      </span>
                    </div>
                  </a>
                </div>

                {/* Business Information Box */}
                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-brand-navy border-b border-brand-border pb-3">
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
