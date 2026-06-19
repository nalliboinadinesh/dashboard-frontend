'use client';

import React from 'react';
import { useAuth } from '../store/AuthContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel transition-all shadow-lg ${
                isSuccess
                  ? 'border-emerald-500/30 bg-slate-950/70 shadow-emerald-500/5'
                  : isError
                  ? 'border-rose-500/30 bg-slate-950/70 shadow-rose-500/5'
                  : 'border-cyan-500/30 bg-slate-950/70 shadow-cyan-500/5'
              }`}
            >
              <div className="mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                {isError && <AlertTriangle className="w-5 h-5 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />}
              </div>

              <div className="flex-1 text-sm font-medium text-slate-100 pr-2">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 hover:bg-slate-800/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
