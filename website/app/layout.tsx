import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DriveEase | Premium Car Rental',
    template: '%s | DriveEase Car Rental',
  },
  description:
    'DriveEase offers premium, affordable car rentals for every journey. Choose from economy to luxury vehicles with seamless booking.',
  keywords: ['car rental', 'vehicle hire', 'car hire', 'DriveEase', 'luxury car rental'],
  openGraph: {
    title: 'DriveEase | Premium Car Rental',
    description: 'Premium, affordable car rentals for every journey.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0f] text-slate-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
