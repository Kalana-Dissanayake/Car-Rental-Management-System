import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import { signJWT, setAuthCookie } from '@/lib/auth';

// Zod schema for login input validation
const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password too long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input with zod
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await connectDB();

    // Find admin user (don't reveal whether user exists)
    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Constant-time response to prevent user enumeration
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set HttpOnly cookie and return success
    const response = NextResponse.json({
      success: true,
      user: { email: user.email },
    });
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
