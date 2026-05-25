import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withCustomerAuth, CustomerJWTPayload } from '@/lib/customerAuth';

// ─── GET /api/customer/bookings — fetch bookings for this customer ────────────
async function getHandler(req: NextRequest, customer: CustomerJWTPayload) {
  try {
    await connectDB();

    const bookings = await ContactMessage.find({ customerId: customer.customerId })
      .sort({ createdAt: -1 })
      .lean();

    const response = NextResponse.json({ success: true, data: bookings });

    const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
    const origin = req.headers.get('origin');
    if (origin === allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  } catch (error) {
    console.error('[CUSTOMER BOOKINGS GET ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch bookings.' }, { status: 500 });
  }
}

export const GET = withCustomerAuth(getHandler);

export async function OPTIONS(req: NextRequest) {
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
