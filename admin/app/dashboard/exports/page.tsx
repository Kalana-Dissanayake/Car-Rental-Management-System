import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import ExportsClient from '@/components/ExportsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Exports — DriveEase Admin' };

async function getAllBookings() {
  await connectDB();
  const bookings = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(bookings));
}

export default async function ExportsPage() {
  const bookings = await getAllBookings();
  return <ExportsClient bookings={bookings} />;
}
