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
    { name: 'Dashboard', path: '/', icon: Home, color: 'text-cyan-400', glow: 'rgba(6,182,212,0.4)' },
    { name: 'Raise Ticket', path: '/tickets/raise', icon: Ticket, color: 'text-purple-400', glow: 'rgba(168,85,247,0.4)' },
    { name: 'Ticket History', path: '/tickets/history', icon: History, color: 'text-emerald-400', glow: 'rgba(16,185,129,0.4)' },
    { name: 'Residency Profile', path: '/profile', icon: User, color: 'text-orange-400', glow: 'rgba(249,115,22,0.4)' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 h-full p-4 shrink-0 justify-between overflow-y-auto">
      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        <div className="px-3 py-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
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
                  ? 'bg-slate-900 border-white/10 shadow-lg text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 hover:border-white/5'
              }`}
              style={{
                boxShadow: isActive ? `0 0 15px -3px ${item.glow}` : undefined
              }}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive ? item.color : 'text-slate-400 group-hover:text-slate-300'
              }`} />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400 shrink-0">
              {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-200 truncate">{user.name}</h4>
              <p className="text-xs text-slate-400 truncate">Room: {user.roomNo}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
