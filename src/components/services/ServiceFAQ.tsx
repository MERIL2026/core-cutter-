import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQAccordion } from '../faq/FAQAccordion';
import { FAQ } from '@/types';

export interface ServiceFAQProps {
  faqs: FAQ[];
  serviceName: string;
}

export const ServiceFAQ: React.FC<ServiceFAQProps> = ({ faqs, serviceName }) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <Section background="white" spacing="default" id="faqs">
      <Container>
        <SectionHeading
          eyebrow="Questions & Answers"
          title={`Frequently Asked Questions About ${serviceName}`}
          description="Clear answers regarding hole sizes, wall structure safety, equipment requirements, and timing."
          align="center"
        />

        <div className="max-w-3xl mx-auto mt-10">
          <FAQAccordion items={faqs} />
        </div>
      </Container>
    </Section>
  );
};
