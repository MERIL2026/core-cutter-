import React from 'react';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ContactCTA } from '../ui/ContactCTA';
import { DiamondCoreVisual } from '../ui/DiamondCoreVisual';
import { Service, BusinessProfile } from '@/types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ServiceHeroProps {
  service: Service;
  businessProfile: BusinessProfile;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({ service, businessProfile }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-[#0C2A47] to-[#081B2E] text-white pt-6 pb-14 sm:pb-20 border-b border-brand-accent-blue/15">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-20 pointer-events-none" aria-hidden="true" />

      {/* Ambient Accent Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-accent-blue/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <Container className="relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.name },
          ]}
          className="text-slate-300 mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Info & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent-blue/15 border border-brand-accent-blue/30 text-brand-accent-blue text-xs font-semibold tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Specialized Core Drilling Solution</span>
            </div>

            {/* Exactly One H1 for the Service Detail Page */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl">
              {service.summary}
            </p>

            {/* Quick capability bullets */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                Diamond-Tipped Coring
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                Low-Vibration Rotary Drilling
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                Clean Hole Finish
              </span>
            </div>

            {/* Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <ContactCTA
                type="quote"
                quoteHref="#quote-section"
                size="lg"
                label="Request Free Quote"
                className="w-full sm:w-auto shadow-lg shadow-brand-navy/50"
              />
              <ContactCTA
                type="call"
                phone={businessProfile.phone}
                size="lg"
                label="Call Technician"
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white"
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
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {service.image_url ? (
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-brand-accent-blue/30 shadow-2xl">
                <Image
                  src={service.image_url}
                  alt={`${service.name} project execution`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <DiamondCoreVisual variant="service" serviceName={service.name} />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
