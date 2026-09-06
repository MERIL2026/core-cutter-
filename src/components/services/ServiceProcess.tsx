import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ServiceProcessStep } from '@/types';

export interface ServiceProcessProps {
  process?: ServiceProcessStep[] | null;
  serviceName: string;
}

export const ServiceProcess: React.FC<ServiceProcessProps> = ({
  process,
  serviceName,
}) => {
  if (!process || process.length === 0) {
    return null;
  }

  return (
    <Section background="white" spacing="default" id="process">
      <Container>
        <SectionHeading
          eyebrow="Step-by-Step Approach"
          title={`Our ${serviceName} Execution Process`}
          description="A structured, low-vibration method ensuring safety, precision, and site cleanliness."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 sm:mt-12">
          {process.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col p-6 rounded-xl bg-brand-bg/50 border border-brand-border hover:border-brand-secondary-blue/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="h-8 w-8 rounded-lg bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                  0{index + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary-blue">
                  Step {index + 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                {step.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
