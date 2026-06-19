'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../../../store/AuthContext';
import { TicketCategory } from '../../../types';
import { Upload, Camera, Trash2, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RaiseTicketPage() {
  const { raiseTicket, showToast } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Electrical');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories: TicketCategory[] = ['Electrical', 'Water', 'Cleaning', 'Internet', 'Furniture', 'Food', 'Bathroom', 'Other'];

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear selected image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) return;

    setIsSubmitting(true);
    try {
      await raiseTicket(title, description, category, selectedFile);
      // Clean form on success
      setTitle('');
      setDescription('');
      removeImage();
      // Redirect to ticket history page after brief delay
      setTimeout(() => {
        router.push('/tickets/history');
      }, 1000);
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
          className="w-9 h-9 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Raise Maintenance Complaint
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit a problem and our hostel staff will resolve it promptly.
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Complaint Subject / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Toilet flush not working, slow internet speed..."
              className="w-full py-3 px-4 rounded-xl text-slate-100 text-sm glow-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Problem Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Problem Category
            </label>
            <div className="relative">
              {/* Dropdown trigger button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-3.5 px-4 rounded-2xl text-slate-200 text-sm bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-inner"
                disabled={isSubmitting}
              >
                <span>{category}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Click outside backdrop overlay to close dropdown */}
              {isOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)}
                />
              )}

              {/* Custom Options List Dropdown Bar with Rounded Boundaries */}
              {isOpen && (
                <div className="absolute z-50 mt-2.5 w-full rounded-2xl bg-[#090d16]/95 border border-white/10 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
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
                        className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
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
          </div>

          {/* Detailed Problem Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full details of the issue including specific details (e.g. since when is it happening, exact error codes, specific bathroom details...)"
              className="w-full py-3 px-4 rounded-xl text-slate-100 text-sm glow-input resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Image upload / Camera capture */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Upload Reference Photos
            </label>
            
            {imagePreview ? (
              /* Image preview */
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 p-2">
                <img 
                  src={imagePreview} 
                  alt="Reference Preview" 
                  className="w-full max-h-64 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-rose-500/80 hover:bg-rose-600 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* No image selected inputs */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard file picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-slate-300 text-sm font-semibold"
                >
                  <Upload className="w-5 h-5 text-cyan-400" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </button>

                {/* Mobile Camera capture */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-slate-900 transition-all text-slate-300 text-sm font-semibold"
                >
                  <Camera className="w-5 h-5 text-purple-400" />
                  <span>Camera Capture</span>
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-500 italic">
              * Support photo format: JPG, PNG, GIF. Max size: 5MB.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
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
