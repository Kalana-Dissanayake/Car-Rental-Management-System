'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye, Calendar, Phone, Mail, Car } from 'lucide-react';
import Link from 'next/link';

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

interface BookingTableProps {
  messages: Message[];
}

const vehicleLabels: Record<string, string> = {
  economy: 'Economy',
  compact: 'Compact',
  midsize: 'Mid-Size',
  suv: 'SUV',
  luxury: 'Luxury',
  van: 'Van',
  truck: 'Truck',
  sports: 'Sports',
};

const statusColors: Record<string, string> = {
  new: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  read: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  resolved: 'bg-green-500/15 text-green-400 border-green-500/25',
};

export default function BookingTable({ messages: initialMessages }: BookingTableProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete record');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (messages.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <Car className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">No booking requests yet</p>
        <p className="text-gray-600 text-sm mt-1">
          New submissions from the website will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
        <h2 className="font-semibold text-white">Booking Requests</h2>
        <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full">
          {messages.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 text-left font-medium">Customer</th>
              <th className="px-6 py-3 text-left font-medium">Contact</th>
              <th className="px-6 py-3 text-left font-medium">Vehicle</th>
              <th className="px-6 py-3 text-left font-medium">Dates</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Submitted</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {messages.map((msg) => (
              <tr
                key={msg._id}
                className="hover:bg-gray-800/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{msg.fullName}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{msg.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{msg.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-gray-300">
                      {vehicleLabels[msg.vehicleType] || msg.vehicleType}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 text-green-400" />
                      <span>Pick: {new Date(msg.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 text-red-400" />
                      <span>Return: {new Date(msg.returnDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[msg.status]}`}
                  >
                    {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Confirm delete dialog */}
                    {confirmId === msg._id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Confirm?</span>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          disabled={deletingId === msg._id}
                          className="px-2.5 py-1 text-xs bg-red-500/15 text-red-400 border border-red-500/25 rounded-lg hover:bg-red-500/25 transition-colors disabled:opacity-50"
                          id={`confirm-delete-${msg._id}`}
                        >
                          {deletingId === msg._id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2.5 py-1 text-xs bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(msg._id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete record"
                        id={`delete-btn-${msg._id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
