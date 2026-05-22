import { NextRequest, NextResponse } from 'next/server';
import { withAuth, JWTPayload } from '@/lib/auth';

async function handler(_req: NextRequest, user: JWTPayload) {
  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      userId: user.userId,
    },
  });
}

export const GET = withAuth(handler);
