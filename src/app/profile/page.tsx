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
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-[#f0f4f8] to-transparent pointer-events-none" />

        {/* Big Initials Avatar */}
        <div className="relative w-24 h-24 rounded-2xl bg-[#0f3b75] border border-[#0f3b75]/10 flex items-center justify-center text-3xl font-black text-white shadow-md">
          {initials}
        </div>

        {/* User Quick Info */}
        <div className="text-center sm:text-left space-y-1 z-10 flex-1">
          <h1 className="text-2xl font-black text-[#0f3b75] tracking-tight">{user.name}</h1>
          <p className="text-xs font-bold text-[#0f3b75] uppercase tracking-widest">Active Tenant</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
            <span className="text-[10px] bg-slate-50 border border-slate-200 text-[#0f3b75] font-bold px-2.5 py-1 rounded-md">
              Room: {user.roomNo}
            </span>
            <span className="text-[10px] bg-slate-50 border border-slate-200 text-[#0f3b75] font-bold px-2.5 py-1 rounded-md">
              Joined: {user.joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Official Registration Details */}
      <section className="glass-panel p-6 sm:p-8 space-y-6">
        
        <h3 className="text-sm font-extrabold text-[#0f3b75] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#0f3b75] rounded-full"></span>
          Official Registration Details
        </h3>

        {/* Read-Only Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-[#0f3b75]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#0f3b75] text-xs font-semibold">
              <User className="w-4 h-4 text-[#0f3b75]" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-[#0f3b75] pl-6">{user.name}</div>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-[#0f3b75]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#0f3b75] text-xs font-semibold">
              <Mail className="w-4 h-4 text-[#0f3b75]" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-[#0f3b75] pl-6 truncate">{user.email}</div>
          </div>

          {/* Phone Number */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-[#0f3b75]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#0f3b75] text-xs font-semibold">
              <Phone className="w-4 h-4 text-[#0f3b75]" />
              <span>Contact Number</span>
            </div>
            <div className="text-sm font-bold text-[#0f3b75] pl-6">{user.phone}</div>
          </div>

          {/* Joined Date */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-[#0f3b75]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#0f3b75] text-xs font-semibold">
              <Calendar className="w-4 h-4 text-[#0f3b75]" />
              <span>Allocation Date</span>
            </div>
            <div className="text-sm font-bold text-[#0f3b75] pl-6">{user.joinDate}</div>
          </div>

          {/* Hostel / Building Name */}
          <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-[#0f3b75]/30 transition-colors">
            <div className="flex items-center gap-2 text-[#0f3b75] text-xs font-semibold">
              <Landmark className="w-4 h-4 text-[#0f3b75]" />
              <span>Hostel / PG Building</span>
            </div>
            <div className="text-sm font-bold text-[#0f3b75] pl-6 flex items-center gap-2">
              <span>{user.hostelName}</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified Residency
              </span>
            </div>
          </div>

        </div>

        {/* Crucial Info Message - explaining read-only profile */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0f3b75] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#0f3b75]">Profile lock in place</h4>
            <p className="text-[11px] text-[#0f3b75]/80 mt-0.5 leading-relaxed font-medium">
              Your registered details are locked to secure active residency records. They are manageable strictly by the hostel owner within the SOSA Management Portal. For corrections regarding your name, room number, or email contact, please consult the hostel administration staff directly.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
