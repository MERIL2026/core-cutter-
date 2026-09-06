import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { CheckCircle2 } from 'lucide-react';

export interface ServiceBenefitsProps {
  benefits?: string[] | null;
  serviceName: string;
}

export const ServiceBenefits: React.FC<ServiceBenefitsProps> = ({
  benefits,
  serviceName,
}) => {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <Section background="light" spacing="default" id="benefits">
      <Container>
        <SectionHeading
          eyebrow="Key Advantages"
          title={`Why Choose Our ${serviceName} Service`}
          description="Reliable diamond drilling techniques delivering clean, precise, and structurally safe wall openings."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start space-x-3.5 p-5 bg-white rounded-xl border border-brand-border shadow-xs hover:border-brand-secondary-blue/40 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-sm sm:text-base text-brand-navy font-semibold leading-snug">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
