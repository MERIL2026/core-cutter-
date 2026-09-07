import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { GalleryGrid } from '../gallery/GalleryGrid';
import { ScrollReveal } from '../ui/ScrollReveal';
import { GalleryItem } from '@/types';
import { ArrowRight } from 'lucide-react';

export interface RecentWorkSectionProps {
  galleryItems: GalleryItem[];
  categories: string[];
}

export const RecentWorkSection: React.FC<RecentWorkSectionProps> = ({
  galleryItems,
  categories,
}) => {
  return (
    <Section background="default" spacing="default" id="recent-work" className="overflow-hidden">
      <Container>
        <ScrollReveal animation="fade-down" delay={50}>
          <SectionHeading
            eyebrow="On-Site Portfolio"
            title="Recent Work & Core Cutting Projects"
            description="Real project documentation showing precision wall penetrations, RCC coring, and AC drain passages."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={180} className="mt-10 sm:mt-12">
          <GalleryGrid items={galleryItems} categories={categories} />
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={260} className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-brand-orange text-white font-extrabold text-sm hover:bg-brand-orange-hover transition-all shadow-md shadow-brand-orange/25 group"
          >
            <span>View Complete Project Gallery</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </Container>
    </Section>
  );
};

