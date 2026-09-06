import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Service } from '@/types';
import { Info, HelpCircle } from 'lucide-react';

export interface ServiceOverviewProps {
  service: Service;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({ service }) => {
  return (
    <Section background="white" spacing="default" id="overview">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              eyebrow="Detailed Overview"
              title={`About ${service.name}`}
              align="left"
            />
            <div className="prose prose-slate max-w-none text-brand-muted text-base sm:text-lg leading-relaxed space-y-4">
              <p>{service.description}</p>
            </div>

            <div className="p-5 rounded-xl bg-brand-light-blue/40 border border-brand-secondary-blue/20 flex items-start space-x-3">
              <Info className="h-5 w-5 text-brand-secondary-blue shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-brand-navy leading-relaxed">
                <strong>Important Note:</strong> We use specialized diamond-tipped rotary barrel bits that cut smoothly through masonry and rebar without hammering, protecting the structural integrity of your property.
              </div>
            </div>
          </div>

          {/* When You Need This Service Callout */}
          <div className="lg:col-span-5 bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-border space-y-4">
            <div className="flex items-center space-x-2.5 text-brand-navy">
              <div className="h-8 w-8 rounded-lg bg-brand-secondary-blue/10 flex items-center justify-center text-brand-secondary-blue">
                <HelpCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold">When Is This Service Needed?</h3>
            </div>

            <p className="text-sm text-brand-muted leading-relaxed">
              Common project scenarios where {service.name} is recommended:
            </p>

            <ul className="space-y-2.5 text-sm text-brand-text">
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-blue mt-2 shrink-0" />
                <span>Split AC copper piping and drain hose installation through concrete or brick walls.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-blue mt-2 shrink-0" />
                <span>Heavy-duty penetration through reinforced concrete (RCC) beams, slabs, or shear walls.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-blue mt-2 shrink-0" />
                <span>Plumbing supply pipelines, electrical conduits, and ventilation duct routing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-blue mt-2 shrink-0" />
                <span>Renovation and retrofit projects requiring clean openings without chipping or wall cracks.</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
};
