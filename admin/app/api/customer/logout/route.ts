import { NextRequest, NextResponse } from 'next/server';
import { clearCustomerAuthCookie } from '@/lib/customerAuth';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  clearCustomerAuthCookie(response);

  // CORS headers
  const allowedOrigin = process.env.WEBSITE_URL || 'http://localhost:3000';
  const origin = req.headers.get('origin');
  if (origin === allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
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
