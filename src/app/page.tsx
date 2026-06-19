'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  DoorOpen, IndianRupee, Snowflake, AlertCircle, CheckCircle2, 
  Wifi, Coffee, Ticket, PhoneCall, ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    user, 
    dashboardData, 
    fetchDashboard, 
    isDashboardLoading, 
    dashboardError
  } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Format today's date: "Monday, May 18, 2026"
  const getTodayDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (dashboardError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 max-w-md mx-auto">
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/20 bg-rose-950/5 text-center space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <AlertCircle className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-100 tracking-tight">Connection Issue</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              {dashboardError}
            </p>
          </div>
          
          <button 
            onClick={() => fetchDashboard()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (isDashboardLoading || !dashboardData || !user) {
    return <SkeletonLoader type="dashboard" />;
  }

  // Determine Payment Status styles
  const isPaid = user.paymentStatus === 'Paid';
  const isOverdue = user.paymentStatus === 'Overdue';
  
  const statusBadgeStyle = isPaid 
    ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
    : isOverdue 
    ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' 
    : 'text-amber-400 border-amber-500/20 bg-amber-500/5';



  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* 1. Welcoming Top Header */}
      <div className="space-y-3 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{getTodayDateString()}</span>
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Grid - Sleek & High-contrast SaaS metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Room Details */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-2.5 hover:border-slate-800 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stay Allocation</span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-md uppercase">
              {dashboardData.hostel?.hostelType ? `${dashboardData.hostel.hostelType}'s` : 'Room'}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 tracking-tight">
              Room - {dashboardData.room?.roomNumber || user.roomNo.replace('A-', '')}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
              <DoorOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {dashboardData.room?.roomType 
                  ? `${dashboardData.room.roomType.charAt(0).toUpperCase() + dashboardData.room.roomType.slice(1)} Sharing (${dashboardData.room.totalBeds} beds)` 
                  : '3rd Floor Allocation'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Financial Details */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-2.5 hover:border-slate-800 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Rent</span>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2 py-0.5 rounded-md uppercase">
              Rent
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 tracking-tight">
              ₹{(dashboardData.payments?.monthlyRent || user.monthlyFee).toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {dashboardData.payments?.deposit 
                ? `Security Deposit: ₹${dashboardData.payments.deposit.toLocaleString('en-IN')}`
                : 'Due on 1st of every month'}
            </div>
          </div>
        </div>

        {/* Card 3: Due Amount & Status */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-2.5 hover:border-slate-800 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${statusBadgeStyle}`}>
              {user.paymentStatus}
            </span>
          </div>
          <div>
            <div className={`text-2xl font-black tracking-tight ${user.dueAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{(dashboardData.payments?.totalDues ?? user.dueAmount).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              {dashboardData.payments ? (
                <span>
                  Paid Cycles: {dashboardData.payments.paidCycles} | Pending: {dashboardData.payments.unpaidCycles}
                </span>
              ) : user.dueAmount > 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Immediate settlement required</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>All payments up to date</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dynamic Quick Actions Grid - Clean SaaS Panel */}
      <section className="space-y-4">
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
          Quick Actions & Operations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Action 1: Raise Complaint */}
          <Link 
            href="/tickets/raise" 
            className="glass-panel p-5 rounded-xl border border-white/5 hover:border-purple-500/20 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Ticket className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-200 text-sm">Raise Complaint Ticket</h3>
              <p className="text-xs text-slate-500 mt-1">
                Report a maintenance problem, electrical fault, or request cleaning inside your room.
              </p>
            </div>
          </Link>

          {/* Action 2: View Ticket Status */}
          <Link 
            href="/tickets/history" 
            className="glass-panel p-5 rounded-xl border border-white/5 hover:border-cyan-500/20 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-200 text-sm">Ticket History & Status</h3>
              <p className="text-xs text-slate-500 mt-1">
                Check details, status tags, and real-time updates of all raised support tickets.
              </p>
            </div>
          </Link>

          {/* Action 3: Contact Management */}
          <a 
            href={`tel:${dashboardData.hostel?.ownerNumber || user.phone}`}
            className="glass-panel p-5 rounded-xl border border-white/5 hover:border-emerald-500/20 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-200 text-sm">
                Contact {dashboardData.hostel?.ownerName || 'Hostel Manager'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dial the management desk immediately for check-out enquiries, issues or security matters.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* 4. Payment Cycles & Billing Ledger */}
      {dashboardData.payments?.cycles && dashboardData.payments.cycles.length > 0 && (
        <section className="glass-panel p-6 rounded-xl border border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full" />
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
                Payment Cycles & Billing History
              </h3>
            </div>
            {dashboardData.payments.lastPaidDate && (
              <span className="text-[10px] text-slate-400 bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold">
                <Clock className="w-3 h-3 text-cyan-400" />
                Last Paid: {new Date(dashboardData.payments.lastPaidDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="p-4">Billing Period</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {dashboardData.payments.cycles.map((cycle, index) => {
                  const cyclePaid = cycle.isPaid;
                  return (
                    <tr key={cycle._id || index} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 font-semibold text-slate-300">
                        {new Date(cycle.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-2 text-slate-600">→</span>
                        {new Date(cycle.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-extrabold text-slate-200">
                        ₹{cycle.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          cyclePaid 
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
                            : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cyclePaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {cyclePaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {cyclePaid ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              Paid via <span className="uppercase text-slate-300">{cycle.paymentMethod || 'cash'}</span> on {cycle.paymentDate ? new Date(cycle.paymentDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                            <span>Awaiting payment settlement</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}


    </div>
  );
}
