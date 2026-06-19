'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isStandalonePage = pathname === '/login' || pathname === '/add-tenant' || pathname === '/register-tenant';

  // While checking auth on initial load, show a full screen dark-navy loading spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050814]">
        <div className="relative">
          {/* Outer glowing pulsing border */}
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin glow-shadow-cyan"></div>
          {/* Inner pulsating dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Securing Session...
        </p>
      </div>
    );
  }

  // Standalone layout for Login / Register Page
  if (isStandalonePage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050814] py-8 px-4 overflow-y-auto">
        {children}
      </div>
    );
  }

  // Dashboard layout for Authenticated pages
  return (
    <div className="flex flex-col min-h-screen bg-[#050814]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic page content wrapped in transition wrapper */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
