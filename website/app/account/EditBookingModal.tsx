'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Car, Calendar, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface Booking {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  pickupDate: string;
  returnDate: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

interface Props {
  booking: Booking;
  onClose: () => void;
  onSaved: (updated: Booking) => void;
}

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

export default function EditBookingModal({ booking, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    vehicleType: booking.vehicleType,
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const apiBase = '';

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleSave() {
    setError('');

    if (!form.pickupDate || !form.returnDate) {
      setError('Please fill in both dates.');
      return;
    }
    if (new Date(form.returnDate) <= new Date(form.pickupDate)) {
      setError('Return date must be after pickup date.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/customer/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update booking.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSaved({ ...booking, ...form });
      }, 900);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl shadow-black/60 animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          aria-label="Close modal"
          id="edit-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="edit-modal-title" className="text-xl font-bold text-white mb-1">
          Edit Booking
        </h2>
        <p className="text-slate-500 text-sm mb-7">
          Update your vehicle type or rental dates.
        </p>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-white font-semibold">Booking updated!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Vehicle Type */}
            <div>
              <label htmlFor="edit-vehicleType" className="block text-sm font-medium text-slate-300 mb-2">
                <Car className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Vehicle Type
              </label>
              <select
                id="edit-vehicleType"
                value={form.vehicleType}
                onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors cursor-pointer"
              >
                {vehicleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div>
              <label htmlFor="edit-pickupDate" className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-green-400" />
                Pickup Date
              </label>
              <input
                id="edit-pickupDate"
                type="date"
                min={today}
                value={form.pickupDate}
                onChange={(e) => setForm((p) => ({ ...p, pickupDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors cursor-pointer"
              />
            </div>

            {/* Return Date */}
            <div>
              <label htmlFor="edit-returnDate" className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-red-400" />
                Return Date
              </label>
              <input
                id="edit-returnDate"
                type="date"
                min={form.pickupDate || today}
                value={form.returnDate}
                onChange={(e) => setForm((p) => ({ ...p, returnDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors cursor-pointer"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 glass border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                id="edit-save-btn"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-3 gold-gradient text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
