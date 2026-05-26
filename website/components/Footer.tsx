import Link from 'next/link';
import Image from 'next/image';
import { Car, MapPin, Phone, Mail, Share2, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070710] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/images/Logo.png" alt="DriveEase Logo" width={180} height={56} className="h-14 w-auto object-contain" />
              <span className="font-bold text-white text-lg">
                Drive<span className="text-gold">Ease</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Premium car rental solutions for every journey. From economy to luxury, 
              we have the perfect vehicle for you.
            </p>
            <div className="flex items-center gap-3 mt-4">
            {[Share2, MessageCircle, Globe].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-amber-500/15 flex items-center justify-center text-slate-500 hover:text-amber-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Our Fleet', href: '/vehicles' },
                { label: 'Book a Car', href: '/booking' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Types */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Fleet
            </h3>
            <ul className="space-y-2">
              {['Economy Cars', 'Compact Cars', 'Mid-Size', 'SUVs', 'Luxury Cars', 'Vans & Trucks'].map(
                (type) => (
                  <li key={type}>
                    <Link
                      href="/vehicles"
                      className="text-slate-500 hover:text-amber-400 text-sm transition-colors"
                    >
                      {type}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>123 Fleet Street, Business District, City 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>info@driveease.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} DriveEase Car Rental. All rights reserved.
          </p>
          <p className="text-slate-700 text-xs">
            Built with security and performance in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
