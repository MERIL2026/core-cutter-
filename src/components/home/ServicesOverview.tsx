import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { ServiceCard } from '../services/ServiceCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Service } from '@/types';
import { ArrowRight } from 'lucide-react';

export interface ServicesOverviewProps {
  services: Service[];
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ services }) => {
  return (
    <Section background="light" spacing="default" id="services" className="bg-brand-cream/60">
      <Container>
        {/* Section Header with Top-Right Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <ScrollReveal animation="fade-down" delay={50}>
              <div className="inline-flex items-center space-x-2 text-brand-orange font-extrabold text-xs tracking-wider uppercase">
                <span className="text-brand-orange font-black text-sm">{"//"}</span>
                <span>OUR SERVICES</span>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="slide-left" delay={120}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                We Deliver Your Openings With Trust &amp; Quality.
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="slide-right" delay={200}>
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow transition-all shrink-0 self-start md:self-auto"
            >
              <span>See All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>

        {/* 3-Column Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.id}
              animation="fade-up"
              delay={index * 100}
              className="h-full"
            >
              <ServiceCard service={service} index={index} className="h-full" />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
};

