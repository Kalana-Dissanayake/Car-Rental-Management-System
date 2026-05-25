import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import BookingCalendar from '@/components/BookingCalendar';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Calendar — DriveEase Admin' };

async function getBookingRanges() {
  await connectDB();
  const bookings = await ContactMessage.find(
    {},
    { _id: 1, fullName: 1, vehicleType: 1, pickupDate: 1, returnDate: 1, status: 1 }
  ).lean();
  return JSON.parse(JSON.stringify(bookings));
}

export default async function CalendarPage() {
  const bookings = await getBookingRanges();
  return <BookingCalendar bookings={bookings} />;
}
