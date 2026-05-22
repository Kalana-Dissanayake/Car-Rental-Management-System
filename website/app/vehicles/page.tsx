import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Fuel, Gauge, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Fleet',
  description:
    'Browse the DriveEase fleet — economy, compact, mid-size, SUVs, luxury vehicles, vans, and trucks. Find your perfect rental car.',
};

const vehicles = [
  {
    category: 'Economy',
    name: 'Toyota Yaris',
    price: 29,
    emoji: '🚗',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.7,
    tags: ['economy', 'City Friendly', 'Fuel Efficient'],
    desc: 'Perfect for city driving and short trips. Great fuel economy and easy to park.',
  },
  {
    category: 'Compact',
    name: 'Honda Civic',
    price: 39,
    emoji: '🚘',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.8,
    tags: ['compact', 'Popular', 'Reliable'],
    desc: 'The most popular choice. Comfortable, reliable, and great for both city and highway.',
  },
  {
    category: 'Mid-Size',
    name: 'Toyota Camry',
    price: 55,
    emoji: '🚙',
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Auto',
    rating: 4.8,
    tags: ['midsize', 'Hybrid', 'Spacious'],
    desc: 'A spacious, comfortable sedan with hybrid efficiency for longer journeys.',
  },
  {
    category: 'SUV',
    name: 'Ford Explorer',
    price: 79,
    emoji: '🛻',
    seats: 7,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.9,
    tags: ['suv', 'Family', '7 Seats'],
    desc: '7-seater SUV ideal for family road trips. Plenty of space and modern tech.',
  },
  {
    category: 'Luxury',
    name: 'BMW 5 Series',
    price: 149,
    emoji: '🏎️',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 5.0,
    tags: ['luxury', 'Premium', 'Executive'],
    desc: 'Experience executive comfort. Powerful performance with cutting-edge features.',
  },
  {
    category: 'Sports',
    name: 'Mustang GT',
    price: 179,
    emoji: '⚡',
    seats: 4,
    fuel: 'Petrol',
    transmission: 'Manual',
    rating: 4.9,
    tags: ['sports', 'Thrilling', 'Iconic'],
    desc: 'Feel the thrill with an iconic American muscle car. Perfect for special occasions.',
  },
  {
    category: 'Van',
    name: 'Mercedes Vito',
    price: 99,
    emoji: '🚐',
    seats: 9,
    fuel: 'Diesel',
    transmission: 'Auto',
    rating: 4.7,
    tags: ['van', 'Group Travel', '9 Seats'],
    desc: 'Perfect for group travel or moving large cargo. Spacious and reliable.',
  },
  {
    category: 'Truck',
    name: 'Ford F-150',
    price: 89,
    emoji: '🚚',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.8,
    tags: ['truck', 'Heavy Duty', 'Work Ready'],
    desc: 'America\'s best-selling truck. Perfect for work, hauling, or off-road adventures.',
  },
];

export default function VehiclesPage() {
  return (
    <>
      {/* ── Page Header ──────────────────────────────────── */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.07),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            Our Fleet
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Ride</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From budget economy cars to prestigious luxury vehicles, our diverse fleet 
            ensures you find the perfect match for your needs.
          </p>
        </div>
      </section>

      {/* ── Vehicle Grid ─────────────────────────────────── */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <div key={v.name} className="glass rounded-2xl overflow-hidden card-hover group">
                {/* Vehicle display */}
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 text-center border-b border-white/5">
                  <span className="text-6xl">{v.emoji}</span>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 glass text-xs text-amber-400 border border-amber-500/20 rounded-full">
                      {v.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Name + rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{v.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="text-slate-400 text-xs">{v.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{v.desc}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center gap-1 glass rounded-lg py-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400">{v.seats}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 glass rounded-lg py-2">
                      <Fuel className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400">{v.fuel}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 glass rounded-lg py-2">
                      <Gauge className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400">{v.transmission}</span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-amber-400">${v.price}</span>
                      <span className="text-slate-500 text-xs">/day</span>
                    </div>
                    <Link
                      href={`/booking?vehicle=${v.tags[0]}`}
                      className="px-4 py-2 gold-gradient text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
