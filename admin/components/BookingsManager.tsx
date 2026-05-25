'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2, CheckCircle, Eye, Search, Filter,
  Mail, Phone, Car, Calendar, ChevronDown, X, Loader2,
} from 'lucide-react';

interface Message {
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

const vehicleLabels: Record<string, string> = {
  economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
  suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
};

const STATUS_CONFIG = {
  new:      { label: 'New',      cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  read:     { label: 'Read',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  resolved: { label: 'Resolved', cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

export default function BookingsManager({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages]   = useState(initialMessages);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch = !q || m.fullName.toLowerCase().includes(q)
        || m.email.toLowerCase().includes(q) || m.vehicleType.includes(q);
      return matchStatus && matchSearch;
    });
  }, [messages, search, filterStatus]);

  // ── Status update (Accept = read, Resolve) ───────────────────────────────
  async function updateStatus(id: string, status: 'read' | 'resolved') {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status } : m));
        router.refresh();
      }
    } finally { setLoadingId(null); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        router.refresh();
      }
    } finally {
      setLoadingId(null);
      setConfirmDelete(null);
    }
  }

  const counts = {
    all:      messages.length,
    new:      messages.filter((m) => m.status === 'new').length,
    read:     messages.filter((m) => m.status === 'read').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all customer booking requests</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, email, vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-900/60 border border-gray-700/60 rounded-xl
              text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        {/* Status tabs */}
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {(['all', 'new', 'read', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filterStatus === s
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s} <span className="ml-1 text-gray-600">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800/50 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
              <X className="w-3 h-3" /> Clear search
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Car className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No bookings match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Contact</th>
                  <th className="px-5 py-3 text-left">Vehicle</th>
                  <th className="px-5 py-3 text-left">Dates</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Submitted</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {filtered.map((msg) => {
                  const cfg = STATUS_CONFIG[msg.status];
                  const isLoading = loadingId === msg._id;
                  const days = Math.round(
                    (new Date(msg.returnDate).getTime() - new Date(msg.pickupDate).getTime())
                    / 86400000
                  );
                  return (
                    <>
                      <tr key={msg._id} className="hover:bg-gray-800/25 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">{msg.fullName}</p>
                          <p className="text-gray-600 text-xs mt-0.5">{days} day rental</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Mail className="w-3 h-3" />{msg.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Phone className="w-3 h-3" />{msg.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-gray-300">{vehicleLabels[msg.vehicleType] || msg.vehicleType}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 text-green-400" />
                              {new Date(msg.pickupDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 text-red-400" />
                              {new Date(msg.returnDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                            ) : (
                              <>
                                {/* Expand for message */}
                                {msg.message && (
                                  <button
                                    onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                                    className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                    title="View message"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                {/* Accept */}
                                {msg.status === 'new' && (
                                  <button
                                    onClick={() => updateStatus(msg._id, 'read')}
                                    className="p-1.5 text-gray-600 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                                    title="Mark as read (Accept)"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                {/* Resolve */}
                                {msg.status !== 'resolved' && (
                                  <button
                                    onClick={() => updateStatus(msg._id, 'resolved')}
                                    className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                                    title="Mark as resolved"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {/* Delete */}
                                {confirmDelete === msg._id ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Sure?</span>
                                    <button
                                      onClick={() => handleDelete(msg._id)}
                                      className="px-2 py-1 text-xs bg-red-500/15 text-red-400 border border-red-500/25 rounded-lg hover:bg-red-500/25 transition-colors"
                                    >Yes</button>
                                    <button
                                      onClick={() => setConfirmDelete(null)}
                                      className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-lg"
                                    >No</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDelete(msg._id)}
                                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Expanded message row */}
                      {expandedId === msg._id && msg.message && (
                        <tr key={`${msg._id}-exp`} className="bg-gray-900/40">
                          <td colSpan={7} className="px-5 py-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Message</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{msg.message}</p>
                          </td>
                        </tr>
                      )}
                    </>
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
