import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_change_in_production'
);

const COOKIE_NAME = 'auth_token';
const MAX_AGE = 60 * 60 * 8; // 8 hours

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Signs a JWT and returns the token string.
 */
export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token and returns the payload, or null if invalid.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the auth cookie on the response.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
}

/**
 * Clears the auth cookie on the response.
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Gets the current authenticated user from the request cookies.
 * Returns null if not authenticated.
 */
export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

/**
 * Gets the current authenticated user from server-side cookies (for Server Components).
 */
export async function getServerAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

/**
 * Higher-order function that wraps an API route handler with auth protection.
 * Returns 401 JSON if not authenticated.
 */
export function withAuth(
  handler: (req: NextRequest, user: JWTPayload, context?: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }
    return handler(req, user, context);
  };
}
