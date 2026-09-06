import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ReviewCard } from '../reviews/ReviewCard';
import { Review } from '@/types';
import { MessageSquareQuote } from 'lucide-react';

export interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <Section background="white" spacing="default" id="reviews">
      <Container>
        <SectionHeading
          eyebrow="Social Proof"
          title="Customer Feedback & Reviews"
          description="Real verified reviews from homeowners, AC installation technicians, and commercial contractors."
          align="center"
        />

        <div className="mt-10 sm:mt-12">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center py-12 px-6 rounded-2xl border-2 border-dashed border-brand-border bg-brand-bg/30">
              <MessageSquareQuote className="mx-auto h-12 w-12 text-brand-secondary-blue/60" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-brand-navy">Customer Reviews</h3>
              <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
                Customer reviews and verified ratings will appear here once approved by the business owner. We maintain a strict policy of only displaying genuine client feedback.
              </p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
