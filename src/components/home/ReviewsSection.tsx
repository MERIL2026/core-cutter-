import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ReviewCard } from '../reviews/ReviewCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Review } from '@/types';
import { MessageSquareQuote, ArrowRight } from 'lucide-react';

export interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <Section background="white" spacing="default" id="reviews" className="overflow-hidden">
      <Container>
        <ScrollReveal animation="fade-down" delay={50}>
          <SectionHeading
            eyebrow="Social Proof"
            title="Customer Feedback & Reviews"
            description="Real verified reviews from homeowners, AC installation technicians, and commercial contractors."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 sm:mt-12">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reviews.map((review, index) => (
                <ScrollReveal
                  key={review.id}
                  animation="fade-up"
                  delay={index * 100}
                  className="h-full"
                >
                  <ReviewCard review={review} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal animation="zoom-in" delay={150}>
              <div className="max-w-xl mx-auto text-center py-12 px-6 rounded-2xl border-2 border-dashed border-brand-border bg-brand-bg/30">
                <MessageSquareQuote className="mx-auto h-12 w-12 text-brand-secondary-blue/60" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-brand-navy">Customer Reviews</h3>
                <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
                  Customer reviews and verified ratings will appear here once approved by the business owner. We maintain a strict policy of only displaying genuine client feedback.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>

        <ScrollReveal animation="zoom-in" delay={250} className="mt-12 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-brand-orange text-white font-extrabold text-sm hover:bg-brand-orange-hover transition-all shadow-md shadow-brand-orange/25 group"
          >
            <span>Explore All Customer Reviews & Policy</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </Container>
    </Section>
  );
};

