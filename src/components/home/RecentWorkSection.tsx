import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { GalleryGrid } from '../gallery/GalleryGrid';
import { GalleryItem } from '@/types';

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
      </Container>
    </Section>
  );
};
