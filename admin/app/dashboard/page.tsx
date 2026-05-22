import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import BookingTable from '@/components/BookingTable';
import { MessageSquare, TrendingUp, CheckCircle, Clock } from 'lucide-react';

async function getStats() {
  await connectDB();
  const [total, newCount, resolved] = await Promise.all([
    ContactMessage.countDocuments({}),
    ContactMessage.countDocuments({ status: 'new' }),
    ContactMessage.countDocuments({ status: 'resolved' }),
  ]);
  return { total, newCount, resolved, read: total - newCount - resolved };
}

async function getMessages() {
  await connectDB();
  const messages = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return JSON.parse(JSON.stringify(messages));
}

export default async function DashboardPage() {
  const [stats, messages] = await Promise.all([getStats(), getMessages()]);

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.total,
      icon: MessageSquare,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'New Requests',
      value: stats.newCount,
      icon: TrendingUp,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Read',
      value: stats.read,
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage all booking requests and contact messages
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Booking Table */}
      <BookingTable messages={messages} />
    </div>
  );
}
