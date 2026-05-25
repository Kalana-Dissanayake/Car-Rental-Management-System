import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { Metadata } from 'next';
import AccountDashboard from './AccountDashboard';

export const metadata: Metadata = {
  title: 'My Account | DriveEase',
  description: 'Manage your DriveEase car rental bookings.',
};

interface CustomerPayload {
  customerId: string;
  email: string;
  firstName: string;
}

async function getCustomerFromCookie(): Promise<CustomerPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_change_in_production'
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as CustomerPayload;
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const customer = await getCustomerFromCookie();

  if (!customer) {
    redirect('/login');
  }

  return <AccountDashboard customer={customer} />;
}
