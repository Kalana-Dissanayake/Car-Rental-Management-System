import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_change_in_production'
);

// Separate cookie name — does NOT conflict with admin auth_token
const CUSTOMER_COOKIE_NAME = 'customer_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface CustomerJWTPayload {
  customerId: string;
  email: string;
  firstName: string;
}

/**
 * Signs a Customer JWT and returns the token string.
 */
export async function signCustomerJWT(payload: CustomerJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(JWT_SECRET);
}

/**
 * Verifies a Customer JWT and returns the payload, or null if invalid.
 */
export async function verifyCustomerJWT(token: string): Promise<CustomerJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as CustomerJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the customer_token cookie on the response.
 */
export function setCustomerAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // lax allows cross-site GET navigations (for redirect flows)
    maxAge: MAX_AGE,
    path: '/',
  });
}

/**
 * Clears the customer_token cookie on the response.
 */
export function clearCustomerAuthCookie(response: NextResponse): void {
  response.cookies.set(CUSTOMER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Gets the current authenticated customer from the request cookies.
 * Returns null if not authenticated.
 */
export async function getCustomerUser(req: NextRequest): Promise<CustomerJWTPayload | null> {
  const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerJWT(token);
}

/**
 * Gets the current authenticated customer from server-side cookies (for Server Components).
 */
export async function getServerCustomerUser(): Promise<CustomerJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerJWT(token);
}

/**
 * Higher-order function that wraps an API route handler with customer auth protection.
 * Returns 401 JSON if not authenticated.
 */
export function withCustomerAuth(
  handler: (
    req: NextRequest,
    customer: CustomerJWTPayload,
    context?: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const customer = await getCustomerUser(req);
    if (!customer) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to your account.' },
        { status: 401 }
      );
    }
    return handler(req, customer, context);
  };
}
