'use client';

import React from 'react';
import { Home, Ticket, History, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Raise', path: '/tickets/raise', icon: Ticket },
    { name: 'History', path: '/tickets/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-2 flex items-center justify-around pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            className="flex flex-col items-center justify-center py-1 relative w-12 group"
          >
            {/* Active dot indicator */}
            {isActive && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#0f3b75]" />
            )}
            
            <Icon 
              className={`w-6 h-6 transition-all duration-300 ${
                isActive 
                  ? 'text-[#0f3b75] scale-110' 
                  : 'text-slate-400 hover:text-slate-600'
              }`} 
            />
            <span className={`text-[10px] mt-1 font-bold ${
              isActive ? 'text-[#0f3b75]' : 'text-slate-500'
            }`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
