import type { Metadata } from 'next';
import { Suspense } from 'react';
import BookingForm from '@/components/BookingForm';
import { Shield, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a Car',
  description:
    'Book your perfect rental vehicle with DriveEase. Quick, easy, and secure. Choose your dates, vehicle type, and we\'ll take care of the rest.',
};

export default function BookingPage() {
  return (
    <>
      {/* ── Page Header ──────────────────────────────────── */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.07),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            Reservations
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">Book Your Vehicle</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Fill in your details and we&apos;ll confirm your reservation within 2 hours. 
            No payment required upfront.
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────── */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-2">
              <Suspense fallback={
                <div className="glass rounded-3xl p-10 text-center">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              }>
                <BookingForm />
              </Suspense>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Why Book With Us?</h3>
                <ul className="space-y-3">
                  {[
                    { icon: CheckCircle, text: 'No upfront payment required', color: 'text-green-400' },
                    { icon: Clock, text: 'Confirmation within 2 hours', color: 'text-blue-400' },
                    { icon: Shield, text: 'All vehicles fully insured', color: 'text-amber-400' },
                    { icon: CheckCircle, text: 'Free cancellation (24h notice)', color: 'text-green-400' },
                    { icon: CheckCircle, text: 'No hidden fees', color: 'text-green-400' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">Need Help?</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Our team is available 24/7 to assist with your booking.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-amber-400 font-medium">📞 +1 (555) 123-4567</p>
                  <p className="text-sm text-slate-500">info@driveease.com</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-amber-500/10">
                <p className="text-amber-400 text-xs uppercase tracking-wider font-medium mb-2">
                  🔒 Secure Submission
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Your data is protected. We use industry-standard encryption and never 
                  share your information with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
