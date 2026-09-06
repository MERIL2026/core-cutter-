import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { ContactFormUI } from '../forms/ContactFormUI';
import { ContactCTA } from '../ui/ContactCTA';
import { Service, BusinessProfile } from '@/types';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';

export interface ServiceCTAProps {
  service: Service;
  allServices: Service[];
  businessProfile: BusinessProfile;
}

export const ServiceCTA: React.FC<ServiceCTAProps> = ({
  service,
  allServices,
  businessProfile,
}) => {
  const serviceOptions = allServices.map((s) => ({ id: s.slug, name: s.name }));

  return (
    <Section background="light" spacing="default" id="quote-section" className="border-t border-brand-border/80">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Direct Call / WhatsApp */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-secondary-blue mb-2">
                Fast &amp; Accurate Booking
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                Request a Free Quote for {service.name}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
                Connect directly with our core cutting team to discuss your project specifications, get exact diameter recommendations, and receive transparent upfront pricing.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium leading-normal">
                  Direct technician dispatch equipped with full diamond drilling rig.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium leading-normal">
                  Controlled water and dust containment for clean indoor execution.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-text font-medium leading-normal">
                  Accurate hole angle and diameter matching your installation needs.
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brand-border/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-brand-navy">Speak with Our Team Now:</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <ContactCTA
                  type="call"
                  phone={businessProfile.phone}
                  size="md"
                  label={businessProfile.phone ? `Call: ${businessProfile.phone}` : 'Call Technician'}
                  className="w-full sm:w-auto shadow-xs"
                />
                <ContactCTA
                  type="whatsapp"
                  whatsapp={businessProfile.whatsapp || businessProfile.phone}
                  size="md"
                  label="WhatsApp Us"
                  className="w-full sm:w-auto"
                />
              </div>

              <div className="pt-3 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-muted">
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

          {/* Right: Interactive Contact Form pre-selected to this service */}
          <div className="lg:col-span-6">
            <ContactFormUI services={serviceOptions} />
          </div>
        </div>
      </Container>
    </Section>
  );
};
