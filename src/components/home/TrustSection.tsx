import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { CheckCircle2, Trophy, ArrowRight, ChevronsRight } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <Section background="white" spacing="default" className="border-b border-gray-100 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial & Experience Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal animation="fade-down" delay={50}>
              <div className="inline-flex items-center space-x-2 text-brand-orange font-extrabold text-xs tracking-wider uppercase">
                <span className="text-brand-orange font-black text-sm">{"//"}</span>
                <span>ABOUT OUR SERVICES</span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" delay={150}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                Building Excellence &amp; Trust With Quality
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={250}>
              <p className="text-base text-gray-600 leading-relaxed font-normal">
                Specializing in high-precision rotary diamond core drilling and non-impact wall penetrations. We deliver perfectly circular cuts across residential apartments, commercial buildings, and industrial RCC slabs without structural cracking.
              </p>
            </ScrollReveal>

            {/* Checklist with Orange Double Arrows */}
            <div className="space-y-3 pt-1">
              <ScrollReveal animation="slide-left" delay={300}>
                <div className="flex items-center space-x-2.5 text-sm sm:text-base font-bold text-brand-dark">
                  <ChevronsRight className="h-5 w-5 text-brand-orange shrink-0" />
                  <span>Clean 2″ to 5″ Holes Without Wall Chipping</span>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="slide-left" delay={380}>
                <div className="flex items-center space-x-2.5 text-sm sm:text-base font-bold text-brand-dark">
                  <ChevronsRight className="h-5 w-5 text-brand-orange shrink-0" />
                  <span>Heavy-Duty RCC &amp; Steel Rebar Penetrations</span>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="slide-left" delay={460}>
                <div className="flex items-center space-x-2.5 text-sm sm:text-base font-bold text-brand-dark">
                  <ChevronsRight className="h-5 w-5 text-brand-orange shrink-0" />
                  <span>Precise Slope-Aligned AC Drain Passages</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Experience Box & Action Row */}
            <ScrollReveal animation="fade-up" delay={500}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-3">
                <div className="bg-brand-cream rounded-2xl px-6 py-4 border border-orange-100 text-center sm:text-left shrink-0 hover:border-brand-orange/40 transition-colors">
                  <span className="block text-3xl font-black text-brand-orange">10+</span>
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Years of Experience
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/about"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Certified Diamond Drilling Technicians</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Overlapping Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[500px]">
              {/* Main Primary Image */}
              <ScrollReveal animation="slide-right" delay={250}>
                <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/custom-core-drilling.jpg"
                    alt="Diamond Core Drilling Contractor on Site"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Floating Orange Badge on Top-Left */}
                  <div className="absolute top-4 left-4 bg-brand-orange text-white font-black px-4 py-2 rounded-xl text-sm sm:text-base shadow-lg tracking-wide uppercase">
                    Since 2014
                  </div>
                </div>
              </ScrollReveal>

              {/* Floating Bottom-Right Trophy/Guarantee Card */}
              <ScrollReveal animation="zoom-in" delay={450} className="absolute -bottom-6 -right-2 sm:-right-6 z-20">
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-100 max-w-[240px] flex items-center space-x-3.5 animate-pulse-subtle">
                  <div className="h-12 w-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                    <Trophy className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-brand-dark leading-tight">
                      100% Structural Safety
                    </span>
                    <span className="block text-[11px] text-gray-500 mt-0.5 font-medium">
                      Zero Wall Cracking Guarantee
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

