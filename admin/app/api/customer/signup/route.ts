import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { signCustomerJWT, setCustomerAuthCookie } from '@/lib/customerAuth';

const SignupSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = result.data;

    await connectDB();

    // Check if email already exists
    const existing = await Customer.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Issue JWT
    const token = await signCustomerJWT({
      customerId: String(customer._id),
      email: customer.email,
      firstName: customer.firstName,
    });

    const response = NextResponse.json(
      {
        success: true,
        customer: {
          customerId: String(customer._id),
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
      },
      { status: 201 }
    );

    setCustomerAuthCookie(response, token);

    // CORS headers
    const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
    const origin = req.headers.get('origin');
    if (origin === allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  } catch (error) {
    console.error('[CUSTOMER SIGNUP ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
