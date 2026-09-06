import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { CircleDot, ShieldAlert, Sparkles, Truck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      icon: CircleDot,
      title: 'Precision Circular Cuts',
      description: 'Accurate 2" to 5" diameter circular holes with smooth, clean edges requiring zero plaster repair.',
    },
    {
      icon: ShieldAlert,
      title: 'Vibration-Free Technology',
      description: 'Diamond rotary friction drilling eliminates heavy impact shock, preventing wall cracks and micro-fractures.',
    },
    {
      icon: Sparkles,
      title: 'Minimally Messy Work',
      description: 'Equipped with water containment and drop sheets to protect flooring and interior finishes.',
    },
    {
      icon: Truck,
      title: 'Prompt Local Dispatch',
      description: 'Direct technician coordination with full diamond coring rig setup for residential and commercial jobs.',
    },
  ];

  return (
    <Section background="white" spacing="default" className="border-b border-brand-border/60">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="flex flex-col p-5 sm:p-6 rounded-xl bg-brand-bg/50 border border-brand-border/80 hover:border-brand-secondary-blue/40 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-white border border-brand-border shadow-xs flex items-center justify-center text-brand-secondary-blue mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy">
                  {point.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
