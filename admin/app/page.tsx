import { redirect } from 'next/navigation';

// Root "/" redirects to login (middleware also handles this, but belt-and-suspenders)
export default function RootPage() {
  redirect('/login');
}
