'use client';

import React from 'react';
import { useAuth } from '../store/AuthContext';
import { Bell, Award, Home } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  
  // Format current date: "May 2026" or current month & year
  const getFormattedDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md px-4 py-3 md:px-8 flex items-center justify-between">
      {/* Left logo & title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 glow-shadow-cyan group-hover:scale-105 transition-all">
            <Home className="w-5 h-5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-slate-100 tracking-wider">
                {user?.hostelName || 'SOSA'}
              </span>
            </div>
            <span className="text-[10px] font-medium text-cyan-400/80 uppercase tracking-widest">
              Tenant Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Date showing - matching layout "This Month • May 2026" */}
      <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-300">
        <span>This Month</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
        <span className="text-cyan-400">{getFormattedDate()}</span>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        {/* Mini user profile initials badge */}
        {user && (
          <Link href="/profile" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
              {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate max-w-[100px]">
              {user.name.split(' ')[0]}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
};
