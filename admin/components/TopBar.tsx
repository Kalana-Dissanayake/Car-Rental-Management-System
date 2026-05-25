'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, X, Car, AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface Notification {
  _id: string;
  fullName: string;
  vehicleType: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

const VEHICLE_LABELS: Record<string, string> = {
  economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
  suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hrs   = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
}

interface TopBarProps { userEmail: string; }

export default function TopBar({ userEmail }: TopBarProps) {
  const router = useRouter();
  const [search, setSearch]             = useState('');
  const [searchFocus, setSearchFocus]   = useState(false);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread]             = useState(0);
  const notifsRef = useRef<HTMLDivElement>(null);

  // ── Fetch notifications (new bookings) on mount ──────────────────────────
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('/api/messages?limit=20', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        const msgs: Notification[] = json.data || [];
        setNotifications(msgs);
        setUnread(msgs.filter((m) => m.status === 'new').length);
      } catch { /* silent */ }
    }
    fetchNotifs();
    // Poll every 60 s
    const id = setInterval(fetchNotifs, 60000);
    return () => clearInterval(id);
  }, []);

  // ── Close notification panel on outside click ─────────────────────────────
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/dashboard/bookings?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  }

  function markAllRead() {
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' as const })));
  }

  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <header className="h-16 flex-shrink-0 flex items-center gap-4 px-6 bg-white border-b border-gray-200 z-40">

      {/* ── Date (left) ─────────────────────────────────────────────────── */}
      <p className="text-gray-500 text-xs font-medium hidden sm:block flex-shrink-0">{currentTime}</p>

      {/* ── Global Search ────────────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className={`relative transition-all ${searchFocus ? 'scale-[1.01]' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="topbar-search"
            type="text"
            placeholder="Search bookings by name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
              text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500/50
              focus:ring-1 focus:ring-amber-500/10 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* ── Right side: Notifications + secure badge ──────────────────────── */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Notifications bell */}
        <div className="relative" ref={notifsRef}>
          <button
            id="notifications-btn"
            onClick={() => setShowNotifs((p) => !p)}
            className={`relative p-2 rounded-xl transition-all ${
              showNotifs
                ? 'bg-amber-50 text-amber-600'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full
                text-[10px] font-bold text-white flex items-center justify-center leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl
              border border-gray-200 overflow-hidden z-50">

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  {unread > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-medium">
                      {unread} new
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                        n.status === 'new' ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {/* Status icon */}
                      <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        n.status === 'new'
                          ? 'bg-amber-500/15'
                          : n.status === 'resolved'
                            ? 'bg-green-500/15'
                            : 'bg-blue-500/15'
                      }`}>
                        {n.status === 'new'
                          ? <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          : n.status === 'resolved'
                            ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            : <Eye className="w-3.5 h-3.5 text-blue-400" />
                        }
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-xs font-medium truncate">
                          {n.status === 'new' ? '🔔 New booking: ' : ''}{n.fullName}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {VEHICLE_LABELS[n.vehicleType] || n.vehicleType} · {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {n.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100">
                <a
                  href="/dashboard/bookings"
                  className="text-xs text-amber-600 hover:text-amber-700 transition-colors font-medium flex items-center gap-1"
                >
                  <Car className="w-3 h-3" /> View all bookings →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Secure session badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-50 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-green-700 text-xs font-medium">Secure</span>
        </div>
      </div>
    </header>
  );
}
