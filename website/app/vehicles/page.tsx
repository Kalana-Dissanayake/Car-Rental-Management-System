'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users, Fuel, Gauge, Star, Search, X, ChevronDown,
  SlidersHorizontal, RotateCcw,
} from 'lucide-react';

// ── Vehicle data ──────────────────────────────────────────────────────────────

const vehicles = [
  {
    id: 'economy',
    category: 'Economy',
    name: 'Toyota Yaris',
    brand: 'Toyota',
    type: 'Hatchback',
    price: 29,
    image: '/images/Toyota Yaris.jpg',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.7,
    desc: 'Perfect for city driving and short trips. Great fuel economy and easy to park.',
  },
  {
    id: 'compact',
    category: 'Compact',
    name: 'Honda Civic',
    brand: 'Honda',
    type: 'Sedan',
    price: 39,
    image: '/images/Honda Civic.jpg',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.8,
    desc: 'The most popular choice. Comfortable, reliable, and great for both city and highway.',
  },
  {
    id: 'midsize',
    category: 'Mid-Size',
    name: 'Toyota Camry',
    brand: 'Toyota',
    type: 'Sedan',
    price: 55,
    image: '/images/Toyota Camry.jpg',
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Auto',
    rating: 4.8,
    desc: 'A spacious, comfortable sedan with hybrid efficiency for longer journeys.',
  },
  {
    id: 'suv',
    category: 'SUV',
    name: 'Ford Explorer',
    brand: 'Ford',
    type: 'SUV',
    price: 79,
    image: '/images/Ford Explorer.jpg',
    seats: 7,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.9,
    desc: '7-seater SUV ideal for family road trips. Plenty of space and modern tech.',
  },
  {
    id: 'luxury',
    category: 'Luxury',
    name: 'BMW 5 Series',
    brand: 'BMW',
    type: 'Saloon',
    price: 149,
    image: '/images/BMW 5 Series.jpg',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 5.0,
    desc: 'Experience executive comfort. Powerful performance with cutting-edge features.',
  },
  {
    id: 'sports',
    category: 'Sports',
    name: 'Mustang GT',
    brand: 'Mustang',
    type: 'Coupe',
    price: 179,
    image: '/images/Mustang GT.jpg',
    seats: 4,
    fuel: 'Petrol',
    transmission: 'Manual',
    rating: 4.9,
    desc: 'Feel the thrill with an iconic American muscle car. Perfect for special occasions.',
  },
  {
    id: 'van',
    category: 'Van',
    name: 'Mercedes Vito',
    brand: 'Benz',
    type: 'Van',
    price: 99,
    image: '/images/Mercedes Vito.jpg',
    seats: 9,
    fuel: 'Diesel',
    transmission: 'Auto',
    rating: 4.7,
    desc: 'Perfect for group travel or moving large cargo. Spacious and reliable.',
  },
  {
    id: 'truck',
    category: 'Truck',
    name: 'Ford F-150',
    brand: 'Ford',
    type: 'Truck',
    price: 89,
    image: '/images/Ford F-150.jpg',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.8,
    desc: "America's best-selling truck. Perfect for work, hauling, or off-road adventures.",
  },
];

const BRANDS   = ['All Brands', 'Toyota', 'Honda', 'BMW', 'Ford', 'Benz', 'Mustang'];
const TYPES    = ['All Types', 'Sedan', 'Saloon', 'SUV', 'Hatchback', 'Coupe', 'Van', 'Truck'];
const MAX_PRICE = 200;

