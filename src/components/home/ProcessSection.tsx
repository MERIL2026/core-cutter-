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
          eyebrow="Workflow Protocol"
          title="How Our Core Cutting Service Works"
          description="Clear and straightforward workflow from your initial inquiry to final clean hole handover."
          align="center"
        />

        <div className="relative mt-12 sm:mt-16">
          {/* Subtle connecting line across cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-brand-border -translate-y-12 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col p-6 rounded-2xl bg-white border border-brand-border/90 shadow-xs hover:shadow-lg hover:border-brand-accent-blue/50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-xl bg-brand-light-blue/50 border border-brand-accent-blue/30 flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-2xl font-extrabold text-slate-300 group-hover:text-brand-accent-blue transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-secondary-blue transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};
