import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { withCustomerAuth, CustomerJWTPayload } from '@/lib/customerAuth';

async function getHandler(req: NextRequest, customer: CustomerJWTPayload) {
  try {
    await connectDB();

    const doc = await Customer.findById(customer.customerId)
      .select('-password')
      .lean();

    if (!doc) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      customer: {
        customerId: String(doc._id),
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        createdAt: doc.createdAt,
      },
    });

    // CORS headers
    const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
    const origin = req.headers.get('origin');
    if (origin === allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  } catch (error) {
    console.error('[CUSTOMER ME ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch profile.' }, { status: 500 });
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
