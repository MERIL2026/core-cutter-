import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { generateLocalBusinessSchema } from '@/lib/seo/structuredData';
import { getBusinessProfile, getActiveServiceAreas } from '@/lib/content';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AC Core Cutting & RCC Concrete Drilling Services',
    template: '%s | AC Core Cutting',
  },
  description:
    'Professional diamond core cutting, RCC slab drilling, AC drain hole creation, and concrete wall penetrations with clean vibration-free execution.',
  keywords: [
    'AC core cutting',
    'RCC core cutting',
    'concrete core drilling',
    'diamond core drilling',
    'AC drain hole drilling',
    'wall drilling services',
    'pipe cable passage',
  ],
  authors: [{ name: 'AC Core Cutting Team' }],
  creator: 'AC Core Cutting Services',
  publisher: 'AC Core Cutting Services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AC Core Cutting & RCC Concrete Drilling Services',
    description:
      'Professional diamond core cutting, RCC slab drilling, AC drain hole creation, and concrete wall penetrations with clean vibration-free execution.',
    url: SITE_URL,
    siteName: 'AC Core Cutting Services',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AC Core Cutting & RCC Concrete Drilling Services',
    description:
      'Professional diamond core cutting, RCC slab drilling, AC drain hole creation, and concrete wall penetrations.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessProfile = getBusinessProfile();
  const serviceAreas = getActiveServiceAreas();
  const localBusinessSchema = generateLocalBusinessSchema(businessProfile, serviceAreas);

  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased selection:bg-brand-light-blue selection:text-brand-navy">
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
