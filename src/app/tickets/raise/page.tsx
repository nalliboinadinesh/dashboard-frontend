'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../store/AuthContext';
import { TicketCategory } from '../../../types';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RaiseTicketPage() {
  const { raiseTicket, showToast } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Electrical');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const categories: TicketCategory[] = ['Electrical', 'Water', 'Cleaning', 'Internet', 'Furniture', 'Food', 'Bathroom', 'Other'];

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) return;

    setIsSubmitting(true);
    try {
      await raiseTicket(title, description, category, null);
      setTitle('');
      setDescription('');
      setTimeout(() => router.push('/tickets/history'), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      {/* Top Header & Back link */}
      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f3b75] tracking-tight">
            Raise Maintenance Complaint
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Submit a problem and our hostel staff will resolve it promptly.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Title */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#0f3b75] uppercase tracking-wider block">
              Complaint Subject / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Toilet flush not working, slow internet speed..."
              className="w-full py-3 px-4 rounded-xl text-[#0f3b75] text-sm glow-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Problem Category */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#0f3b75] uppercase tracking-wider block">
              Problem Category
            </label>
            <div className="relative">
              {/* Dropdown trigger button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-3.5 px-4 rounded-2xl text-[#0f3b75] text-sm bg-white border border-slate-200 hover:border-[#0f3b75]/30 focus:border-[#0f3b75] focus:ring-2 focus:ring-[#0f3b75]/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-sm"
                disabled={isSubmitting}
              >
                <span>{category}</span>
                <ChevronDown className={`w-4 h-4 text-[#0f3b75] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Click outside backdrop overlay to close dropdown */}
              {isOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)}
                />
              )}

              {/* Custom Options List Dropdown Bar */}
              {isOpen && (
                <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsOpen(false);
                        }}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between ${
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
          </div>

          {/* Detailed Problem Description */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#0f3b75] uppercase tracking-wider block">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full details of the issue including specific details (e.g. since when is it happening, exact error codes, specific bathroom details...)"
              className="w-full py-3 px-4 rounded-xl text-[#0f3b75] text-sm glow-input resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-[#0f3b75] hover:bg-[#0c2f5d] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            ) : (
              <>
                <span>Submit Complaint Ticket</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
