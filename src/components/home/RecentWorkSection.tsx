import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { GalleryGrid } from '../gallery/GalleryGrid';
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
    <Section background="default" spacing="default" id="recent-work">
      <Container>
        <SectionHeading
          eyebrow="On-Site Portfolio"
          title="Recent Work & Core Cutting Projects"
          description="Real project documentation showing precision wall penetrations, RCC coring, and AC drain passages."
          align="center"
        />

        <div className="mt-10 sm:mt-12">
          <GalleryGrid items={galleryItems} categories={categories} />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-white border border-brand-border text-brand-navy font-bold text-sm hover:border-brand-secondary-blue hover:text-brand-secondary-blue transition-all shadow-xs"
          >
            <span>View Complete Project Gallery</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
};
