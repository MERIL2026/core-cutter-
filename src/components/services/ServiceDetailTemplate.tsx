import React from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { ServiceHero } from './ServiceHero';
import { ServiceOverview } from './ServiceOverview';
import { ServiceBenefits } from './ServiceBenefits';
import { ServiceProcess } from './ServiceProcess';
import { RelatedServices } from './RelatedServices';
import { ServiceFAQ } from './ServiceFAQ';
import { ServiceCTA } from './ServiceCTA';
import { Service, BusinessProfile, FAQ } from '@/types';

export interface ServiceDetailTemplateProps {
  service: Service;
  allServices: Service[];
  relatedServices: Service[];
  faqs: FAQ[];
  businessProfile: BusinessProfile;
}

export const ServiceDetailTemplate: React.FC<ServiceDetailTemplateProps> = ({
  service,
  allServices,
  relatedServices,
  faqs,
  businessProfile,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      {/* 1. Global Header */}
      <Header
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
      />

      <main className="flex-1">
        {/* 2. Service Hero with Breadcrumbs, Single H1, CTAs & Media Slot */}
        <ServiceHero service={service} businessProfile={businessProfile} />

        {/* 3. Detailed Overview & Use Cases */}
        <ServiceOverview service={service} />

        {/* 4. Benefits / Value Proposition */}
        <ServiceBenefits benefits={service.benefits} serviceName={service.name} />

        {/* 5. Execution Process */}
        <ServiceProcess process={service.process} serviceName={service.name} />

        {/* 6. Related Services Navigation */}
        <RelatedServices services={relatedServices} />

        {/* 7. Service-Specific & General FAQs */}
        <ServiceFAQ faqs={faqs} serviceName={service.name} />

        {/* 8. Conversion Section with Direct Action & Form */}
        <ServiceCTA
          service={service}
          allServices={allServices}
          businessProfile={businessProfile}
        />
      </main>

      {/* 9. Global Footer */}
      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
};
