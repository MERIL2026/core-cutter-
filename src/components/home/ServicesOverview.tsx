import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ServiceCard } from '../services/ServiceCard';
import { Service } from '@/types';

export interface ServicesOverviewProps {
  services: Service[];
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ services }) => {
  return (
    <Section background="default" spacing="default" id="services">
      <Container>
        <SectionHeading
          eyebrow="Specialized Services"
          title="Professional Diamond Core Cutting Solutions"
          description="From split AC installations to heavy-duty RCC slab drilling, we provide precision rotary diamond coring for every construction and renovation requirement."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
