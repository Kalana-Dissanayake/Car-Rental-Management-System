'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Car, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useCustomer } from '@/app/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setCustomer } = useCustomer();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      setCustomer(data.customer);
      router.push('/account');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              Drive<span className="text-gold">Ease</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your bookings</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gold-gradient text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          <Link href="/" className="hover:text-slate-400 transition-colors">← Back to DriveEase</Link>
        </p>
      </div>
    </div>
  );
}
