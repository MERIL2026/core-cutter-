import React from 'react';
import { Container } from '../layout/Container';
import { ContactCTA } from '../ui/ContactCTA';
import { BusinessProfile } from '@/types';
import { ShieldCheck, Drill, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export interface HeroProps {
  businessProfile: BusinessProfile;
}

export const Hero: React.FC<HeroProps> = ({ businessProfile }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-brand-navy to-[#0A192F] text-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-24 border-b border-slate-800">
      {/* Subtle industrial grid background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Hero Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-secondary-blue/30 border border-brand-secondary-blue/40 text-brand-accent-blue text-xs sm:text-sm font-semibold tracking-wide">
              <ShieldCheck className="h-4 w-4 text-brand-accent-blue" aria-hidden="true" />
              <span>Professional Diamond Core Cutting Specialists</span>
            </div>

            {/* Exactly One H1 for the Page */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Precision Core Cutting for{' '}
              <span className="text-brand-accent-blue">AC & RCC Concrete</span> Work
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Clean 2 to 5 inch circular wall openings for split AC copper pipes, drain lines, and RCC slabs. Zero vibration damage, smooth circular cuts, and minimal mess for residential and commercial sites.
            </p>

            {/* Core Capabilities Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-medium">2&quot; to 5&quot; Diameters</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-medium">Zero Wall Cracks</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-medium">RCC Rebar Capable</span>
              </div>
            </div>

            {/* Primary Conversion CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <ContactCTA
                type="quote"
                quoteHref="#quote-section"
                size="lg"
                label="Get Instant Quote"
                className="w-full sm:w-auto shadow-md"
              />
              <ContactCTA
                type="call"
                phone={businessProfile.phone}
                size="lg"
                label="Call Now"
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

          {/* Hero Visual Area: Technical / Industrial Visual Representation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Decorative technical accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent-blue/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-secondary-blue/30 border border-brand-accent-blue/40 flex items-center justify-center text-brand-accent-blue">
                      <Drill className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">Diamond Coring Tech</span>
                      <span className="block text-xs text-slate-400">Rotary Non-Impact Drilling</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Available
                  </span>
                </div>

                {/* Core Cutting Technical Feature Highlights */}
                <div className="space-y-3.5">
                  <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-md bg-brand-accent-blue/20 text-brand-accent-blue flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Split AC Pipe Openings</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Clean 2.5&quot; to 4&quot; wall penetrations angled precisely for copper lines and drain hoses.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-md bg-brand-accent-blue/20 text-brand-accent-blue flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">RCC Beam & Slab Coring</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Heavy-duty water-cooled coring cuts cleanly through solid concrete and steel rebar.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-md bg-brand-accent-blue/20 text-brand-accent-blue flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Zero Hammering / Chipping</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Protects internal wall plaster, exterior textures, and building structural integrity.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Area / Dispatch Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/60">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-accent-blue" aria-hidden="true" />
                    <span>8:00 AM - 8:00 PM Service</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    <span>Clean Finish</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
