import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import DashboardCharts from '@/components/DashboardCharts';
import {
  MessageSquare, AlertCircle, Clock, TrendingUp,
  Car, Mail, Calendar, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ── Server-side data fetching ─────────────────────────────────────────────────

async function getDashboardData() {
  await connectDB();

  const [total, newCount, readCount, resolved] = await Promise.all([
    ContactMessage.countDocuments({}),
    ContactMessage.countDocuments({ status: 'new' }),
    ContactMessage.countDocuments({ status: 'read' }),
    ContactMessage.countDocuments({ status: 'resolved' }),
  ]);

  const allBookings = await ContactMessage.find(
    {},
    { pickupDate: 1, returnDate: 1, vehicleType: 1, createdAt: 1 }
  ).lean();

  let totalDays = 0;
  let validCount = 0;
  const vehicleTypeMap: Record<string, number> = {};
  const dateCountMap: Record<string, number> = {};

  for (const b of allBookings) {
    const pickup  = new Date(b.pickupDate);
    const returnD = new Date(b.returnDate);
    const diff = (returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);
    if (!isNaN(diff) && diff > 0) { totalDays += diff; validCount++; }
    const vt = b.vehicleType || 'unknown';
    vehicleTypeMap[vt] = (vehicleTypeMap[vt] || 0) + 1;
    const dateKey = new Date(b.createdAt).toISOString().split('T')[0];
    dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
  }

  const avgDuration = validCount > 0 ? Math.round((totalDays / validCount) * 10) / 10 : 0;

  const vehicleLabels: Record<string, string> = {
    economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
    suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
  };

  const topCategoryRaw = Object.entries(vehicleTypeMap).sort(([, a], [, b]) => b - a)[0]?.[0] || '—';
  const topCategory = vehicleLabels[topCategoryRaw] || topCategoryRaw;

  const demandByType = Object.entries(vehicleTypeMap)
    .map(([key, count]) => ({ type: vehicleLabels[key] || key, count }))
    .sort((a, b) => b.count - a.count);

  const today = new Date();
  const trendData: { date: string; bookings: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    trendData.push({ date: key, bookings: dateCountMap[key] || 0 });
  }

  const statusBreakdown = [
    { name: 'New',      value: newCount,  color: '#f59e0b' },
    { name: 'Read',     value: readCount, color: '#3b82f6' },
    { name: 'Resolved', value: resolved,  color: '#22c55e' },
  ];

  // Recent bookings (last 8)
  const recentBookings = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return {
    total, newCount, avgDuration, topCategory,
    demandByType, trendData, statusBreakdown,
    recentBookings: JSON.parse(JSON.stringify(recentBookings)),
    vehicleLabels,
  };
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, accent, border }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string; border: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 border-t-2 ${border} relative overflow-hidden`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 leading-none mb-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_CONFIG = {
  new:      { label: 'New',      cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  read:     { label: 'Read',     cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  resolved: { label: 'Resolved', cls: 'bg-green-50 text-green-600 border-green-200' },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const data = await getDashboardData();

  const kpis = [
    {
      label: 'Total Booking Requests',
      value: data.total,
      sub: 'All submissions to date',
      icon: MessageSquare,
      accent: 'bg-blue-500/15 text-blue-400',
      border: 'border-blue-500/40',
    },
    {
      label: 'Actionable Inquiries',
      value: data.newCount,
      sub: data.newCount === 0 ? 'All caught up!' : `${data.newCount} awaiting response`,
      icon: AlertCircle,
      accent: 'bg-amber-500/15 text-amber-400',
      border: data.newCount > 0 ? 'border-amber-500/60' : 'border-amber-500/20',
    },
    {
      label: 'Avg. Rental Duration',
      value: `${data.avgDuration} days`,
      sub: 'Average across all bookings',
      icon: Clock,
      accent: 'bg-purple-500/15 text-purple-400',
      border: 'border-purple-500/40',
    },
    {
      label: 'Top Performing Category',
      value: data.topCategory,
      sub: 'Most requested vehicle type',
      icon: TrendingUp,
      accent: 'bg-green-500/15 text-green-400',
      border: 'border-green-500/40',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {data.newCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-700 text-xs font-medium">{data.newCount} new requests</span>
          </div>
        )}
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <DashboardCharts
        trendData={data.trendData}
        demandByType={data.demandByType}
        statusBreakdown={data.statusBreakdown}
      />

      {/* ── Recent Bookings ──────────────────────────────────────────────── */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-500 text-xs mt-0.5">Latest 8 submissions</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.recentBookings.length === 0 ? (
          <div className="py-12 text-center">
            <Car className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Vehicle</th>
                  <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Pickup</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium hidden lg:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentBookings.map((b: {
                  _id: string; fullName: string; email: string;
                  vehicleType: string; pickupDate: string; status: 'new' | 'read' | 'resolved'; createdAt: string;
                }) => {
                  const cfg = STATUS_CONFIG[b.status];
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-gray-900 font-medium text-sm">{b.fullName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">{b.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-gray-700 text-sm">
                            {data.vehicleLabels[b.vehicleType] || b.vehicleType}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 text-green-500" />
                          {new Date(b.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">
                          {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
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
