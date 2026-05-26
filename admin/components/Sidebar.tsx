'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Car, LayoutDashboard, BookOpen, CalendarDays, Download, LogOut, Settings, HelpCircle } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Bookings',  href: '/dashboard/bookings', icon: BookOpen },
  { label: 'Calendar',  href: '/dashboard/calendar', icon: CalendarDays },
  { label: 'Exports',   href: '/dashboard/exports',  icon: Download },
];

const systemItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help',     href: '/dashboard/help',     icon: HelpCircle },
];

interface SidebarProps { userEmail: string; }

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-[#1a1a2e] border-r border-gray-800 z-20">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/images/Logo.png" alt="DriveEase Logo" width={160} height={48} className="h-12 w-auto object-contain" priority />
          <div>
            <p className="font-bold text-white text-sm leading-none">DriveEase</p>
            <p className="text-gray-500 text-xs leading-none mt-1">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 pt-2 pb-1.5">
          Menu
        </p>
        {navItems.map((item) => {
          // Exact match for Dashboard, prefix match for sub-pages
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {/* New badge — shown on Bookings when relevant */}
            </Link>
          );
        })}

        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 pt-4 pb-1.5 border-t border-gray-800/50 mt-2">
          System
        </p>
        {systemItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-800/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{userEmail}</p>
            <p className="text-gray-500 text-xs">Administrator</p>
          </div>
        </div>
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
