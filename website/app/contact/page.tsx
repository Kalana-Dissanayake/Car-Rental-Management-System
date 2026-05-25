import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with DriveEase. We\'re available 24/7 to help with bookings, questions, or concerns.',
};

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['123 Fleet Street', 'Business District, City 10001'],
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+1 (555) 123-4567', '+1 (555) 765-4321'],
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@driveease.com', 'support@driveease.com'],
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Clock,
    title: 'Hours',
    lines: ['Mon–Fri: 7am – 10pm', 'Sat–Sun: 8am – 8pm'],
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Page Header ──────────────────────────────────── */}
      <section className="relative min-h-[52vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/Contact-Background.jpg"
          alt="Contact DriveEase background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_60%,rgba(245,158,11,0.12),transparent)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-lg">
            Contact DriveEase
          </h1>
          <p className="text-slate-300 max-w-lg mx-auto text-lg leading-relaxed">
            Have a question or need assistance? Our team is available around the clock{' '}
            to help you with anything you need.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ─────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info) => (
              <div key={info.title} className="glass rounded-2xl p-6 text-center card-hover">
                <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-slate-500 text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Map + Quick Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Map embed */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl overflow-hidden h-96">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.02%2C40.70%2C-73.96%2C40.74&layer=mapnik"
                  width="100%"
                  height="100%"
                  title="DriveEase Location Map"
                  className="border-0 grayscale opacity-80"
                  loading="lazy"
                />
              </div>
              <p className="text-slate-600 text-xs mt-2 text-center">
                123 Fleet Street, Business District (approximate location)
              </p>
            </div>

            {/* Quick info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Quick Response Promise</h3>
                <ul className="space-y-3">
                  {[
                    { emoji: '📞', text: 'Phone calls answered within 2 minutes' },
                    { emoji: '📧', text: 'Emails replied to within 1 hour' },
                    { emoji: '💬', text: 'Live chat available 24/7' },
                    { emoji: '🚗', text: 'Booking confirmations in under 2 hours' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <span>{item.emoji}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6 border border-amber-500/10">
                <h3 className="font-semibold text-white mb-2">
                  Ready to Book?
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  Skip the call — book instantly using our online form.
                </p>
                <a
                  href="/booking"
                  id="contact-page-book-btn"
                  className="block w-full text-center py-3 gold-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  Book a Vehicle →
                </a>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">Emergency Support</h3>
                <p className="text-slate-500 text-sm mb-3">
                  Already a customer with an urgent issue?
                </p>
                <p className="text-amber-400 font-bold">🆘 +1 (555) 911-DRIVE</p>
                <p className="text-slate-600 text-xs mt-1">24/7 Emergency Hotline</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom padding */}
      <div className="py-8" />
    </>
  );
}
