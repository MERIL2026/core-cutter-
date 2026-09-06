import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ServiceCard } from './ServiceCard';
import { Service } from '@/types';

export interface RelatedServicesProps {
  services: Service[];
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Section background="default" spacing="default" id="related-services">
      <Container>
        <SectionHeading
          eyebrow="Explore More"
          title="Related Core Cutting & Drilling Services"
          description="We provide complete diamond coring, concrete drilling, and service opening solutions across all categories."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
