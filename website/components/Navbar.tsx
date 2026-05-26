'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Car, Menu, X, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useCustomer } from '@/app/context/AuthContext';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Vehicles', href: '/vehicles' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, loading, logout } = useCustomer();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close account dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleLogout() {
    setAccountMenuOpen(false);
    await logout();
    router.push('/');
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" id="navbar-logo">
          <Image src="/images/Logo.png" alt="DriveEase Logo" width={180} height={56} className="h-14 w-auto object-contain" priority />
          <span className="font-bold text-white text-lg">
            Drive<span className="text-gold">Ease</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth area */}
          {!loading && (
            customer ? (
              /* Logged in — account dropdown */
              <div className="relative ml-3" ref={accountMenuRef}>
                <button
                  id="account-menu-btn"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 glass border border-white/10 hover:border-amber-500/30 rounded-xl text-sm text-slate-300 hover:text-white transition-all"
                >
                  <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-xs font-bold text-white">
                    {customer.firstName[0].toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{customer.firstName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-white text-sm font-medium truncate">{customer.firstName}</p>
                      <p className="text-slate-500 text-xs truncate">{customer.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        id="nav-my-account"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        id="nav-logout-btn"
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged out — sign in link */
              <Link
                href="/login"
                id="nav-sign-in"
                className="ml-3 flex items-center gap-1.5 px-4 py-2 glass border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-all"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )
          )}

          <Link
            href="/booking"
            id="navbar-book-now"
            className="ml-2 px-5 py-2 gold-gradient text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile auth links */}
          {!loading && (
            customer ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  My Bookings
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <User className="w-4 h-4 text-amber-400" />
                Sign In
              </Link>
            )
          )}

          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 gold-gradient text-white text-sm font-semibold rounded-xl text-center mt-2"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
