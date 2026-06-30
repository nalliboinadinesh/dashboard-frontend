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
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-white shadow-lg transition-all ${
                isSuccess
                  ? 'border-emerald-200'
                  : isError
                  ? 'border-rose-200'
                  : 'border-[#0f3b75]/20'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isError && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-[#0f3b75]" />}
              </div>

              <div className="flex-1 text-sm font-bold text-[#0f3b75] pr-2 mt-0.5 leading-relaxed">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-[#0f3b75] transition-colors p-1 hover:bg-slate-100 rounded-lg shrink-0"
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
