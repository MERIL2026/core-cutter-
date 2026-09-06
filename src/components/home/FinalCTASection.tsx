import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { ContactFormUI } from '../forms/ContactFormUI';
import { ContactCTA } from '../ui/ContactCTA';
import { BusinessProfile, Service } from '@/types';
import { Phone, MessageSquare, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export interface FinalCTASectionProps {
  businessProfile: BusinessProfile;
  services: Service[];
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  businessProfile,
  services,
}) => {
  const serviceOptions = services.map((s) => ({ id: s.slug, name: s.name }));

  return (
    <Section background="white" spacing="default" id="quote-section" className="border-t border-brand-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Call & WhatsApp Conversion */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-secondary-blue mb-2">
                Fast Response Service
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                Need Core Cutting or Concrete Drilling?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                Contact our technicians directly for immediate job scheduling, hole diameter consultation, and competitive upfront pricing for your AC or construction project.
              </p>
            </div>

            {/* Key Service Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium">
                  Standard 2&quot; to 5&quot; diameter bits ready on-site for immediate split AC installations.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium">
                  Heavy-duty water-cooled diamond coring for reinforced concrete (RCC) with steel rebar.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium">
                  Clean execution with zero wall vibration and minimal dust/slurry disturbance.
                </span>
              </div>
            </div>

            {/* Direct Instant Action CTAs */}
            <div className="bg-brand-bg/60 rounded-2xl p-6 border border-brand-border space-y-4">
              <h3 className="text-base font-bold text-brand-navy">Speak with a Technician Directly:</h3>
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

          {/* Right Column: Quote Request Form */}
          <div className="lg:col-span-6">
            <ContactFormUI services={serviceOptions} />
          </div>
        </div>
      </Container>
    </Section>
  );
};
