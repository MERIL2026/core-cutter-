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
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  CheckCircle2,
  Drill,
  Sparkles,
  MapPin,
  Clock,
  Wrench,
  ArrowRight,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'About Us | Professional AC & RCC Core Cutting Services',
  description:
    'Learn about our professional diamond core cutting, precision concrete drilling, and wall penetration services for residential and commercial projects.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const businessProfile = getBusinessProfile();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'About', url: '/about' }]);

  const capabilityPillars = [
    {
      icon: Drill,
      title: 'Rotary Diamond Coring',
      description:
        'We utilize specialized rotary core drilling rigs equipped with diamond-tipped barrel bits for clean circular penetrations without impact hammering.',
    },
    {
      icon: ShieldCheck,
      title: 'Structural Preservation',
      description:
        'By avoiding heavy vibration shockwaves, our coring method helps protect internal brickwork, plaster, and building structural elements from unwanted cracking.',
    },
    {
      icon: Sparkles,
      title: 'Controlled Execution',
      description:
        'We employ dust-reduction techniques and water containment where applicable to keep indoor living spaces and finished surfaces tidy.',
    },
    {
      icon: Wrench,
      title: 'Multi-Material Capability',
      description:
        'Capable of cutting through standard brick, masonry, AAC blocks, solid concrete, and reinforced concrete (RCC) with embedded steel rebar.',
    },
  ];

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
              src="/images/heroes/about-hero.png"
              alt="About AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            <Breadcrumbs items={[{ label: 'About' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// Professional Core Cutting & Concrete Drilling"}</span>
                </div>

                {/* Exactly One H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  About Our Core Cutting &amp; Drilling Services
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  {businessProfile.description ||
                    'Professional AC and RCC diamond core cutting, precision concrete drilling, and wall opening services for residential and commercial projects.'}
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
                    label="WhatsApp"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-orange/10 group">
                  <Image
                    src="/images/custom-core-drilling.jpg"
                    alt="Professional core drilling contractor executing concrete core cutting"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    Certified Technicians
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Professional Approach / Working Philosophy */}
        <Section background="white" spacing="default">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-5">
                <SectionHeading
                  eyebrow="Our Working Philosophy"
                  title="Accurate Openings Without Unnecessary Wall Damage"
                  align="left"
                />

                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  When air conditioning units, plumbing lines, or electrical conduits are installed, creating openings in walls is often required. Traditional manual hammering and chiseling frequently leads to jagged edges, damaged plaster, and potential micro-fractures in surrounding masonry.
                </p>

                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  Our service focuses on precision rotary diamond core drilling. By using diamond-edged circular bits, we produce smooth, perfectly cylindrical openings tailored to the exact diameter needed for your copper refrigerant pipes, drain lines, or utility conduits.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Accurate hole diameters from 2 inches to 5 inches for residential and commercial HVAC.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Angled drain hole drilling to support continuous gravity water drainage.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Clear upfront communication regarding project requirements and site readiness.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
                <h3 className="text-lg font-bold text-brand-navy border-b border-brand-border pb-3">
                  Service Standards
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-brand-muted">
                  <div className="p-3.5 bg-white rounded-xl border border-brand-border">
                    <strong className="block text-brand-navy font-bold mb-1">Rotary Diamond Method</strong>
                    Continuous rotary cutting action without heavy impact percussion.
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-brand-border">
                    <strong className="block text-brand-navy font-bold mb-1">Local Scheduling</strong>
                    Direct coordination with skilled technicians for prompt service dispatch.
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-brand-border">
                    <strong className="block text-brand-navy font-bold mb-1">Transparent Guidance</strong>
                    Clear assessment of wall material, thickness, and hole diameter requirements.
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/services">
                    <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Explore All Core Cutting Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* 4. Equipment & Capability Pillars */}
        <Section background="light" spacing="default">
          <Container>
            <SectionHeading
              eyebrow="Core Capabilities"
              title="How We Approach Every Drilling Job"
              description="A systematic method designed to deliver accurate cylindrical cuts across diverse construction materials."
              align="center"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {capabilityPillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col p-6 bg-white rounded-xl border border-brand-border shadow-xs hover:border-brand-secondary-blue/40 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg bg-brand-light-blue text-brand-navy flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-brand-secondary-blue" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-brand-navy">{pillar.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* 5. Service Coverage & Local Presence */}
        <Section background="white" spacing="default" className="border-t border-brand-border">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 text-brand-secondary-blue font-bold text-xs uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Local Service Commitment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Serving {businessProfile.city} &amp; Nearby Areas
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                We provide on-site diamond core cutting and wall opening services for individual homeowners, HVAC technicians, electrical contractors, and building developers across {businessProfile.city} and surrounding local zones.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link href="/service-areas">
                  <Button variant="secondary" size="md" leftIcon={<MapPin className="h-4 w-4" />}>
                    View Service Areas
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="md">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* 6. Conversion Section */}
        <Section background="light" spacing="default" id="quote-section" className="border-t border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-secondary-blue mb-2">
                    Direct Coordination
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Discuss Your Drilling Requirements
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Contact us with your target opening sizes, wall material, and project schedule for immediate guidance and transparent pricing.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-brand-navy">Direct Contact:</h3>
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

      {/* 7. Footer */}
      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
}
