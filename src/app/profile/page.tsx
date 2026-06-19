'use client';

import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { 
  User, Mail, Phone, Calendar, Landmark, ShieldCheck, Info
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isDashboardLoading } = useAuth();

  if (isDashboardLoading || !user) {
    return <SkeletonLoader type="profile" />;
  }

  // Generate name initials
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Top Banner Area */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Big Initials Avatar */}
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-3xl font-black text-slate-100 glow-shadow-cyan">
          {initials}
        </div>

        {/* User Quick Info */}
        <div className="text-center sm:text-left space-y-1 z-10 flex-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">{user.name}</h1>
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Active Tenant</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
            <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-300 font-bold px-2.5 py-1 rounded-md">
              Room: {user.roomNo}
            </span>
            <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-300 font-bold px-2.5 py-1 rounded-md">
              Joined: {user.joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Official Registration Details */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-purple-400 rounded-full"></span>
          Official Registration Details
        </h3>

        {/* Read-Only Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <User className="w-4 h-4 text-purple-400" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-6">{user.name}</div>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-6 truncate">{user.email}</div>
          </div>

          {/* Phone Number */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Number</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-6">{user.phone}</div>
          </div>

          {/* Joined Date */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Allocation Date</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-6">{user.joinDate}</div>
          </div>

          {/* Hostel / Building Name */}
          <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span>Hostel / PG Building</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-6 flex items-center gap-2">
              <span>{user.hostelName}</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified Residency
              </span>
            </div>
          </div>

        </div>

        {/* Crucial Info Message - explaining read-only profile */}
        <div className="mt-6 p-4 rounded-xl bg-[#0f172a]/80 border border-white/5 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-300">Profile lock in place</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Your registered details are locked to secure active residency records. They are manageable strictly by the hostel owner within the SOSA Management Portal. For corrections regarding your name, room number, or email contact, please consult the hostel administration staff directly.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
