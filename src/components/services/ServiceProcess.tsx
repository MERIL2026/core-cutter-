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
              className="relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-brand-orange hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="h-9 w-9 rounded-xl bg-brand-orange text-white text-xs font-black flex items-center justify-center shadow-md shadow-brand-orange/20">
                  0{index + 1}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
                  Step 0{index + 1}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-brand-dark group-hover:text-brand-orange transition-colors">
                {step.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
