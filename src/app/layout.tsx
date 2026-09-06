import type { Metadata } from 'next';
import '../styles/globals.css';

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
    <html lang="en">
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased">
        {children}
      </body>
    </html>
  );
}
