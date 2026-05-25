'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User, Mail, Phone, Car, Calendar, MessageSquare, CheckCircle, AlertCircle, Loader2, LogIn
} from 'lucide-react';
import { useCustomer } from '@/app/context/AuthContext';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  pickupDate: string;
  returnDate: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const vehicleOptions = [
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Mid-Size' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
  { value: 'sports', label: 'Sports' },
];

const today = new Date().toISOString().split('T')[0];

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2)
    errors.fullName = 'Full name must be at least 2 characters';
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
    errors.email = 'Please enter a valid email address';
  if (!data.phone || !/^[+]?[\d\s\-()]{7,20}$/.test(data.phone))
    errors.phone = 'Please enter a valid phone number';
  if (!data.vehicleType)
    errors.vehicleType = 'Please select a vehicle type';
  if (!data.pickupDate)
    errors.pickupDate = 'Pickup date is required';
  if (!data.returnDate)
    errors.returnDate = 'Return date is required';
  if (data.pickupDate && data.returnDate && new Date(data.returnDate) <= new Date(data.pickupDate))
    errors.returnDate = 'Return date must be after pickup date';
  if (data.message && data.message.length > 1000)
    errors.message = 'Message must not exceed 1000 characters';

  return errors;
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedVehicle = searchParams.get('vehicle') || '';
  const { customer } = useCustomer();

  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: preselectedVehicle,
    pickupDate: '',
    returnDate: '',
    message: '',
  });

  // Auto-fill name/email from customer session
  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || `${customer.firstName}`,
        email: prev.email || customer.email,
      }));
    }
  }, [customer]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  // Update vehicleType if URL param changes
  useEffect(() => {
    if (preselectedVehicle) {
      setForm((prev) => ({ ...prev, vehicleType: preselectedVehicle }));
      // Sync CarPreview with the pre-selected vehicle
      window.dispatchEvent(new CustomEvent('driveease:vehicleChange', { detail: preselectedVehicle }));
    }
  }, [preselectedVehicle]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Notify CarPreview sidebar of vehicle type change
    if (name === 'vehicleType') {
      window.dispatchEvent(new CustomEvent('driveease:vehicleChange', { detail: value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    // Client-side validation
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

      // Build payload — include customerId if user is logged in
      const payload: Record<string, unknown> = { ...form };
      if (customer?.customerId) {
        payload.customerId = customer.customerId;
      }

      const res = await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Submission failed. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      // Reset form on success
      setForm({
        fullName: '',
        email: '',
        phone: '',
        vehicleType: '',
        pickupDate: '',
        returnDate: '',
        message: '',
      });
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  // ── Success State ──────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Booking Request Sent!</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Thank you for choosing DriveEase. We&apos;ve received your booking request and will 
          contact you within 2 hours to confirm your reservation.
        </p>
        {customer && (
          <a
            href="/account"
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-4 glass border border-amber-500/30 text-amber-400 text-sm font-medium rounded-xl hover:bg-amber-500/10 transition-all"
          >
            <LogIn className="w-4 h-4" />
            View in My Dashboard
          </a>
        )}
        <div>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            id="book-another-btn"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────
  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
        : 'border-slate-700/60 focus:border-amber-500 focus:ring-amber-500/30'
    }`;

  return (
    <div className="glass rounded-3xl p-8 lg:p-10">
      <h2 className="text-xl font-bold text-white mb-1">Booking Details</h2>
      <p className="text-slate-500 text-sm mb-8">Fill in the form below and we&apos;ll get back to you promptly.</p>

      <form onSubmit={handleSubmit} id="booking-form" noValidate className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
              <User className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className={inputClass('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              <Mail className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
              <Phone className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
              className={inputClass('phone')}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-slate-300 mb-2">
              <Car className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Vehicle Type <span className="text-red-400">*</span>
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className={inputClass('vehicleType') + ' cursor-pointer'}
            >
              <option value="" disabled className="bg-slate-900">
                Select vehicle type
              </option>
              {vehicleOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.vehicleType}
              </p>
            )}
          </div>
        </div>

        {/* Row 3 — Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-green-400" />
              Pickup Date <span className="text-red-400">*</span>
            </label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              value={form.pickupDate}
              min={today}
              onChange={handleChange}
              className={inputClass('pickupDate') + ' cursor-pointer'}
            />
            {errors.pickupDate && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.pickupDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-red-400" />
              Return Date <span className="text-red-400">*</span>
            </label>
            <input
              id="returnDate"
              name="returnDate"
              type="date"
              value={form.returnDate}
              min={form.pickupDate || today}
              onChange={handleChange}
              className={inputClass('returnDate') + ' cursor-pointer'}
            />
            {errors.returnDate && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.returnDate}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
            <MessageSquare className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
            Additional Message{' '}
            <span className="text-slate-600 font-normal text-xs">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Any specific requirements or questions..."
            maxLength={1000}
            className={inputClass('message') + ' resize-none'}
          />
          <div className="flex justify-between mt-1.5">
            {errors.message ? (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-600">{form.message.length}/1000</span>
          </div>
        </div>

        {/* Server Error */}
        {status === 'error' && serverError && (
          <div
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          id="booking-submit-btn"
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 gold-gradient text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Booking Request'
          )}
        </button>
      </form>
    </div>
  );
}
