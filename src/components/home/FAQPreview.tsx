import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQAccordion } from '../faq/FAQAccordion';
import { FAQ } from '@/types';
import { ArrowRight } from 'lucide-react';

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

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-white border border-brand-border text-brand-navy font-bold text-sm hover:border-brand-secondary-blue hover:text-brand-secondary-blue transition-all shadow-xs"
          >
            <span>View All FAQs & Technical Answers</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
};
