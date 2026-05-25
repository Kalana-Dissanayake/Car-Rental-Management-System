import type { Metadata } from 'next';
import Image from 'next/image';
import { Shield, Users, Award, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about DriveEase — our story, mission, and the values that drive us to deliver the best car rental experience.',
};

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'Every vehicle undergoes rigorous safety checks before and after every rental.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Users,
    title: 'Customer Centric',
    desc: 'Our customers are at the heart of every decision we make.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'We maintain the highest standards in our fleet, service, and support.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Heart,
    title: 'Passion',
    desc: 'We genuinely love cars and are passionate about sharing that experience.',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
];

const team = [
  { name: 'Michael Chen', role: 'CEO & Founder', initial: 'M' },
  { name: 'Sarah Williams', role: 'Head of Operations', initial: 'S' },
  { name: 'David Park', role: 'Fleet Manager', initial: 'D' },
  { name: 'Emma Rodriguez', role: 'Customer Experience Lead', initial: 'E' },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Page Header ──────────────────────────────────── */}
      <section className="relative min-h-[52vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/About-Background.jpg"
          alt="About DriveEase background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layered dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />
        {/* Amber accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_60%,rgba(245,158,11,0.12),transparent)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-lg">
            About DriveEase
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Founded in 2018, DriveEase was born from a simple idea: car rental should be{' '}
            simple, transparent, and enjoyable. Today we serve thousands of happy customers.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Redefining the Way <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  People Rent Cars
                </span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                We believe that every journey matters. Whether it&apos;s a quick business trip or a 
                cross-country adventure, you deserve a reliable, comfortable vehicle and 
                a rental experience that&apos;s completely stress-free.
              </p>
              <p className="text-slate-400 leading-relaxed">
                That&apos;s why we&apos;ve invested in a diverse, well-maintained fleet and a team of 
                dedicated professionals who genuinely care about getting you where you need to go.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '2018', label: 'Founded' },
                { val: '200+', label: 'Vehicles' },
                { val: '15K+', label: 'Customers' },
                { val: '50+', label: 'Locations' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">{s.val}</p>
                  <p className="text-slate-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────── */}
      <section className="py-20 bg-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              What Drives Us
            </p>
            <h2 className="text-4xl font-bold text-white">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-2xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              The People Behind DriveEase
            </p>
            <h2 className="text-4xl font-bold text-white">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass rounded-2xl p-6 text-center card-hover">
                <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-amber-500/20">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-amber-400 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
