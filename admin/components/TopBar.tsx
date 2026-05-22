'use client';

import { Shield } from 'lucide-react';

interface TopBarProps {
  userEmail: string;
}

export default function TopBar({ userEmail }: TopBarProps) {
  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 glass border-b border-gray-800/50">
      <div>
        <p className="text-gray-400 text-sm">{currentTime}</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Shield className="w-3.5 h-3.5 text-green-400" />
        <span className="text-green-400 text-xs font-medium">Secure Session Active</span>
      </div>
    </header>
  );
}
