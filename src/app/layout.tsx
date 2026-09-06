import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AC Core Cutting Business Website',
  description: 'Professional AC core cutting, RCC drilling, and concrete wall drilling services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased selection:bg-brand-light-blue selection:text-brand-navy">
        {children}
      </body>
    </html>
  );
}
