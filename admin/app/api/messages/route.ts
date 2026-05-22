import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withAuth, JWTPayload } from '@/lib/auth';

// ─── GET /api/messages (Protected) ─────────────────────────────────────────
async function getHandler(req: NextRequest, _user: JWTPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET MESSAGES ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// ─── Zod validation schema for contact form ────────────────────────────────
const ContactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .trim(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]{7,20}$/, 'Invalid phone number format')
    .trim(),
  vehicleType: z.enum(['economy', 'compact', 'midsize', 'suv', 'luxury', 'van', 'truck', 'sports'], {
    errorMap: () => ({ message: 'Please select a valid vehicle type' }),
  }),
  pickupDate: z
    .string()
    .min(1, 'Pickup date is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid pickup date'),
  returnDate: z
    .string()
    .min(1, 'Return date is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid return date'),
  message: z.string().max(1000, 'Message too long').optional().default(''),
});

// ─── POST /api/messages (Public — from website) ───────────────────────────
export async function POST(req: NextRequest) {
  try {
    // CORS — only allow requests from the website origin
    const origin = req.headers.get('origin');
    const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';

    const body = await req.json();

    // Validate and sanitize input
    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Additional date validation — return date must be after pickup date
    const pickup = new Date(result.data.pickupDate);
    const returnD = new Date(result.data.returnDate);
    if (returnD <= pickup) {
      return NextResponse.json(
        { error: 'Return date must be after pickup date' },
        { status: 400 }
      );
    }

    await connectDB();

    const newMessage = await ContactMessage.create(result.data);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Your booking request has been submitted successfully!',
        id: newMessage._id,
      },
      { status: 201 }
    );

    // Set CORS headers
    if (origin === allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  } catch (error) {
    console.error('[CREATE MESSAGE ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to submit your request. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export const GET = withAuth(getHandler);
