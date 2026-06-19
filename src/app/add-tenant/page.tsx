'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../store/AuthContext';
import { tenantService } from '../../services/api';
import { 
  X, User, Phone, Mail, MapPin, Users, IdCard, Briefcase, 
  Calendar, IndianRupee, PiggyBank, ChevronDown, CheckCircle2 
} from 'lucide-react';

function RegisterTenantForm() {
  const { showToast } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // QR Code scan security guard
  const isQrScanned = searchParams.get('qr') === 'true' || searchParams.get('source') === 'qr';

  // Form states
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [joinedDate, setJoinedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyFee, setMonthlyFee] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Paid'>('Pending');

  // Custom Dropdown Open states
  const [isFloorOpen, setIsFloorOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const floors = ['1st Floor', '2nd Floor', '3rd Floor'];
  const roomsByFloor: Record<string, string[]> = {
    '1st Floor': ['Room 101 (Non-AC)', 'Room 102 (AC)', 'Room 103 (Non-AC)'],
    '2nd Floor': ['Room 201 (Non-AC)', 'Room 202 (AC)', 'Room 203 (AC)'],
    '3rd Floor': ['Room 301 (AC)', 'Room 302 (AC)', 'Room 303 (AC)', 'Room 304 (AC)']
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Field validations
    if (!floor || !room || !name || !phone || !email || !address || !parentPhone || !aadharNumber || !occupation || !monthlyFee || !deposit) {
      showToast('Please fill all the details to register', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const floorNumber = floor === '1st Floor' ? 1 : floor === '2nd Floor' ? 2 : 3;
      const roomNumber = room.replace('Room ', '').split(' ')[0] || room;
      
      // Send registration data to the backend DB via tenantService API layer
      await tenantService.register({
        floorNumber,
        roomNumber,
        name,
        phoneNumber: phone,
        email,
        address,
        parentNumber: parentPhone,
        aadhaarNumber: aadharNumber,
        occupation,
        joinedDate,
        monthlyFee: parseFloat(monthlyFee),
        deposit: parseFloat(deposit)
      });
      showToast('Registration Successful!', 'success');
      
      setIsSuccess(true);
    } catch (err: any) {
      showToast(err.message || 'Registration failed, please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isQrScanned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
          <X className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-200">Invalid Registration Link</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">Please scan the QR code provided in the Owner App to register as a new tenant.</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-100">Registration Complete!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your details have been successfully submitted to the hostel management system.
          </p>
          <div className="p-4 bg-[#0a0f1d]/80 border border-white/5 rounded-2xl text-xs text-slate-300 font-medium leading-relaxed mt-4">
            After we accept your registration, you will receive the login credentials to your email. Please login to the website to see your details.
          </div>
        </div>
        <p className="text-xs font-bold text-slate-500 pt-4 border-t border-white/5">
          You may now close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-center border-b border-white/5 pb-4">
        <h1 className="text-lg font-extrabold text-slate-100 tracking-tight text-center">
          Register Tenant
        </h1>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        
        {/* SECTION 1: Room Assignment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-cyan-400 rounded-full" />
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Room Assignment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Choose Floor */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Choose Floor
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setIsFloorOpen(!isFloorOpen);
                  setIsRoomOpen(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all flex items-center justify-between font-semibold shadow-inner"
              >
                <span>{floor || 'Select Floor'}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isFloorOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFloorOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFloorOpen(false)} />
                  <div className="absolute z-50 mt-2 w-full rounded-2xl bg-[#090d16]/95 border border-white/10 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    {floors.map((fl) => {
                      const isSelected = floor === fl;
                      return (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => {
                            setFloor(fl);
                            setRoom(''); // reset room
                            setIsFloorOpen(false);
                          }}
                          className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                              : 'text-slate-300 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                          }`}
                        >
                          <span>{fl}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Choose Room */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Choose Room
              </label>

              <button
                type="button"
                onClick={() => {
                  if (!floor) {
                    showToast('Please select a floor first', 'info');
                    return;
                  }
                  setIsRoomOpen(!isRoomOpen);
                  setIsFloorOpen(false);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs border focus:ring-2 transition-all flex items-center justify-between font-semibold shadow-inner ${
                  !floor 
                    ? 'bg-slate-950/40 border-white/5 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-950/80 border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/10 text-slate-200 cursor-pointer'
                }`}
                disabled={!floor}
              >
                <span>{room || (floor ? 'Select Room' : 'Select floor first...')}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isRoomOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoomOpen && floor && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRoomOpen(false)} />
                  <div className="absolute z-50 mt-2 w-full rounded-2xl bg-[#090d16]/95 border border-white/10 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    {roomsByFloor[floor].map((rm) => {
                      const isSelected = room === rm;
                      return (
                        <button
                          key={rm}
                          type="button"
                          onClick={() => {
                            setRoom(rm);
                            setIsRoomOpen(false);
                          }}
                          className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                              : 'text-slate-300 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                          }`}
                        >
                          <span>{rm}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 2: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-cyan-400 rounded-full" />
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Personal Information
            </h3>
          </div>

          <div className="space-y-3.5">
            {/* Name */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            {/* Address */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 pt-3.5 flex items-start text-slate-500 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </span>
              <textarea
                placeholder="Address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Identification & Family */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-cyan-400 rounded-full" />
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Identification & Family
            </h3>
          </div>

          <div className="space-y-3.5">
            {/* Parent Number */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Users className="w-4 h-4" />
              </span>
              <input
                type="tel"
                placeholder="Parent Number"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            {/* Aadhar Card Number */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <IdCard className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Aadhar Card Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            {/* Occupation */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Briefcase className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Lease Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-cyan-400 rounded-full" />
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Lease Details
            </h3>
          </div>

          <div className="space-y-3.5">
            {/* Joined Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block">
                Joined Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  value={joinedDate}
                  onChange={(e) => setJoinedDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Monthly Fee */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <IndianRupee className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  placeholder="Monthly Fee"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                  required
                />
              </div>

              {/* Deposit */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <PiggyBank className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  placeholder="Deposit"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border border-white/10 hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Initial Payment Status */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block">
            Initial Payment Status
          </label>
          
          <div className="flex items-center gap-6 pl-1">
            {/* Pending option */}
            <label className="flex items-center gap-2.5 cursor-pointer group text-xs font-semibold text-slate-300">
              <input
                type="radio"
                name="paymentStatus"
                value="Pending"
                checked={paymentStatus === 'Pending'}
                onChange={() => setPaymentStatus('Pending')}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                paymentStatus === 'Pending' 
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                  : 'border-white/10 bg-slate-950/60 group-hover:border-white/20'
              }`}>
                {paymentStatus === 'Pending' && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-scale-up" />}
              </span>
              <span>Pending</span>
            </label>

            {/* Paid option */}
            <label className="flex items-center gap-2.5 cursor-pointer group text-xs font-semibold text-slate-300">
              <input
                type="radio"
                name="paymentStatus"
                value="Paid"
                checked={paymentStatus === 'Paid'}
                onChange={() => setPaymentStatus('Paid')}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                paymentStatus === 'Paid' 
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                  : 'border-white/10 bg-slate-950/60 group-hover:border-white/20'
              }`}>
                {paymentStatus === 'Paid' && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-scale-up" />}
              </span>
              <span>Paid</span>
            </label>
          </div>
        </div>

        {/* Submit Register Tenant */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 disabled:opacity-55 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
              <span>Registering Tenant...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>Register Tenant</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}

export default function RegisterTenantPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin"></div>
      </div>
    }>
      <RegisterTenantForm />
    </Suspense>
  );
}
