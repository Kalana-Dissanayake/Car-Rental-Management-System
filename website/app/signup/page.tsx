'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Car, AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useCustomer } from '@/app/context/AuthContext';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex gap-4 mt-2">
      {checks.map((c) => (
        <span
          key={c.label}
          className={`flex items-center gap-1 text-xs transition-colors ${
            c.ok ? 'text-green-400' : 'text-slate-600'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          {c.label}
        </span>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { setCustomer } = useCustomer();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const apiBase = '';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/customer/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm">Start managing your rentals in one place</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                  First Name
                </label>
                <input
                  id="signup-firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="signup-lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  id="signup-lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Email Address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters"
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
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Confirm Password
              </label>
              <input
                id="signup-confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-slate-700/60 focus:border-amber-500 focus:ring-amber-500/30'
                }`}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
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
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gold-gradient text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign in
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
