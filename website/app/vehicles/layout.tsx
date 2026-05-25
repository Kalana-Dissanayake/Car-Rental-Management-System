import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Fleet',
  description:
    'Browse the DriveEase fleet — economy, compact, mid-size, SUVs, luxury vehicles, vans, and trucks. Find your perfect rental car.',
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
