import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQAccordion } from '../faq/FAQAccordion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { FAQ } from '@/types';
import { ArrowRight } from 'lucide-react';

export interface FAQPreviewProps {
  faqs: FAQ[];
}

export const FAQPreview: React.FC<FAQPreviewProps> = ({ faqs }) => {
  return (
    <Section background="default" spacing="default" id="faq" className="overflow-hidden">
      <Container>
        <ScrollReveal animation="fade-down" delay={50}>
          <SectionHeading
            eyebrow="Helpful Information"
            title="Frequently Asked Questions"
            description="Straightforward technical answers regarding hole diameters, wall materials, timing, and pricing."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} className="max-w-3xl mx-auto mt-10 sm:mt-12">
          <FAQAccordion items={faqs} />
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={250} className="mt-12 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-brand-orange text-white font-extrabold text-sm hover:bg-brand-orange-hover transition-all shadow-md shadow-brand-orange/25 group"
          >
            <span>View All FAQs & Technical Answers</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </Container>
    </Section>
  );
};

