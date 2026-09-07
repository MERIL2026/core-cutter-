'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '../layout/Container';
import { ContactCTA } from '../ui/ContactCTA';
import { ScrollReveal } from '../ui/ScrollReveal';
import { BusinessProfile } from '@/types';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, Users } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export interface HeroProps {
  businessProfile: BusinessProfile;
}

export const Hero: React.FC<HeroProps> = ({ businessProfile }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('ac-core-cutting');

  const handleHeroQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent({
      event_name: 'quote_start',
      metadata: { source: 'hero_floating_card', name, service },
    });
    // Smooth scroll down to quote section or pass params
    const quoteSection = document.getElementById('quote-section');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/contact');
    }
  };

  const cleanPhone = businessProfile.phone.replace(/[^\d+]/g, '');

  return (
    <section className="relative bg-brand-dark text-white overflow-hidden py-8 sm:py-16 lg:py-20">
      {/* Dark hero background image with subtle overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home-hero.jpg"
          alt="Precision Diamond Core Drilling"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-luminosity filter brightness-75 scale-105 transform animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/80" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Editorial Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Eyebrow Tag */}
            <ScrollReveal animation="fade-down" delay={50}>
              <div className="inline-flex items-center space-x-2 text-brand-orange font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                <span className="text-brand-orange font-black text-base">{"//"}</span>
                <span>SPECIALIZED DIAMOND CORE DRILLING</span>
              </div>
            </ScrollReveal>

            {/* Dominant H1 Heading */}
            <ScrollReveal animation="slide-left" delay={150}>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.12]">
                Precision Core Cutting &amp;{' '}
                <span className="text-brand-orange">
                  Reliable Solutions
                </span>
              </h1>
            </ScrollReveal>

            {/* Supporting Description */}
            <ScrollReveal animation="fade-up" delay={250}>
              <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Clean 2 to 5 inch circular wall openings for split AC copper pipes, drain lines, and heavy RCC concrete slabs. Zero vibration wall damage, smooth edges, and fast on-site execution.
              </p>
            </ScrollReveal>

            {/* Social Proof Pill (Avatar stack + Stat counter like in template) */}
            <ScrollReveal animation="fade-up" delay={350}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 hover:border-brand-orange/40 transition-colors">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-flex h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-brand-dark bg-brand-orange text-white text-xs font-bold items-center justify-center">
                      AC
                    </div>
                    <div className="inline-flex h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-brand-dark bg-amber-500 text-white text-xs font-bold items-center justify-center">
                      RCC
                    </div>
                    <div className="inline-flex h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-brand-dark bg-emerald-600 text-white text-xs font-bold items-center justify-center">
                      ✓
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="block text-xs sm:text-sm font-extrabold text-white leading-tight">2,500+</span>
                    <span className="block text-[10px] sm:text-[11px] text-gray-300 font-medium">Satisfied Jobs Executed</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons Row */}
            <ScrollReveal animation="fade-up" delay={450}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-2">
                <ContactCTA
                  type="quote"
                  quoteHref="#quote-section"
                  size="md"
                  label="Get Free Instant Quote"
                  variant="pill-orange"
                  className="w-full sm:w-auto"
                />

                <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
                  <ContactCTA
                    type="call"
                    phone={businessProfile.phone}
                    size="md"
                    label="Call Tech"
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
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
            </ScrollReveal>
          </div>

          {/* Right Column: Floating Stat Counters + Request A Quote Card */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-4">
            {/* Floating Top Stat Cards (like in reference image) */}
            <ScrollReveal animation="slide-right" delay={200} className="w-full max-w-md">
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center hover:bg-white/15 transition-all">
                  <span className="block text-2xl sm:text-3xl font-black text-brand-orange">10+</span>
                  <span className="block text-xs font-semibold text-gray-300 mt-0.5">Years Experience</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center hover:bg-white/15 transition-all">
                  <span className="block text-2xl sm:text-3xl font-black text-brand-orange">100%</span>
                  <span className="block text-xs font-semibold text-gray-300 mt-0.5">Vibration Safe</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Embedded Floating Quote Card (like the white card in template) */}
            <ScrollReveal animation="zoom-in" delay={350} className="w-full max-w-md">
              <div className="w-full bg-white text-gray-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100 hover:shadow-orange-glow/20 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <h3 className="text-lg font-black text-brand-dark">
                    Request A Free Quote
                  </h3>
                  <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                    Fast Dispatch
                  </span>
                </div>

                <form onSubmit={handleHeroQuoteSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="hero-name" className="block text-xs font-bold text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      id="hero-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="hero-phone" className="block text-xs font-bold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="hero-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="hero-service" className="block text-xs font-bold text-gray-700 mb-1">
                      Service Required
                    </label>
                    <select
                      id="hero-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-white"
                    >
                      <option value="ac-core-cutting">AC Core Cutting (2″ to 5″)</option>
                      <option value="rcc-core-cutting">RCC Beam &amp; Slab Coring</option>
                      <option value="ac-drain-hole">AC Drain Hole Drilling</option>
                      <option value="concrete-wall-drilling">Concrete Wall Penetration</option>
                      <option value="pipe-cable-passage">Pipe &amp; Cable Passage</option>
                      <option value="other">Other Custom Drilling</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow transition-all active:scale-95"
                  >
                    <span>Submit Quote Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
};
