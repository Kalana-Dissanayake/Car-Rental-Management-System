import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withAuth, JWTPayload } from '@/lib/auth';

async function statsHandler(_req: NextRequest, _user: JWTPayload) {
  try {
    await connectDB();

    // ── Basic counts ──────────────────────────────────────────────────────
    const [total, newCount, readCount, resolved] = await Promise.all([
      ContactMessage.countDocuments({}),
      ContactMessage.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments({ status: 'read' }),
      ContactMessage.countDocuments({ status: 'resolved' }),
    ]);

    // ── Average rental duration ───────────────────────────────────────────
    // pickupDate and returnDate are stored as strings "YYYY-MM-DD"
    const allBookings = await ContactMessage.find(
      {},
      { pickupDate: 1, returnDate: 1, vehicleType: 1, createdAt: 1 }
    ).lean();

    let totalDays = 0;
    let validCount = 0;
    const vehicleTypeMap: Record<string, number> = {};
    const dateCountMap: Record<string, number> = {};

    for (const b of allBookings) {
      // Duration
      const pickup  = new Date(b.pickupDate);
      const returnD = new Date(b.returnDate);
      const diff = (returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);
      if (!isNaN(diff) && diff > 0) {
        totalDays += diff;
        validCount++;
      }

      // Vehicle type tally
      const vt = b.vehicleType || 'unknown';
      vehicleTypeMap[vt] = (vehicleTypeMap[vt] || 0) + 1;

      // Daily trend (last 60 days)
      const dateKey = new Date(b.createdAt).toISOString().split('T')[0];
      dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
    }

    const avgDuration = validCount > 0 ? Math.round((totalDays / validCount) * 10) / 10 : 0;

    // ── Top category (mode of vehicleType) ────────────────────────────────
    const topCategory = Object.entries(vehicleTypeMap).sort(([, a], [, b]) => b - a)[0]?.[0] || '—';

    // ── Demand by vehicle type ─────────────────────────────────────────────
    const vehicleLabels: Record<string, string> = {
      economy: 'Economy', compact: 'Compact', midsize: 'Mid-Size',
      suv: 'SUV', luxury: 'Luxury', van: 'Van', truck: 'Truck', sports: 'Sports',
    };
    const demandByType = Object.entries(vehicleTypeMap)
      .map(([key, count]) => ({ type: vehicleLabels[key] || key, count }))
      .sort((a, b) => b.count - a.count);

    // ── Trend: last 30 days ────────────────────────────────────────────────
    const today = new Date();
    const trendData: { date: string; bookings: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      trendData.push({ date: key, bookings: dateCountMap[key] || 0 });
    }

    return NextResponse.json({
      success: true,
      data: {
        total,
        newCount,
        readCount,
        resolved,
        avgDuration,
        topCategory,
        demandByType,
        trendData,
        statusBreakdown: [
          { name: 'New',      value: newCount,  color: '#f59e0b' },
          { name: 'Read',     value: readCount, color: '#3b82f6' },
          { name: 'Resolved', value: resolved,  color: '#22c55e' },
        ],
      },
    });
  } catch (error) {
    console.error('[STATS ERROR]', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}

export const GET = withAuth(statsHandler);
