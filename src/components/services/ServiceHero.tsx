import React from 'react';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ContactCTA } from '../ui/ContactCTA';
import { Service, BusinessProfile } from '@/types';
import { ShieldCheck, Drill, CheckCircle2 } from 'lucide-react';

export interface ServiceHeroProps {
  service: Service;
  businessProfile: BusinessProfile;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({ service, businessProfile }) => {
  return (
    <div className="bg-gradient-to-b from-brand-navy via-brand-navy to-[#0A192F] text-white pt-6 pb-14 sm:pb-20 border-b border-slate-800">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.name },
          ]}
          className="text-slate-400 mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Info & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-secondary-blue/30 border border-brand-secondary-blue/40 text-brand-accent-blue text-xs font-semibold tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Specialized Core Drilling Solution</span>
            </div>

            {/* Exactly One H1 for the Service Detail Page */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {service.summary}
            </p>

            {/* Quick capability bullets */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                Diamond-Tipped Coring
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                Low-Vibration Rotary Drilling
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
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
                className="w-full sm:w-auto shadow-md"
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
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl overflow-hidden">
              {service.image_url ? (
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden">
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
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-secondary-blue/30 border border-brand-accent-blue/40 flex items-center justify-center text-brand-accent-blue">
                        <Drill className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-white">Technical Service Profile</span>
                        <span className="block text-xs text-slate-400">Rotary Diamond Method</span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      Standard Bit Setup
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex justify-between items-center">
                      <span className="text-slate-400">Applicable Materials:</span>
                      <span className="font-semibold text-white">Brick, RCC, AAC Block, Stone</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex justify-between items-center">
                      <span className="text-slate-400">Available Diameters:</span>
                      <span className="font-semibold text-white">2&quot; to 5&quot; &amp; Custom Sizes</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex justify-between items-center">
                      <span className="text-slate-400">Service Coverage:</span>
                      <span className="font-semibold text-white">Residential &amp; Commercial</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center italic">
                    Real on-site project photographs will appear here as work progresses.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
