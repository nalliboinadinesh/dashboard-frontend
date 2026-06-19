'use client';

import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { Mail, Lock, Eye, EyeOff, Home, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      // Errors are caught and shown via toasts in AuthContext
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md p-2">
      {/* Background glowing blurred circles for premium visual aesthetic */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-500/10 blur-[64px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/10 blur-[64px] pointer-events-none animate-pulse-glow" />

      {/* Glassmorphic Login Card */}
      <div className="w-full glass-panel rounded-3xl border border-white/5 p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Border accent glow lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        
        {/* Brand logo & header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 glow-shadow-cyan mb-4">
            <Home className="w-7 h-7 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wider">SOSA Portal</h2>
          <p className="text-xs text-slate-400 mt-1.5 text-center">
            Login using credentials received on your registered email
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenant@example.com"
                className="w-full py-3.5 pl-11 pr-4 rounded-xl text-slate-100 text-sm glow-input"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3.5 pl-11 pr-12 rounded-xl text-slate-100 text-sm glow-input"
                disabled={isSubmitting || isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Dummy credentials hint */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] text-slate-500">
            For Demo login, type any email and a password.
          </p>
        </div>
      </div>
    </div>
  );
}
