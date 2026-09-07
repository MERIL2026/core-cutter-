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
    <Section background="light" spacing="default" id="benefits" className="bg-[#F8F6F2]">
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
              className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="h-8 w-8 rounded-full bg-orange-50 text-brand-orange border border-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <span className="text-sm sm:text-base text-brand-dark font-bold leading-snug">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
