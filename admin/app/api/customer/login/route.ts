import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { signCustomerJWT, setCustomerAuthCookie } from '@/lib/customerAuth';

const LoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await connectDB();

    const customer = await Customer.findOne({ email });
    if (!customer) {
      // Generic message to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Issue JWT
    const token = await signCustomerJWT({
      customerId: String(customer._id),
      email: customer.email,
      firstName: customer.firstName,
    });

    const response = NextResponse.json({
      success: true,
      customer: {
        customerId: String(customer._id),
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });

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
    console.error('[CUSTOMER LOGIN ERROR]', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
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
