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
import { ServiceCard } from '@/components/services/ServiceCard';
import { ContactFormUI } from '@/components/forms/ContactFormUI';
import {
  getBusinessProfile,
  getActiveServices,
} from '@/lib/content';
import {
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Core Cutting Services | AC & RCC Concrete Drilling',
  description:
    'Explore our professional range of diamond core cutting services: AC pipe openings, RCC slab drilling, AC drain holes, concrete wall drilling, and pipe & cable passages.',
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  const businessProfile = getBusinessProfile();
  const services = getActiveServices();
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Services', url: '/services' }]);

  const guidanceItems = [
    {
      need: 'Installing a Split or Window AC?',
      recommended: 'AC Core Cutting or AC Drain Hole',
      slug: 'ac-core-cutting',
      description: 'Precision 2 to 5 inch circular openings for copper refrigerant lines and angled drain hoses.',
    },
    {
      need: 'Drilling Through Dense Concrete with Rebar?',
      recommended: 'RCC Core Cutting',
      slug: 'rcc-core-cutting',
      description: 'Heavy-duty diamond coring through reinforced concrete beams, columns, and slabs without impact shock.',
    },
    {
      need: 'Indoor Condensate Water Leaking from AC?',
      recommended: 'AC Drain Hole',
      slug: 'ac-drain-hole',
      description: 'Downward-slanted precision holes that guarantee continuous gravity drainage and stop indoor overflow.',
    },
    {
      need: 'Running Plumbing, Electrical, or HVAC Pipes?',
      recommended: 'Pipe & Cable Passage',
      slug: 'pipe-cable-passage',
      description: 'Custom cylindrical penetrations through walls and floor slabs for MEP conduits and utility sleeves.',
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
        {/* 2. Hero Section */}
        <section className="bg-brand-dark text-white pt-8 pb-16 sm:pb-20 border-b border-slate-800 relative overflow-hidden">
          {/* Hero Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroes/services-hero.png"
              alt="Services AC Core Cutting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
          <Container className="relative z-10">
            {/* Breadcrumb */}
            <Breadcrumbs items={[{ label: 'Services' }]} className="text-slate-400 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                  <span>{"// Complete Diamond Coring Portfolio"}</span>
                </div>

                {/* Exactly One H1 for the Services Index Page */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Specialized Core Cutting &amp; Concrete Drilling Services
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  From precision residential split AC installations to heavy-duty industrial RCC slab drilling, discover our comprehensive range of rotary diamond core drilling solutions.
                </p>

                {/* Direct CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                  <ContactCTA
                    type="quote"
                    quoteHref="#quote-section"
                    size="md"
                    label="Get a Free Quote"
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
                    src="/images/rcc-core-cutting.jpg"
                    alt="Heavy RCC diamond core cutting rig in operation"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                    RCC Coring Tech
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Canonical Services Grid */}
        <Section background="default" spacing="default" id="services-grid">
          <Container>
            <SectionHeading
              eyebrow="Our Service Categories"
              title="Select a Core Cutting Service"
              description="Choose the service that matches your project requirements to view technical specifications, benefits, and execution workflows."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Container>
        </Section>

        {/* 4. Why Professional Core Cutting Matters */}
        <Section background="white" spacing="default" className="border-y border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <SectionHeading
                  eyebrow="The Diamond Advantage"
                  title="Why Professional Core Cutting is Essential"
                  align="left"
                />
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                  Traditional hammer and chisel wall breaking causes structural shockwaves, irregular jagged openings, and unsightly plaster cracks that weaken walls and require costly repairs.
                </p>
                <div className="space-y-3 pt-1">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Exact circular geometry ensuring a tight, weather-sealed sleeve fit.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Rotary cutting eliminates impact vibration, preventing internal wall micro-cracks.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-brand-navy font-semibold">
                      Water-cooled lubrication suppresses dust and keeps indoor spaces tidy.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-border space-y-4">
                <h3 className="text-base font-bold text-brand-navy border-b border-brand-border pb-3">
                  Key Capabilities at a Glance:
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 bg-white rounded-xl border border-brand-border shadow-2xs">
                    <span className="block text-brand-muted text-xs">Standard Diameters</span>
                    <span className="block font-bold text-brand-navy mt-1">2&quot; to 5&quot; Bits</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-brand-border shadow-2xs">
                    <span className="block text-brand-muted text-xs">Target Materials</span>
                    <span className="block font-bold text-brand-navy mt-1">RCC, Brick, Block</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-brand-border shadow-2xs">
                    <span className="block text-brand-muted text-xs">Typical Job Time</span>
                    <span className="block font-bold text-brand-navy mt-1">15 - 45 Mins / Hole</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-brand-border shadow-2xs">
                    <span className="block text-brand-muted text-xs">Disruption Level</span>
                    <span className="block font-bold text-brand-navy mt-1">Low Vibration / Clean</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* 5. Service Selection Guidance */}
        <Section background="light" spacing="default">
          <Container>
            <SectionHeading
              eyebrow="Selection Guidance"
              title="Not Sure Which Service You Need?"
              description="Find the right drilling solution based on your specific installation requirements."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
              {guidanceItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between p-6 bg-white rounded-xl border border-brand-border shadow-xs hover:border-brand-secondary-blue/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-brand-secondary-blue">
                      <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {item.need}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-brand-navy">
                      {item.recommended}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-brand-border/60">
                    <Link
                      href={`/services/${item.slug}`}
                      className="inline-flex items-center text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-secondary-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-blue rounded-sm"
                    >
                      <span>View {item.recommended} Details</span>
                      <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 6. Final Conversion & Quote Section */}
        <Section background="white" spacing="default" id="quote-section" className="border-t border-brand-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-secondary-blue mb-2">
                    Fast Response Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                    Get an Upfront Quote for Any Service
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                    Contact our technicians directly with your hole requirements or submit the form for immediate response and scheduling.
                  </p>
                </div>

                <div className="bg-brand-bg/60 rounded-2xl p-6 border border-brand-border space-y-4">
                  <h3 className="text-base font-bold text-brand-navy">Direct Contact Channels:</h3>
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
