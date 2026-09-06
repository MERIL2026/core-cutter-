import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PhoneCall, Calculator, Wrench, CircleDot, CheckCircle2 } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: PhoneCall,
      title: 'Contact & Requirement',
      description: 'Reach out by Call, WhatsApp, or Quick Quote form with your hole sizes, wall material, and location.',
    },
    {
      number: '02',
      icon: Calculator,
      title: 'Assessment & Quote',
      description: 'We confirm technical specs, wall thickness, and provide straightforward upfront pricing.',
    },
    {
      number: '03',
      icon: Wrench,
      title: 'Technician Arrival & Setup',
      description: 'Our operator arrives on-site with diamond coring machinery, safety gear, and dust/water protection.',
    },
    {
      number: '04',
      icon: CircleDot,
      title: 'Precision Diamond Coring',
      description: 'Smooth, vibration-free rotary diamond drilling through brick, block, or reinforced concrete rebar.',
    },
    {
      number: '05',
      icon: CheckCircle2,
      title: 'Inspection & Cleanup',
      description: 'We extract the concrete cylinder core slug, inspect the opening, and leave the workspace clean.',
    },
  ];

  return (
    <Section background="white" spacing="default" id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="Simple 5-Step Process"
          title="How Our Core Cutting Service Works"
          description="Clear and straightforward workflow from your initial inquiry to final clean hole handover."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10 sm:mt-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col p-6 rounded-xl bg-brand-bg/40 border border-brand-border hover:border-brand-secondary-blue/40 transition-all group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-white border border-brand-border shadow-xs flex items-center justify-center text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xl font-extrabold text-brand-secondary-blue/30 group-hover:text-brand-secondary-blue/60 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
