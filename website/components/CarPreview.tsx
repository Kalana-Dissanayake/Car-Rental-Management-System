'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';

// Maps vehicle type values (from BookingForm select) to actual image files
const vehicleImageMap: Record<string, { src: string; label: string }> = {
  economy: { src: '/images/Toyota Yaris.jpg',    label: 'Toyota Yaris' },
  compact: { src: '/images/Honda Civic.jpg',     label: 'Honda Civic' },
  midsize: { src: '/images/Toyota Camry.jpg',    label: 'Toyota Camry' },
  suv:     { src: '/images/Ford Explorer.jpg',   label: 'Ford Explorer' },
  luxury:  { src: '/images/BMW 5 Series.jpg',    label: 'BMW 5 Series' },
  sports:  { src: '/images/Mustang GT.jpg',      label: 'Mustang GT' },
  van:     { src: '/images/Mercedes Vito.jpg',   label: 'Mercedes Vito' },
  truck:   { src: '/images/Ford F-150.jpg',      label: 'Ford F-150' },
};

interface CarPreviewProps {
  /** Initial vehicle type from URL search param (server-side pre-selection) */
  initialVehicle?: string;
}

export default function CarPreview({ initialVehicle = '' }: CarPreviewProps) {
  const [vehicleType, setVehicleType] = useState(initialVehicle);

  // Listen for vehicle changes emitted by BookingForm via a custom event
  useEffect(() => {
    function onVehicleChange(e: Event) {
      const custom = e as CustomEvent<string>;
      setVehicleType(custom.detail);
    }
    window.addEventListener('driveease:vehicleChange', onVehicleChange);
    return () => window.removeEventListener('driveease:vehicleChange', onVehicleChange);
  }, []);

  const vehicle = vehicleImageMap[vehicleType];

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      {/* Image area */}
      <div className="relative h-44 bg-slate-900/60">
        {vehicle ? (
          <>
            <Image
              src={vehicle.src}
              alt={vehicle.label}
              fill
              className="object-cover object-center transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            {/* Vehicle name badge */}
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 glass text-xs text-amber-400 border border-amber-500/20 rounded-full font-medium">
                {vehicle.label}
              </span>
            </div>
          </>
        ) : (
          /* Placeholder when no vehicle is selected */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Car className="w-7 h-7 text-amber-400/50" />
            </div>
            <p className="text-slate-600 text-xs text-center px-4">
              Select a vehicle type to preview your car
            </p>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="px-5 py-4">
        <p className="text-xs text-amber-400 uppercase tracking-wider font-medium mb-1">
          🚗 Your Selected Vehicle
        </p>
        <p className="text-white font-semibold text-sm">
          {vehicle ? vehicle.label : 'No vehicle selected'}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          {vehicle
            ? 'Change the vehicle type in the form to update this preview.'
            : 'Choose a vehicle type from the booking form.'}
        </p>
      </div>
    </div>
  );
}
