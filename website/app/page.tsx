import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield, Clock, MapPin, Star, ChevronRight, Car, Zap, Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'DriveEase | Premium Car Rental — Drive With Confidence',
  description:
    'Experience premium car rental with DriveEase. Choose from 200+ vehicles, transparent pricing, and 24/7 support. Book your perfect ride today.',
};

const features = [
  {
    icon: Shield,
    title: 'Fully Insured',
    desc: 'All vehicles come with comprehensive insurance coverage for total peace of mind.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    desc: 'Our dedicated team is available around the clock to assist with any needs.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: MapPin,
    title: 'Flexible Pickup',
    desc: 'Choose from multiple locations or request a doorstep delivery at your convenience.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Zap,
    title: 'Fast Booking',
    desc: 'Our streamlined process gets you behind the wheel in minutes, not hours.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

const stats = [
  { value: '200+', label: 'Vehicles Available' },
  { value: '15K+', label: 'Happy Customers' },
  { value: '50+', label: 'Pickup Locations' },
  { value: '4.9★', label: 'Average Rating' },
];

const fleet = [
  {
    name: 'Economy',
    price: '$29',
    desc: 'Perfect for city commutes',
    image: '/images/Toyota Yaris.jpg',
    vehicle: 'economy',
  },
  {
    name: 'SUV',
    price: '$79',
    desc: 'Ideal for family adventures',
    image: '/images/Ford Explorer.jpg',
    vehicle: 'suv',
  },
  {
    name: 'Luxury',
    price: '$149',
    desc: 'Ultimate driving experience',
    image: '/images/BMW 5 Series.jpg',
    vehicle: 'luxury',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: 'Absolutely seamless experience from booking to return. The car was spotless and the service was outstanding.',
  },
  {
    name: 'James T.',
    rating: 5,
    text: "Best car rental service I've ever used. Transparent pricing, no hidden fees, and a gorgeous vehicle.",
  },
  {
    name: 'Emily R.',
    rating: 5,
    text: 'DriveEase made our family road trip unforgettable. The SUV was perfect and their team was incredibly helpful.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background photo */}
        <Image
          src="/images/background.jpg"
          alt="Premium rental car on the road"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

        {/* Layered dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Amber glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_30%_50%,rgba(245,158,11,0.06),rgba(255,255,255,0))]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-500/20 text-amber-400 text-sm font-medium mb-8 animate-fade-up">
              <Award className="w-4 h-4" />
              #1 Rated Car Rental Service
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-up-delay-1">
              Drive Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Dream Car
              </span>
              Today
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl animate-fade-up-delay-2">
              Choose from 200+ premium vehicles. Transparent pricing, no hidden fees,{' '}
              and 24/7 support — because every journey deserves excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
              <Link
                href="/booking"
                id="hero-book-now-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 gold-gradient text-white font-semibold rounded-2xl shadow-xl shadow-amber-500/25 hover:opacity-90 active:scale-[0.98] transition-all text-lg"
              >
                Book Now
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/vehicles"
                id="hero-view-fleet-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 glass border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-lg"
              >
                <Car className="w-5 h-5" />
                View Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-1">
                  {stat.value}
                </p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              Why DriveEase
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              The Smarter Way to Rent
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              We&apos;ve reimagined car rental from the ground up, putting your experience and safety first.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Fleet ────────────────────────────────── */}
      <section className="py-24 bg-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              Our Fleet
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Popular Categories</h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              From budget-friendly options to premium luxury rides — we have something for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {fleet.map((car) => (
              <div key={car.name} className="glass rounded-2xl overflow-hidden card-hover group">
                {/* Car image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={`${car.name} category vehicle`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 glass text-xs text-amber-400 border border-amber-500/20 rounded-full font-medium">
                      {car.name}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 text-center">
                  <p className="text-slate-400 text-sm mb-3">{car.desc}</p>
                  <p className="text-amber-400 font-bold text-xl mb-5">
                    From {car.price}<span className="text-slate-500 font-normal text-sm">/day</span>
                  </p>
                  <Link
                    href={`/booking?vehicle=${car.vehicle}`}
                    className="inline-block w-full py-3 glass border border-amber-500/20 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/10 transition-colors"
                  >
                    Book This Category
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all"
            >
              View Full Fleet
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-white font-medium text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#080811]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 border border-amber-500/10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Hit the Road?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Join thousands of satisfied customers who trust DriveEase for every trip.
              Book your vehicle in just minutes.
            </p>
            <Link
              href="/booking"
              id="cta-book-btn"
              className="inline-flex items-center gap-2 px-10 py-4 gold-gradient text-white font-semibold rounded-2xl shadow-xl shadow-amber-500/25 hover:opacity-90 active:scale-[0.98] transition-all text-lg"
            >
              Make a Booking
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