// ── Small reusable select ─────────────────────────────────────────────────────

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const active = value !== options[0];
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none px-4 py-2.5 pr-9 rounded-xl border text-sm font-medium cursor-pointer
            focus:outline-none focus:ring-1 transition-all
            ${active
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600 focus:border-amber-500/50 focus:ring-amber-500/10'
            }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors
            ${active ? 'text-amber-400' : 'text-slate-500'}`}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VehiclesPage() {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedType,  setSelectedType]  = useState('All Types');
  const [minPrice,      setMinPrice]      = useState(0);
  const [maxPrice,      setMaxPrice]      = useState(MAX_PRICE);
  const [pendingMin,    setPendingMin]     = useState(0);
  const [pendingMax,    setPendingMax]     = useState(MAX_PRICE);
  const [priceApplied,  setPriceApplied]  = useState(false);

  // Derived
  const hasActiveFilters =
    selectedBrand !== 'All Brands' ||
    selectedType  !== 'All Types'  ||
    searchQuery   !== ''           ||
    priceApplied;

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchBrand  = selectedBrand === 'All Brands' || v.brand === selectedBrand;
      const matchType   = selectedType  === 'All Types'  || v.type  === selectedType;
      const matchPrice  = v.price >= minPrice && v.price <= maxPrice;
      const q           = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q)     ||
        v.category.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)     ||
        v.brand.toLowerCase().includes(q)    ||
        v.fuel.toLowerCase().includes(q);
      return matchBrand && matchType && matchPrice && matchSearch;
    });
  }, [searchQuery, selectedBrand, selectedType, minPrice, maxPrice]);

  function applyPrice() {
    setMinPrice(pendingMin);
    setMaxPrice(pendingMax);
    setPriceApplied(pendingMin > 0 || pendingMax < MAX_PRICE);
  }

  function clearPrice() {
    setPendingMin(0);
    setPendingMax(MAX_PRICE);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setPriceApplied(false);
  }

  function clearAll() {
    setSearchQuery('');
    setSelectedBrand('All Brands');
    setSelectedType('All Types');
    setPendingMin(0);
    setPendingMax(MAX_PRICE);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setPriceApplied(false);
  }

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <section className="pt-28 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.07),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            Our Fleet
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Ride</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From budget economy cars to prestigious luxury vehicles — find the perfect match for every journey.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ──────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 items-start">

            {/* ══════════════════ LEFT SIDEBAR ══════════════════ */}
            <aside className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0 sticky top-24 self-start">

              {/* Card wrapper */}
              <div className="glass rounded-2xl overflow-hidden">

                {/* Header strip */}
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      id="sidebar-clear-all"
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="px-5 py-5 space-y-6">

                  {/* ── Search ── */}
                  <div>
                    <label
                      htmlFor="sidebar-search"
                      className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        id="sidebar-search"
                        type="text"
                        placeholder="Name, brand, type…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-600
                          focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/5" />

                  {/* ── Brand ── */}
                  <FilterSelect
                    id="sidebar-brand"
                    label="Car Brand"
                    value={selectedBrand}
                    options={BRANDS}
                    onChange={setSelectedBrand}
                  />

                  {/* ── Car Type ── */}
                  <FilterSelect
                    id="sidebar-type"
                    label="Body Type"
                    value={selectedType}
                    options={TYPES}
                    onChange={setSelectedType}
                  />

                  {/* Divider */}
                  <div className="h-px bg-white/5" />

                  {/* ── Price range ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Price / Day
                      </span>
                      {priceApplied && (
                        <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Range labels */}
                    <div className="flex justify-between mb-3">
                      <span className="text-xs font-semibold text-white bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                        ${pendingMin}
                      </span>
                      <span className="text-xs font-semibold text-white bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                        ${pendingMax}
                      </span>
                    </div>

                    {/* Min slider */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-[10px] text-slate-600">
                        <span>Min</span>
                        <span>${pendingMin}/day</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={MAX_PRICE}
                        step={5}
                        value={pendingMin}
                        onChange={(e) => {
                          const v = Math.min(Number(e.target.value), pendingMax - 5);
                          setPendingMin(v);
                        }}
                        className="w-full h-1.5 rounded-full accent-amber-500 cursor-pointer"
                        id="price-min-slider"
                      />
                    </div>

                    {/* Max slider */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex justify-between text-[10px] text-slate-600">
                        <span>Max</span>
                        <span>${pendingMax}/day</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={MAX_PRICE}
                        step={5}
                        value={pendingMax}
                        onChange={(e) => {
                          const v = Math.max(Number(e.target.value), pendingMin + 5);
                          setPendingMax(v);
                        }}
                        className="w-full h-1.5 rounded-full accent-amber-500 cursor-pointer"
                        id="price-max-slider"
                      />
                    </div>

                    {/* Clear / Apply buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={clearPrice}
                        id="price-clear-btn"
                        className="py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-700/60 hover:border-slate-500 rounded-xl transition-all"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyPrice}
                        id="price-apply-btn"
                        className="py-2 text-xs font-semibold text-white gold-gradient rounded-xl hover:opacity-90 transition-all shadow-sm shadow-amber-500/20"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Active filter summary pills */}
              {hasActiveFilters && (
                <div className="glass rounded-xl px-4 py-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-1">
                    Active filters
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBrand !== 'All Brands' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                        {selectedBrand}
                        <button onClick={() => setSelectedBrand('All Brands')} className="hover:text-white transition-colors ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {selectedType !== 'All Types' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                        {selectedType}
                        <button onClick={() => setSelectedType('All Types')} className="hover:text-white transition-colors ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                        &ldquo;{searchQuery}&rdquo;
                        <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {priceApplied && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                        ${minPrice}–${maxPrice}
                        <button onClick={clearPrice} className="hover:text-white transition-colors ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* ══════════════════ MAIN GRID ══════════════════ */}
            <div className="flex-1 min-w-0 pt-2">

              {/* Top bar: result count + mobile search */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
                <p className="text-slate-500 text-sm">
                  Showing{' '}
                  <span className="text-white font-semibold">{filtered.length}</span>
                  {' '}of{' '}
                  <span className="text-white font-semibold">{vehicles.length}</span>
                  {' '}vehicles
                </p>

                {/* Mobile quick search (only shown on small screens where sidebar is hidden) */}
                <div className="relative lg:hidden w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search vehicles…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl text-sm text-white
                      placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Empty state */}
              {filtered.length === 0 ? (
                <div className="glass rounded-3xl py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center mx-auto mb-5">
                    <Search className="w-7 h-7 text-slate-600" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">No vehicles found</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Try adjusting your filters or clear the search query.
                  </p>
                  <button
                    onClick={clearAll}
                    className="px-6 py-2.5 gold-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((v) => (
                    <div
                      key={v.id}
                      className="glass rounded-2xl overflow-hidden card-hover group flex flex-col"
                    >
                      {/* Photo */}
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={v.image}
                          alt={`${v.name} — ${v.category} rental car`}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        {/* Category badge */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 glass text-xs text-amber-400 border border-amber-500/20 rounded-full">
                            {v.category}
                          </span>
                        </div>
                        {/* Brand · Type badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 bg-slate-900/75 text-slate-400 text-xs rounded-full border border-white/10">
                            {v.brand} · {v.type}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Name + rating */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white leading-tight">{v.name}</h3>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                            <span className="text-slate-400 text-xs">{v.rating}</span>
                          </div>
                        </div>

                        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{v.desc}</p>

                        {/* Specs row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="flex flex-col items-center gap-1 bg-slate-900/50 border border-white/5 rounded-lg py-2">
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs text-slate-400">{v.seats}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 bg-slate-900/50 border border-white/5 rounded-lg py-2">
                            <Fuel className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs text-slate-400">{v.fuel}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 bg-slate-900/50 border border-white/5 rounded-lg py-2">
                            <Gauge className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs text-slate-400">{v.transmission}</span>
                          </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-xl font-bold text-amber-400">${v.price}</span>
                            <span className="text-slate-500 text-xs ml-0.5">/day</span>
                          </div>
                          <Link
                            href={`/booking?vehicle=${v.id}`}
                            className="px-4 py-2 gold-gradient text-white text-xs font-semibold rounded-xl
                              shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
