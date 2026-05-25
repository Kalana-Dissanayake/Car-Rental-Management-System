'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts';

interface TrendPoint  { date: string; bookings: number }
interface DemandPoint { type: string; count: number }
interface StatusPoint { name: string; value: number; color: string }

interface DashboardChartsProps {
  trendData:      TrendPoint[];
  demandByType:   DemandPoint[];
  statusBreakdown: StatusPoint[];
}

// ── Shared tooltip style ──────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  color: '#111827',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  fontSize: '12px',
};

// ── Format date label "May 25" ────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Custom donut label ────────────────────────────────────────────────────────
function DonutLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#f1f5f9">
      <tspan x={cx} dy="-6" fontSize="22" fontWeight="700">{total}</tspan>
      <tspan x={cx} dy="22" fontSize="11" fill="#6b7280">Total</tspan>
    </text>
  );
}

export default function DashboardCharts({
  trendData,
  demandByType,
  statusBreakdown,
}: DashboardChartsProps) {
  const totalInquiries = statusBreakdown.reduce((s, i) => s + i.value, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {/* ── Area Chart — Booking Volume Trends ─────────────────────────── */}
      <div className="xl:col-span-2 glass rounded-2xl p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-900">Booking Volume Trends</h2>
          <p className="text-gray-500 text-xs mt-0.5">Daily bookings received — last 30 days</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="date"
              tickFormatter={fmtDate}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              interval={4}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(d: any) => fmtDate(String(d))}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [v, 'Bookings']}
              cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 2' }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Donut Chart — Inquiry Resolution Funnel ─────────────────────── */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Resolution Funnel</h2>
          <p className="text-gray-500 text-xs mt-0.5">Inquiry status distribution</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={statusBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {statusBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            {/* Center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#111827">
              <tspan x="50%" dy="-6" fontSize="20" fontWeight="700">{totalInquiries}</tspan>
              <tspan x="50%" dy="20" fontSize="10" fill="#6b7280">Total</tspan>
            </text>
            <Tooltip contentStyle={tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [v, 'Inquiries']} />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="space-y-2 mt-2">
          {statusBreakdown.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-gray-500">{s.name}</span>
              </div>
              <span className="text-gray-900 font-semibold">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Horizontal Bar Chart — Demand by Vehicle Type ──────────────── */}
      <div className="xl:col-span-3 glass rounded-2xl p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-900">Demand by Vehicle Type</h2>
          <p className="text-gray-500 text-xs mt-0.5">Total booking requests per vehicle category</p>
        </div>
        <ResponsiveContainer width="100%" height={Math.max(180, demandByType.length * 44)}>
          <BarChart
            data={demandByType}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="type"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [v, 'Bookings']}
              cursor={{ fill: 'rgba(245,158,11,0.05)' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {demandByType.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? '#f59e0b' : i === 1 ? '#fbbf24' : `rgba(245,158,11,${0.55 - i * 0.07})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
