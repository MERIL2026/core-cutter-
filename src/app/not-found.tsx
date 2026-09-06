import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { getBusinessProfile } from '@/lib/content';
import { AlertCircle, ArrowLeft, Wrench } from 'lucide-react';

export default function NotFound() {
  const businessProfile = getBusinessProfile();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      <Header
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
      />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow">
          <div className="bg-white rounded-2xl border border-brand-border p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-9 w-9" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary-blue">
                404 — Page Not Found
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                The Requested Service or Page Does Not Exist
              </h1>
              <p className="text-sm sm:text-base text-brand-muted max-w-md mx-auto">
                We could not find the page or service you are looking for. Please check our full list of core cutting services or return to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/services">
                <Button variant="primary" size="md" leftIcon={<Wrench className="h-4 w-4" />}>
                  View All Services
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer
        businessName={businessProfile.business_name}
        phone={businessProfile.phone}
        whatsapp={businessProfile.whatsapp || businessProfile.phone}
        city={businessProfile.city}
      />
    </div>
  );
}
