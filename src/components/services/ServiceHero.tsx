import React from 'react';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ContactCTA } from '../ui/ContactCTA';
import { Service, BusinessProfile } from '@/types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ServiceHeroProps {
  service: Service;
  businessProfile: BusinessProfile;
}

const heroBackgrounds: Record<string, string> = {
  'ac-core-cutting': '/images/heroes/service-ac-core-cutting.png',
  'rcc-core-cutting': '/images/heroes/service-rcc-core-cutting.png',
  'ac-drain-hole': '/images/heroes/service-ac-drain-hole.png',
  'concrete-wall-drilling': '/images/heroes/service-concrete-wall-drilling.png',
  'pipe-cable-passage': '/images/heroes/service-pipe-cable-passage.png',
};

export const ServiceHero: React.FC<ServiceHeroProps> = ({ service, businessProfile }) => {
  const heroBg = heroBackgrounds[service.slug] || '/images/heroes/services-hero.png';

  return (
    <div className="relative overflow-hidden bg-brand-dark text-white pt-8 pb-16 sm:pb-20 border-b border-slate-800">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBg}
          alt={`${service.name} Background`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 z-0" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none z-0" aria-hidden="true" />

      <Container className="relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.name },
          ]}
          className="text-slate-400 mb-6"
        />

        <div className={service.image_url ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" : "max-w-3xl"}>
          {/* Main Info & CTAs */}
          <div className={service.image_url ? "lg:col-span-7 space-y-6" : "space-y-6"}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange-light text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              <span>{"// Specialized Core Drilling Solution"}</span>
            </div>

            {/* Exactly One H1 for the Service Detail Page */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {service.summary}
            </p>

            {/* Quick capability bullets */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange mr-1.5 shrink-0" />
                Diamond-Tipped Coring
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange mr-1.5 shrink-0" />
                Low-Vibration Rotary Drilling
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange mr-1.5 shrink-0" />
                Clean Hole Finish
              </span>
            </div>

            {/* Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-3">
              <ContactCTA
                type="quote"
                quoteHref="#quote-section"
                size="lg"
                label="Request Free Quote"
                className="w-full sm:w-auto"
              />
              <ContactCTA
                type="call"
                phone={businessProfile.phone}
                size="lg"
                label="Call Technician"
                variant="outline"
                className="w-full sm:w-auto border-slate-700 text-white hover:bg-white/10 hover:border-white"
              />
              <ContactCTA
                type="whatsapp"
                whatsapp={businessProfile.whatsapp || businessProfile.phone}
                size="lg"
                label="WhatsApp"
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Visual Media Slot */}
          {service.image_url ? (
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-orange/10 group">
                <Image
                  src={service.image_url}
                  alt={`${service.name} project execution`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                  Active Rig Setup
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

