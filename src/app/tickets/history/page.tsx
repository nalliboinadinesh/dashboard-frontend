'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../store/AuthContext';
import { SkeletonLoader } from '../../../components/SkeletonLoader';
import { TicketCategory, TicketStatus, Ticket } from '../../../types';
import { Search, Filter, Calendar, Info, X, ChevronRight, Eye, ShieldAlert, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function TicketHistoryPage() {
  const { tickets, fetchTickets, isTicketsLoading } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (isTicketsLoading) {
    return <SkeletonLoader type="tickets" count={3} />;
  }

  // Filtered tickets logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || ticket.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || ticket.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Category list for filters
  const categoriesList = ['All', 'Electrical', 'Water', 'Cleaning', 'Internet', 'Furniture', 'Other'];
  
  // Status list for filters
  const statusList = ['All', 'Pending', 'In Progress', 'Resolved'];

  // Status badges colors config
  const getStatusBadgeStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5 glow-orange';
      case 'In Progress':
        return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5 glow-cyan';
      case 'Resolved':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 glow-green';
      default:
        return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Support Ticket History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor and track status of all raised complaints.
          </p>
        </div>
        
        <Link 
          href="/tickets/raise"
          className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors text-center"
        >
          Raise New Ticket +
        </Link>
      </div>

      {/* Search & Filter bar panel */}
      <section className="glass-panel p-4 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Keyword Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tickets by subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl text-slate-200 text-xs glow-input bg-[#0f172a]"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsStatusOpen(false);
            }}
            className="w-full py-2.5 pl-10 pr-3 rounded-xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-inner"
          >
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
              <Filter className="w-4 h-4" />
            </span>
            <span>Category: {selectedCategory}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
          )}

          {isCategoryOpen && (
            <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-[#090d16]/95 border border-white/10 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsCategoryOpen(false);
            }}
            className="w-full py-2.5 pl-10 pr-3 rounded-xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-inner"
          >
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
              <Info className="w-4 h-4" />
            </span>
            <span>Status: {selectedStatus}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStatusOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
          )}

          {isStatusOpen && (
            <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-[#090d16]/95 border border-white/10 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {statusList.map((stat) => {
                const isSelected = selectedStatus === stat;
                return (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(stat);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                    }`}
                  >
                    <span>{stat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Ticket List area */}
      <section className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden group hover:border-slate-800 transition-colors"
            >
              {/* Header border accent */}
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-purple-500/20 to-transparent" />
              
              <div className="space-y-3 flex-1">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-white/10 px-2 py-0.5 rounded-full text-slate-400">
                    {ticket.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ticket.date}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400/80 bg-purple-500/5 px-2 py-0.5 rounded-full border border-purple-500/10">
                    {ticket.category}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-extrabold text-slate-200 group-hover:text-slate-100 transition-colors flex items-center gap-1">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Action buttons & status/image container */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                {/* Status indicator */}
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Status</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                {/* Clickable Image Thumbnail */}
                {ticket.imageUrl && (
                  <div className="relative group/thumb cursor-pointer shrink-0" onClick={() => setActiveImageModal(ticket.imageUrl || null)}>
                    <img 
                      src={ticket.imageUrl} 
                      alt="Ref Thumbnail" 
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover/thumb:border-cyan-400/40 transition-all"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 rounded-xl flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-300">No complaints found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No tickets match your filter criteria or search keyword. Clear fields to start again.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Immersive Photo Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          {/* Dismiss Click Area overlay */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageModal(null)}></div>
          
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 max-w-3xl w-full max-h-[85vh] relative z-10 flex flex-col">
            <button 
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-3 bg-slate-950 flex items-center justify-center flex-1">
              <img 
                src={activeImageModal} 
                alt="Large Reference" 
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
