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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eef2f6] space-y-5">
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#0f3b75] rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-extrabold text-[#0f3b75] uppercase tracking-widest animate-pulse">
          Securing Session...
        </p>
      </div>
    );
  }

  // Standalone layout for Login / Register Page — must scroll freely
  if (isStandalonePage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#eef2f6] py-8 px-4 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    );
  }

  // Dashboard layout — fixed height, sidebar never scrolls, only main content scrolls
  return (
    <div className="flex flex-col h-screen bg-[#eef2f6] overflow-hidden">
      {/* Top Navbar — fixed height, never scrolls */}
      <Navbar />

      {/* Content area below navbar — fills remaining height */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Desktop Sidebar — fixed height, independent scroll */}
        <Sidebar />

        {/* Page content — only this scrolls */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
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
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
