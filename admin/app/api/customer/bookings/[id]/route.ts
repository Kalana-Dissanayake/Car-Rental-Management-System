import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withCustomerAuth, CustomerJWTPayload } from '@/lib/customerAuth';

const CORS_HEADERS = (origin: string | null) => {
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  return origin === allowedOrigin
    ? {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
      }
    : {};
};

// ─── PUT /api/customer/bookings/[id] — edit booking ──────────────────────────
const EditSchema = z.object({
  vehicleType: z
    .enum(['economy', 'compact', 'midsize', 'suv', 'luxury', 'van', 'truck', 'sports'])
    .optional(),
  pickupDate: z
    .string()
    .min(1)
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid pickup date')
    .optional(),
  returnDate: z
    .string()
    .min(1)
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid return date')
    .optional(),
});

async function putHandler(
  req: NextRequest,
  customer: CustomerJWTPayload,
  context?: { params: Promise<Record<string, string>> }
) {
  try {
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid booking ID.' }, { status: 400 });
    }

    const body = await req.json();
    const result = EditSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { pickupDate, returnDate, vehicleType } = result.data;

    // Validate date ordering if both provided
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
      return NextResponse.json(
        { error: 'Return date must be after pickup date.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the booking and verify ownership
    const booking = await ContactMessage.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    if (String(booking.customerId) !== customer.customerId) {
      return NextResponse.json(
        { error: 'You are not authorized to edit this booking.' },
        { status: 403 }
      );
    }

    // Build update object
    const updates: Record<string, string> = {};
    if (vehicleType) updates.vehicleType = vehicleType;
    if (pickupDate) updates.pickupDate = pickupDate;
    if (returnDate) updates.returnDate = returnDate;

    const updated = await ContactMessage.findByIdAndUpdate(id, updates, { new: true }).lean();

    const response = NextResponse.json({ success: true, data: updated });
    Object.entries(CORS_HEADERS(req.headers.get('origin'))).forEach(([k, v]) =>
      response.headers.set(k, v)
    );
    return response;
  } catch (error) {
    console.error('[CUSTOMER BOOKING PUT ERROR]', error);
    return NextResponse.json({ error: 'Failed to update booking.' }, { status: 500 });
  }
}

// ─── DELETE /api/customer/bookings/[id] — cancel booking ─────────────────────
async function deleteHandler(
  req: NextRequest,
  customer: CustomerJWTPayload,
  context?: { params: Promise<Record<string, string>> }
) {
  try {
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid booking ID.' }, { status: 400 });
    }

    await connectDB();

    const booking = await ContactMessage.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    if (String(booking.customerId) !== customer.customerId) {
      return NextResponse.json(
        { error: 'You are not authorized to cancel this booking.' },
        { status: 403 }
      );
    }

    await ContactMessage.findByIdAndDelete(id);

    const response = NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully.',
    });
    Object.entries(CORS_HEADERS(req.headers.get('origin'))).forEach(([k, v]) =>
      response.headers.set(k, v)
    );
    return response;
  } catch (error) {
    console.error('[CUSTOMER BOOKING DELETE ERROR]', error);
    return NextResponse.json({ error: 'Failed to cancel booking.' }, { status: 500 });
  }
}

export const PUT = withCustomerAuth(putHandler);
export const DELETE = withCustomerAuth(deleteHandler);

export async function OPTIONS(req: NextRequest) {
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
