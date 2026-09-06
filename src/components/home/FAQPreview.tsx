import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQAccordion } from '../faq/FAQAccordion';
import { FAQ } from '@/types';

export interface FAQPreviewProps {
  faqs: FAQ[];
}

export const FAQPreview: React.FC<FAQPreviewProps> = ({ faqs }) => {
  return (
    <Section background="default" spacing="default" id="faq">
      <Container>
        <SectionHeading
          eyebrow="Helpful Information"
          title="Frequently Asked Questions"
          description="Straightforward technical answers regarding hole diameters, wall materials, timing, and pricing."
          align="center"
        />

        <div className="max-w-3xl mx-auto mt-10 sm:mt-12">
          <FAQAccordion items={faqs} />
        </div>
      </Container>
    </Section>
  );
};
