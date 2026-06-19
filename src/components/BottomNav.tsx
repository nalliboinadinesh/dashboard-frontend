'use client';

import React from 'react';
import { Home, Ticket, History, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home, color: 'text-cyan-400', glow: 'rgba(6,182,212,0.4)' },
    { name: 'Raise', path: '/tickets/raise', icon: Ticket, color: 'text-purple-400', glow: 'rgba(168,85,247,0.4)' },
    { name: 'History', path: '/tickets/history', icon: History, color: 'text-emerald-400', glow: 'rgba(16,185,129,0.4)' },
    { name: 'Profile', path: '/profile', icon: User, color: 'text-orange-400', glow: 'rgba(249,115,22,0.4)' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070d19]/80 backdrop-blur-lg border-t border-white/5 px-4 py-2 flex items-center justify-around pb-4">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            className="flex flex-col items-center justify-center py-1 relative w-12 group"
          >
            {/* Glowing dot above/around active icon */}
            {isActive && (
              <span 
                className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-slate-100"
                style={{
                  boxShadow: `0 0 10px 2px ${item.glow}, 0 0 4px 1px #fff`
                }}
              />
            )}
            
            <Icon 
              className={`w-6 h-6 transition-all duration-300 ${
                isActive 
                  ? `${item.color} scale-110 drop-shadow-[0_0_8px_${item.glow}]` 
                  : 'text-slate-400 hover:text-slate-200'
              }`} 
            />
            <span className={`text-[10px] mt-1 font-bold ${
              isActive ? 'text-slate-200' : 'text-slate-500'
            }`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
