'use client';

import { useState, useMemo } from 'react';
import { Download, Filter, FileText, CheckCircle, X, Car, Search } from 'lucide-react';

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
  new:      { label: 'New',      cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  read:     { label: 'Read',     cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  resolved: { label: 'Resolved', cls: 'bg-green-50 text-green-600 border-green-200' },
};

function escapeCSV(value: string) {
  const str = String(value ?? '').replace(/"/g, '""');
  return /[",\n\r]/.test(str) ? `"${str}"` : str;
}

export default function ExportsClient({ bookings }: { bookings: Booking[] }) {
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [search, setSearch] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filterStatus  !== 'all' && b.status      !== filterStatus)  return false;
      if (filterVehicle !== 'all' && b.vehicleType !== filterVehicle) return false;
      if (filterDateFrom && b.createdAt < filterDateFrom) return false;
      if (filterDateTo   && b.createdAt.slice(0, 10) > filterDateTo)  return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.fullName.toLowerCase().includes(q) && !b.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [bookings, filterStatus, filterVehicle, filterDateFrom, filterDateTo, search]);

  function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Vehicle', 'Pickup Date', 'Return Date', 'Duration (days)', 'Status', 'Message', 'Submitted At'];
    const rows = filtered.map((b) => {
      const days = Math.round(
        (new Date(b.returnDate).getTime() - new Date(b.pickupDate).getTime()) / 86400000
      );
      return [
        b.fullName, b.email, b.phone,
        VEHICLE_LABELS[b.vehicleType] || b.vehicleType,
        b.pickupDate, b.returnDate, days,
        b.status, b.message || '',
        new Date(b.createdAt).toISOString(),
      ].map(String).map(escapeCSV).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `driveease-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  function clearFilters() {
    setFilterStatus('all'); setFilterVehicle('all');
    setFilterDateFrom(''); setFilterDateTo(''); setSearch('');
  }

  const hasFilters = filterStatus !== 'all' || filterVehicle !== 'all'
    || filterDateFrom || filterDateTo || search;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
          <p className="text-gray-400 text-sm mt-1">Filter bookings and download as a CSV file</p>
        </div>
        <button
          onClick={exportCSV}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            downloaded
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'brand-gradient text-white hover:opacity-90 shadow-amber-500/20'
          }`}
          id="export-csv-btn"
        >
          {downloaded ? <><CheckCircle className="w-4 h-4" /> Downloaded!</> : <><Download className="w-4 h-4" /> Export CSV</>}
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total records',  value: bookings.length },
          { label: 'Filtered rows',  value: filtered.length },
          { label: 'New inquiries',  value: bookings.filter((b) => b.status === 'new').length },
          { label: 'Resolved',       value: bookings.filter((b) => b.status === 'resolved').length },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl
                text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900
              focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
          {/* Vehicle */}
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900
              focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Vehicles</option>
            {Object.entries(VEHICLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {/* Date from */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            placeholder="From date"
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900
              focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
          />
          {/* Date to */}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            placeholder="To date"
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900
              focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Preview table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">Preview — {filtered.length} rows</span>
          </div>
          <span className="text-xs text-gray-600">Showing up to 50 rows</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <Car className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No records match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Vehicle</th>
                  <th className="px-5 py-3 text-left">Pickup</th>
                  <th className="px-5 py-3 text-left">Return</th>
                  <th className="px-5 py-3 text-left">Days</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.slice(0, 50).map((b) => {
                  const days = Math.round(
                    (new Date(b.returnDate).getTime() - new Date(b.pickupDate).getTime()) / 86400000
                  );
                  const cfg = STATUS_CONFIG[b.status];
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-900 font-medium">{b.fullName}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{b.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-gray-700">{VEHICLE_LABELS[b.vehicleType] || b.vehicleType}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{b.pickupDate}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{b.returnDate}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{days}d</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
