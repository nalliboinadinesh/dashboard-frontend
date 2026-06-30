'use client';

import React from 'react';
import { useAuth } from '../store/AuthContext';
import { Home, Ticket, History, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Raise Ticket', path: '/tickets/raise', icon: Ticket },
    { name: 'Ticket History', path: '/tickets/history', icon: History },
    { name: 'Residency Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 shrink-0 justify-between overflow-y-auto">
      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        <div className="px-3 py-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Navigation
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? 'bg-[#f0f4f8] border-[#0f3b75]/20 text-[#0f3b75] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive ? 'text-[#0f3b75]' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>


    </aside>
  );
};
