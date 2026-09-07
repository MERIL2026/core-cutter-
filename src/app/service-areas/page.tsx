import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactCTA } from '@/components/ui/ContactCTA';
import { Button } from '@/components/ui/Button';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getActiveServiceAreas,
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Service Areas | Local AC & RCC Core Cutting Coverage',
  description:
    'Find local diamond core cutting and concrete drilling coverage areas. Prompt technician dispatch across residential sectors and commercial zones.',
  alternates: {
    canonical: '/service-areas',
  },
};

export default function ServiceAreasPage() {
  const businessProfile = getBusinessProfile();
  const serviceAreas = getActiveServiceAreas();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Service Areas', url: '/service-areas' }]);

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
              src="/images/heroes/service-areas-hero.png"
              alt="Service Areas AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            <Breadcrumbs items={[{ label: 'Service Areas' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// Local Technician Coverage"}</span>
                </div>

                {/* Exactly One H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Service Areas &amp; Local Coverage
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  We provide prompt on-site diamond core cutting, AC pipe hole drilling, and RCC concrete penetrations across {businessProfile.city} and surrounding local zones.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                  <ContactCTA
                    type="quote"
                    quoteHref="#quote-section"
                    size="md"
                    label="Check Availability &amp; Quote"
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
                    label="WhatsApp Location"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-orange/10 group">
                  <Image
                    src="/images/tech-dispatch-hero.jpg"
                    alt="Mobile diamond core cutting technician van and equipment ready for dispatch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    Mobile Dispatch
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Configured Service Areas List */}
        <Section background="default" spacing="default" id="areas-list">
          <Container>
            <SectionHeading
              eyebrow="Local Coverage Zones"
              title={`Where We Provide Core Cutting in ${businessProfile.city}`}
              description="Our mobile drilling technicians are dispatched directly with heavy-duty diamond coring rigs and dust/slurry protection."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
              {serviceAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex flex-col justify-between p-6 sm:p-7 bg-white rounded-xl border border-brand-border shadow-xs hover:border-brand-secondary-blue/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2.5 text-brand-secondary-blue">
                      <div className="h-9 w-9 rounded-lg bg-brand-light-blue flex items-center justify-center text-brand-navy group-hover:bg-brand-secondary-blue group-hover:text-white transition-colors">
                        <MapPin className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                        Service Zone
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                      {area.name}
                    </h3>

                    {area.description && (
                      <p className="text-sm text-brand-muted leading-relaxed">
                        {area.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted font-medium">
                    <span className="inline-flex items-center text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active Coverage
                    </span>
                    <span>Direct Dispatch</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 4. Service Coverage Explanation */}
        <Section background="white" spacing="default" className="border-t border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-5">
                <SectionHeading
                  eyebrow="Coverage Scope"
                  title="Residential, Commercial &amp; Industrial Dispatch"
                  align="left"
                />

                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  Our core cutting team travels directly to your property with all required diamond core barrel bits, drill stands, water cooling equipment, and protective drop cloths.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                    <strong className="block text-sm font-bold text-brand-navy">Residential Flats &amp; Homes</strong>
                    <p className="text-xs text-brand-muted">Individual split AC wall holes, angled drain lines, kitchen exhaust vents, and balcony penetrations.</p>
                  </div>

                  <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                    <strong className="block text-sm font-bold text-brand-navy">Commercial &amp; Office Sites</strong>
                    <p className="text-xs text-brand-muted">Multi-split VRV/VRF ducting, electrical conduit riser sleeves, and plumbing line passages through RCC slabs.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
                <div className="flex items-center space-x-3 text-brand-navy">
                  <div className="h-10 w-10 rounded-xl bg-brand-secondary-blue/10 flex items-center justify-center text-brand-secondary-blue">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Outside These Listed Areas?</h3>
                    <p className="text-xs text-brand-muted">We accommodate broader commercial requirements.</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  If your project is located slightly outside our listed zones, contact our team directly with your site location and hole count. We can often arrange customized technician scheduling.
                </p>

                <div>
                  <Link href="/services">
                    <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Explore Available Services
                    </Button>
                  </Link>
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
                    Check Local Availability
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Schedule Core Cutting in Your Area
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Share your address or sector location to confirm technician availability, expected arrival times, and transparent pricing.
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
                      label="Share Location on WhatsApp"
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
