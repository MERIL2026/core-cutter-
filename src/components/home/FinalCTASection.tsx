import React from 'react';
import Image from 'next/image';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { ContactFormUI } from '../forms/ContactFormUI';
import { ContactCTA } from '../ui/ContactCTA';
import { ScrollReveal } from '../ui/ScrollReveal';
import { BusinessProfile, Service } from '@/types';
import { Clock, MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface FinalCTASectionProps {
  businessProfile: BusinessProfile;
  services: Service[];
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  businessProfile,
  services,
}) => {
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));
  const cleanPhone = businessProfile.phone.replace(/[^\d+]/g, '');

  return (
    <Section background="dark" spacing="default" id="quote-section" className="bg-brand-dark text-white relative overflow-hidden py-16 sm:py-24">
      {/* Background construction photo overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home-hero.jpg"
          alt="Core Cutting Project Execution"
          fill
          sizes="100vw"
          className="object-cover opacity-15 mix-blend-luminosity brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/90" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Dark Construction Banner Text & Floating Contact Cards */}
          <div className="lg:col-span-6 space-y-7">
            <ScrollReveal animation="fade-down" delay={50}>
              <div className="inline-flex items-center space-x-2 text-brand-orange font-extrabold text-xs tracking-wider uppercase">
                <span className="text-brand-orange font-black text-sm">{"//"}</span>
                <span>GET IN TOUCH WITH US</span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" delay={120}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Start Your Diamond Core Cutting Today
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-base text-gray-300 leading-relaxed font-normal">
                Need immediate hole cutting for an AC installation, RCC floor slab coring, or utility sleeves? Reach out for rapid technician dispatch across {businessProfile.city}.
              </p>
            </ScrollReveal>

            {/* Direct Contact Cards Row (like in bottom-right of template) */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-start space-x-4 hover:border-brand-orange/40 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Our Location</span>
                    <span className="block text-sm font-extrabold text-white mt-0.5">
                      {businessProfile.city} &amp; Surrounding Areas
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-start space-x-4 hover:border-brand-orange/40 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Hotline</span>
                    <a href={`tel:${cleanPhone}`} className="block text-sm font-extrabold text-white hover:text-brand-orange transition-colors mt-0.5">
                      {businessProfile.phone}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick CTAs */}
            <ScrollReveal animation="fade-up" delay={380}>
              <div className="flex flex-wrap gap-3 pt-1">
                <ContactCTA
                  type="call"
                  phone={businessProfile.phone}
                  size="md"
                  label="Call Technician"
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
            </ScrollReveal>

            {/* Orange Highlight Strip */}
            <ScrollReveal animation="zoom-in" delay={450}>
              <div className="bg-brand-orange text-white font-extrabold text-sm py-3 px-5 rounded-xl flex items-center justify-between shadow-orange-glow">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Zero Vibration • 100% Wall Safety Guaranteed</span>
                </div>
                <span className="hidden sm:inline text-xs font-mono font-bold bg-black/20 px-2.5 py-1 rounded-full">
                  Same-Day Available
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Quote Request Form */}
          <div className="lg:col-span-6">
            <ScrollReveal animation="slide-right" delay={250}>
              <ContactFormUI services={serviceOptions} />
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </Section>
  );
};

