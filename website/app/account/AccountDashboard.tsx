'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Car, Calendar, Clock, LogOut, Edit2, Trash2, CheckCircle,
  AlertCircle, Loader2, User, Package, ChevronRight,
} from 'lucide-react';
import { useCustomer } from '@/app/context/AuthContext';
import EditBookingModal from './EditBookingModal';

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

const VEHICLE_LABELS: Record<string, string> = {
  economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
  suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
};

const STATUS_CONFIG = {
  new:      { label: 'Pending',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  read:     { label: 'Confirmed', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  resolved: { label: 'Completed', cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

interface Props {
  customer: { customerId: string; email: string; firstName: string };
}

export default function AccountDashboard({ customer }: Props) {
  const router = useRouter();
  const { logout } = useCustomer();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Edit modal state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Cancel confirmation state
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  const fetchBookings = useCallback(async () => {
    setFetchLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${apiBase}/api/customer/bookings`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data.data || []);
    } catch {
      setFetchError('Failed to load your bookings. Please refresh.');
    } finally {
      setFetchLoading(false);
    }
  }, [apiBase, router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  async function handleCancel(id: string) {
    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await fetch(`${apiBase}/api/customer/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        setCancelError(data.error || 'Failed to cancel booking.');
        return;
      }
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setCancelId(null);
    } catch {
      setCancelError('Network error. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  }

  function daysBetween(pickup: string, returnD: string) {
    return Math.max(
      1,
      Math.round((new Date(returnD).getTime() - new Date(pickup).getTime()) / 86400000)
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-gold">{customer.firstName}</span>!
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {customer.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="flex items-center gap-2 px-4 py-2.5 glass border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Package,
              label: 'Total Bookings',
              value: bookings.length,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              icon: Clock,
              label: 'Pending',
              value: bookings.filter((b) => b.status === 'new').length,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              icon: CheckCircle,
              label: 'Completed',
              value: bookings.filter((b) => b.status === 'resolved').length,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Your Bookings</h2>
            <a
              href="/booking"
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              New Booking <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {fetchLoading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
            </div>
          ) : fetchError ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{fetchError}</p>
              <button
                onClick={fetchBookings}
                className="mt-4 px-4 py-2 text-xs text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center">
              <Car className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium mb-2">No bookings yet</p>
              <p className="text-slate-600 text-sm mb-6">
                Ready for your next ride? Book a car now.
              </p>
              <a
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all"
              >
                <Car className="w-4 h-4" /> Book a Car
              </a>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {bookings.map((booking) => {
                const cfg = STATUS_CONFIG[booking.status];
                const days = daysBetween(booking.pickupDate, booking.returnDate);
                return (
                  <div key={booking._id} className="px-6 py-5 hover:bg-white/2 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Vehicle info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Car className="w-4 h-4 text-amber-400" />
                          </div>
                          <p className="text-white font-semibold">
                            {VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-green-400" />
                            {new Date(booking.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-red-400" />
                            {new Date(booking.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {days} day{days !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {booking.status !== 'resolved' && (
                          <button
                            id={`edit-booking-${booking._id}`}
                            onClick={() => setEditingBooking(booking)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white glass border border-white/10 hover:border-amber-500/30 rounded-xl transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        )}
                        {cancelId === booking._id ? (
                          <div className="flex items-center gap-2">
                            {cancelError && (
                              <span className="text-xs text-red-400">{cancelError}</span>
                            )}
                            <span className="text-xs text-slate-500">Cancel booking?</span>
                            <button
                              id={`confirm-cancel-${booking._id}`}
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancelLoading}
                              className="px-3 py-1.5 text-xs bg-red-500/15 text-red-400 border border-red-500/25 rounded-xl hover:bg-red-500/25 transition-colors disabled:opacity-60"
                            >
                              {cancelLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes, Cancel'}
                            </button>
                            <button
                              onClick={() => { setCancelId(null); setCancelError(''); }}
                              className="px-3 py-1.5 text-xs glass border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                            >
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`cancel-booking-${booking._id}`}
                            onClick={() => { setCancelId(booking._id); setCancelError(''); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400/70 hover:text-red-400 glass border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSaved={(updated) => {
            setBookings((prev) =>
              prev.map((b) => (b._id === updated._id ? updated : b))
            );
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
}
