import { redirect } from 'next/navigation';
import { getServerAuthUser } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check (belt-and-suspenders alongside middleware)
  const user = await getServerAuthUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar userEmail={user.email} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userEmail={user.email} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
