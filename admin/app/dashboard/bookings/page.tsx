import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import BookingsManager from '@/components/BookingsManager';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Bookings — DriveEase Admin' };

async function getAllMessages() {
  await connectDB();
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(messages));
}

export default async function BookingsPage() {
  const messages = await getAllMessages();
  return <BookingsManager initialMessages={messages} />;
}
