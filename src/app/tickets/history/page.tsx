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
        return 'text-amber-700 border-amber-200 bg-amber-50';
      case 'In Progress':
        return 'text-blue-700 border-blue-200 bg-blue-50';
      case 'Resolved':
        return 'text-emerald-700 border-emerald-200 bg-emerald-50';
      default:
        return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f3b75] tracking-tight">
            Support Ticket History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Monitor and track status of all raised complaints.
          </p>
        </div>
        
        <Link 
          href="/tickets/raise"
          className="py-2.5 px-4 rounded-xl bg-[#0f3b75] hover:bg-[#0c2f5d] text-white font-bold text-xs shadow-sm transition-colors text-center"
        >
          Raise New Ticket +
        </Link>
      </div>

      {/* Search & Filter bar panel */}
      <section className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Keyword Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#0f3b75] pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tickets by subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl text-[#0f3b75] text-xs glow-input bg-white"
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
            className="w-full py-2.5 pl-10 pr-3 rounded-xl text-[#0f3b75] text-xs bg-white border border-slate-200 hover:border-[#0f3b75]/30 focus:border-[#0f3b75] focus:ring-2 focus:ring-[#0f3b75]/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-sm"
          >
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#0f3b75] pointer-events-none">
              <Filter className="w-4 h-4" />
            </span>
            <span>Category: {selectedCategory}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#0f3b75] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
          )}

          {isCategoryOpen && (
            <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
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
                        ? 'bg-[#f0f4f8] text-[#0f3b75] border border-[#0f3b75]/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0f3b75] border border-transparent'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0f3b75]" />}
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
            className="w-full py-2.5 pl-10 pr-3 rounded-xl text-[#0f3b75] text-xs bg-white border border-slate-200 hover:border-[#0f3b75]/30 focus:border-[#0f3b75] focus:ring-2 focus:ring-[#0f3b75]/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-sm"
          >
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#0f3b75] pointer-events-none">
              <Info className="w-4 h-4" />
            </span>
            <span>Status: {selectedStatus}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#0f3b75] transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStatusOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
          )}

          {isStatusOpen && (
            <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
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
                        ? 'bg-[#f0f4f8] text-[#0f3b75] border border-[#0f3b75]/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0f3b75] border border-transparent'
                    }`}
                  >
                    <span>{stat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0f3b75]" />}
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
              className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden group hover:border-blue-200 transition-colors"
            >
              <div className="space-y-3 flex-1">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[#0f3b75]">
                    {ticket.id}
                  </span>
                  <span className="text-[10px] font-bold text-[#0f3b75] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ticket.date}
                  </span>
                  <span className="text-[10px] font-bold text-[#0f3b75] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {ticket.category}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-extrabold text-[#0f3b75] transition-colors flex items-center gap-1">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Action buttons & status/image container */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
                {/* Status indicator */}
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] text-[#0f3b75] font-bold uppercase tracking-wider block mb-1">Status</span>
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
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover/thumb:border-[#0f3b75]/40 transition-all"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 rounded-xl flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="glass-panel p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0f3b75]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0f3b75]">No complaints found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No tickets match your filter criteria or search keyword. Clear fields to start again.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Immersive Photo Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          {/* Dismiss Click Area overlay */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageModal(null)}></div>
          
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] relative z-10 flex flex-col">
            <button 
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-[#0f3b75] transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-3 bg-slate-100 flex items-center justify-center flex-1">
              <img 
                src={activeImageModal} 
                alt="Large Reference" 
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
