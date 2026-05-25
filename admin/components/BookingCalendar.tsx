'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Car, Calendar as CalIcon } from 'lucide-react';

interface Booking {
  _id: string;
  fullName: string;
  vehicleType: string;
  pickupDate: string;
  returnDate: string;
  status: 'new' | 'read' | 'resolved';
}

const VEHICLE_LABELS: Record<string, string> = {
  economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
  suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
};

const STATUS_DOT: Record<string, string> = {
  new: 'bg-amber-400', read: 'bg-blue-400', resolved: 'bg-green-400',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toYMD(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function BookingCalendar({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState<string | null>(null);

  // Build a map: "YYYY-MM-DD" → bookings that overlap that day
  const dayMap = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      const start = new Date(b.pickupDate);
      const end   = new Date(b.returnDate);
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = toYMD(cursor);
        if (!map[key]) map[key] = [];
        map[key].push(b);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [bookings]);

  // Calendar grid
  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const selectedBookings = selected ? (dayMap[selected] || []) : [];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
        <p className="text-gray-400 text-sm mt-1">View which dates have active rental bookings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Calendar grid ──────────────────────────────────────────────── */}
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-gray-900 font-semibold text-lg">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayBookings = dayMap[key] || [];
              const isToday = key === toYMD(today);
              const isSelected = key === selected;
              const hasBookings = dayBookings.length > 0;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm
                    transition-all hover:bg-gray-50 ${
                    isSelected
                      ? 'bg-amber-50 border border-amber-200 text-amber-700'
                      : isToday
                        ? 'bg-amber-50/50 border border-amber-100 text-amber-600'
                        : hasBookings
                          ? 'bg-blue-50 border border-blue-100 text-blue-700'
                          : 'text-gray-600'
                  }`}
                >
                  <span className={`font-medium ${isSelected || isToday ? '' : hasBookings ? 'text-blue-900' : ''}`}>
                    {day}
                  </span>
                  {hasBookings && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-[8px] text-gray-500">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
            {[
              { dot: 'bg-amber-400', label: 'New' },
              { dot: 'bg-blue-400',  label: 'Read' },
              { dot: 'bg-green-400', label: 'Resolved' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                {l.label}
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/30 border border-amber-400/50" />
              Today
            </div>
          </div>
        </div>

        {/* ── Day detail panel ───────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-5">
          {selected ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CalIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-gray-900 font-semibold text-sm">
                  {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })}
                </h3>
              </div>
              {selectedBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings on this date.</p>
              ) : (
                <div className="space-y-3">
                  {selectedBookings.map((b) => (
                    <div key={b._id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 text-sm font-medium">{b.fullName}</p>
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[b.status]}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Car className="w-3 h-3 text-amber-500" />
                          {VEHICLE_LABELS[b.vehicleType] || b.vehicleType}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalIcon className="w-3 h-3 text-green-500" />
                          {new Date(b.pickupDate + 'T00:00:00').toLocaleDateString()} → {new Date(b.returnDate + 'T00:00:00').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <CalIcon className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Select a date</p>
              <p className="text-gray-400 text-xs mt-1">Click any highlighted date to see bookings</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
