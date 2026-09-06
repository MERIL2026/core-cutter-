import React from 'react';
import { Container } from '../layout/Container';
import { ContactCTA } from '../ui/ContactCTA';
import { DiamondCoreVisual } from '../ui/DiamondCoreVisual';
import { BusinessProfile } from '@/types';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export interface HeroProps {
  businessProfile: BusinessProfile;
}

export const Hero: React.FC<HeroProps> = ({ businessProfile }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-[#0C2A47] to-[#081B2E] text-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-brand-accent-blue/15">
      {/* Precision Blueprint Grid Layer */}
      <div
        className="absolute inset-0 bg-technical-grid opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient Accent Glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 bg-brand-accent-blue/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-0 w-80 h-80 bg-brand-secondary-blue/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Hero Editorial Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Editorial Eyebrow Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent-blue/15 border border-brand-accent-blue/30 text-brand-accent-blue text-xs font-semibold tracking-wide animate-fade-in-up">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-accent-blue" aria-hidden="true" />
              <span>Diamond Rotary Concrete Drilling</span>
            </div>

            {/* Dominant Editorial H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.12] animate-fade-in-up animation-delay-100">
              Precision Core Cutting for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent-blue via-[#76BBE0] to-white">
                AC & RCC Concrete
              </span>{' '}
              Work
            </h1>

            {/* Balanced Supporting Description */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal animate-fade-in-up animation-delay-200">
              Clean 2 to 5 inch circular wall openings for split AC copper pipes, drain lines, and RCC slabs. Zero vibration damage, smooth circular cuts, and minimal mess for residential and commercial sites.
            </p>

            {/* Core Capability Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs sm:text-sm text-slate-200 animate-fade-in-up animation-delay-200">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>2″ to 5″ Diameters</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Zero Wall Cracks</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>RCC Rebar Capable</span>
              </div>
            </div>

            {/* Primary Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 animate-fade-in-up animation-delay-300">
              <ContactCTA
                type="quote"
                quoteHref="#quote-section"
                size="lg"
                label="Get Instant Quote"
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

          {/* Hero Visual Area: Bespoke Diamond Core Engineering Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up animation-delay-300">
            <DiamondCoreVisual variant="hero" />
          </div>
        </div>
      </Container>
    </section>
  );
};
