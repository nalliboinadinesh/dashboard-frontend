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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-4 py-3 md:px-8 flex items-center justify-between shadow-sm">
      {/* Left logo & title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#0f3b75] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-md">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-slate-900 tracking-wider">
                {user?.hostelName || 'SOSA'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#0f3b75] uppercase tracking-widest">
              Tenant Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Date showing - matching layout "This Month • May 2026" */}
      <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500">
        <span>This Month</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        <span className="text-[#0f3b75] font-bold">{getFormattedDate()}</span>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        {/* Mini user profile initials badge */}
        {user && (
          <Link href="/profile" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#f0f4f8] border border-[#0f3b75]/20 flex items-center justify-center text-xs font-bold text-[#0f3b75] group-hover:bg-[#0f3b75] group-hover:text-white transition-all">
              {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate max-w-[100px]">
              {user.name.split(' ')[0]}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
};
