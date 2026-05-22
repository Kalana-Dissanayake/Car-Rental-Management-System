import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

/**
 * Next.js 16 Proxy (replaces middleware.ts) — runs on every matched route.
 * Protects all /dashboard routes: redirects to /login if no valid JWT cookie.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth_token')?.value;

  // If on a protected route and no token → redirect to login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyJWT(token);
    if (!user) {
      // Token invalid/expired → clear cookie and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // If already logged in and visiting /login or root → redirect to dashboard
  if (pathname === '/login' || pathname === '/') {
    if (token) {
      const user = await verifyJWT(token);
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/'],
};
