import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import DashboardCharts from '@/components/DashboardCharts';
import {
  MessageSquare, AlertCircle, Clock, TrendingUp,
  BookOpen, CalendarDays, Download,
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

  return { total, newCount, avgDuration, topCategory, demandByType, trendData, statusBreakdown };
}

// ── KPI card helper ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, accent, border,
}: {
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
      <p className="text-3xl font-bold text-white leading-none mb-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Quick-action link card ────────────────────────────────────────────────────

function QuickLink({ href, icon: Icon, label, desc, color }: {
  href: string; icon: React.ElementType; label: string; desc: string; color: string;
}) {
  return (
    <Link
      href={href}
      className="glass rounded-xl p-4 flex items-center gap-4 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold group-hover:text-amber-400 transition-colors">{label}</p>
        <p className="text-gray-500 text-xs">{desc}</p>
      </div>
    </Link>
  );
}

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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {data.newCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-medium">{data.newCount} new requests</span>
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

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickLink
            href="/dashboard/bookings"
            icon={BookOpen}
            label="Manage Bookings"
            desc="Accept, resolve, or delete requests"
            color="bg-amber-500/15 text-amber-400"
          />
          <QuickLink
            href="/dashboard/calendar"
            icon={CalendarDays}
            label="Booking Calendar"
            desc="View bookings by date"
            color="bg-blue-500/15 text-blue-400"
          />
          <QuickLink
            href="/dashboard/exports"
            icon={Download}
            label="Export Data"
            desc="Download booking records as CSV"
            color="bg-green-500/15 text-green-400"
          />
        </div>
      </div>

    </div>
  );
}
