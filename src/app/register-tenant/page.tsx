'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../store/AuthContext';
import { tenantService } from '../../services/api';
import {
  X, User, Phone, Mail, MapPin, Users, IdCard, Briefcase,
  Calendar, IndianRupee, PiggyBank, ChevronDown, CheckCircle2,
  Clock, ShieldAlert, ShieldCheck, Layers, Home
} from 'lucide-react';

function RegisterTenantForm() {
  const { showToast } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract parameters from scanned QR code URL
  const hostelId = searchParams.get('hostelId');
  const token = searchParams.get('token');
  const expiresAtParam = searchParams.get('expiresAt');

  // Live countdown timer state (in milliseconds)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasExpired, setHasExpired] = useState(false);

  // Form states
  const [floorNumber, setFloorNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
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

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to clear error when field is updated
  const updateField = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (val: string) => {
    setter(val);
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!expiresAtParam) {
      return;
    }

    const calculateTimeLeft = () => {
      const targetDate = new Date(expiresAtParam);
      const currentDate = new Date();

      if (isNaN(targetDate.getTime())) {
        return 0;
      }

      const difference = targetDate.getTime() - currentDate.getTime();
      return difference > 0 ? difference : 0;
    };

    const initialLeft = calculateTimeLeft();
    setTimeLeft(initialLeft);
    if (initialLeft <= 0 || new Date(expiresAtParam) < new Date()) {
      setHasExpired(true);
    }

    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (left <= 0 || new Date(expiresAtParam) < new Date()) {
        setHasExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAtParam]);

  // Format time remaining (e.g. "14m 23s")
  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleRegister triggered');

    // Strict Field validations
    const validationErrors: Record<string, string> = {};

    const trimmedFloorNumber = floorNumber.trim();
    const trimmedRoomNumber = roomNumber.trim();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const trimmedParentPhone = parentPhone.trim();
    const trimmedAadharNumber = aadharNumber.trim().replace(/[\s-]/g, '');
    const trimmedOccupation = occupation.trim();
    const trimmedJoinedDate = joinedDate.trim();
    const trimmedMonthlyFee = monthlyFee.trim();
    const trimmedDeposit = deposit.trim();

    // 1. Floor Number
    if (!trimmedFloorNumber) {
      validationErrors.floorNumber = 'Floor number is required';
    } else if (!/^\d+$/.test(trimmedFloorNumber)) {
      validationErrors.floorNumber = 'Floor number must be a valid positive integer';
    }

    // 2. Room Number
    if (!trimmedRoomNumber) {
      validationErrors.roomNumber = 'Room number is required';
    }

    // 3. Name
    if (!trimmedName) {
      validationErrors.name = 'Full name is required';
    } else if (trimmedName.length < 3) {
      validationErrors.name = 'Name must be at least 3 characters long';
    } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      validationErrors.name = 'Name must contain only letters and spaces';
    }

    // 4. Phone
    if (!trimmedPhone) {
      validationErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      validationErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    // 5. Email
    if (!trimmedEmail) {
      validationErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // 6. Address
    if (!trimmedAddress) {
      validationErrors.address = 'Permanent address is required';
    } else if (trimmedAddress.length < 10) {
      validationErrors.address = 'Address must be at least 10 characters long';
    }

    // 7. Parent Phone
    if (!trimmedParentPhone) {
      validationErrors.parentPhone = 'Parent/Guardian contact number is required';
    } else if (!/^[6-9]\d{9}$/.test(trimmedParentPhone)) {
      validationErrors.parentPhone = 'Please enter a valid 10-digit mobile number';
    } else if (trimmedPhone === trimmedParentPhone) {
      validationErrors.parentPhone = 'Parent contact must be different from tenant contact';
    }

    // 8. Aadhaar Card
    if (!trimmedAadharNumber) {
      validationErrors.aadharNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(trimmedAadharNumber)) {
      validationErrors.aadharNumber = 'Aadhaar card must be exactly 12 digits';
    }

    // 9. Occupation
    if (!trimmedOccupation) {
      validationErrors.occupation = 'Occupation is required';
    }

    // 10. Joined Date
    if (!trimmedJoinedDate) {
      validationErrors.joinedDate = 'Joined date is required';
    } else if (isNaN(Date.parse(trimmedJoinedDate))) {
      validationErrors.joinedDate = 'Please enter a valid date';
    }

    // 11. Monthly Fee
    if (!trimmedMonthlyFee) {
      validationErrors.monthlyFee = 'Monthly fee is required';
    } else {
      const fee = parseFloat(trimmedMonthlyFee);
      if (isNaN(fee) || fee <= 0) {
        validationErrors.monthlyFee = 'Monthly fee must be a positive number greater than 0';
      }
    }

    // 12. Deposit
    if (!trimmedDeposit) {
      validationErrors.deposit = 'Deposit is required';
    } else {
      const dep = parseFloat(trimmedDeposit);
      if (isNaN(dep) || dep < 0) {
        validationErrors.deposit = 'Deposit must be a valid non-negative number';
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus on the first invalid input element
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
      const firstErrorMessage = Object.values(validationErrors)[0];
      console.warn('Form validation failed:', validationErrors);
      showToast(firstErrorMessage, 'error');
      return;
    }

    setErrors({});
    console.log('Validation passed. Starting registration process...');
    setIsSubmitting(true);
    try {
      // Format Aadhaar nicely as 1234-5678-9012 for the backend API
      const formattedAadhaar = trimmedAadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');

      // Send registration data along with JWT authorization token from QR params
      await tenantService.register({
        floorNumber: parseInt(trimmedFloorNumber, 10),
        roomNumber: trimmedRoomNumber,
        name: trimmedName,
        phoneNumber: trimmedPhone,
        email: trimmedEmail,
        address: trimmedAddress,
        parentNumber: trimmedParentPhone,
        aadhaarNumber: formattedAadhaar,
        occupation: trimmedOccupation,
        joinedDate: trimmedJoinedDate,
        monthlyFee: parseFloat(trimmedMonthlyFee),
        deposit: parseFloat(trimmedDeposit)
      }, token || undefined);

      showToast('Registration Successful!', 'success');
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration failed with error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed, please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Missing Parameter Error State
  if (!hostelId || !token || !expiresAtParam) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <X className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-200">Invalid Registration Link</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            This QR code link is malformed or invalid. Please scan the QR code provided in the Admin Portal to register.
          </p>
        </div>
      </div>
    );
  }

  // 2. Link Expired Warning — show banner but still allow submit (backend is the authority)
  const isExpiredWarning = hasExpired || (timeLeft !== null && timeLeft <= 0);

  // 3. Success State
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-100">Registration Complete!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your details have been successfully submitted to the hostel management system.
          </p>
          <div className="p-4 bg-[#0a0f1d]/80 border border-white/5 rounded-2xl text-xs text-slate-300 font-medium leading-relaxed mt-4">
            After the administrator reviews and accepts your profile, your login credentials will be emailed to you.
          </div>
        </div>
        <p className="text-xs font-bold text-slate-500 pt-4 border-t border-white/5">
          You may now close this page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">

      {/* Top Header Navigation */}
      <div className="flex flex-col items-center justify-center border-b border-white/5 pb-5 space-y-2">
        <h1 className="text-xl font-black text-slate-100 tracking-tight text-center">
          Tenant Registration
        </h1>

        {/* Real-time Token Expiry Indicator */}
        {timeLeft !== null && !isExpiredWarning && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/5 border border-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span>Link Expires In: {formatTimeLeft(timeLeft)}</span>
          </div>
        )}
        {isExpiredWarning && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Link expired — you can still try submitting</span>
          </div>
        )}
      </div>

      {/* Hostel ID Banner Card */}
      <div className="flex items-center justify-center gap-3 p-4 bg-[#0a0f1d]/90 border border-white/5 rounded-2xl">
        <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">TENORA QR Authorization</h4>
          {/* <p className="text-[11px] text-slate-400 font-mono break-all leading-relaxed">
            Hostel ID: {hostelId}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            You are registering using a verified administrative token.
          </p> */}
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-6" noValidate>

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
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Floor Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Layers className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 1"
                  value={floorNumber}
                  id="floorNumber"
                  name="floorNumber"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      updateField(setFloorNumber, 'floorNumber')(val);
                    }
                  }}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.floorNumber ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.floorNumber && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.floorNumber}
                </p>
              )}
            </div>

            {/* Choose Room */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Room Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Home className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. 101"
                  value={roomNumber}
                  id="roomNumber"
                  name="roomNumber"
                  onChange={(e) => updateField(setRoomNumber, 'roomNumber')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.roomNumber ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.roomNumber && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.roomNumber}
                </p>
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
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  id="name"
                  name="name"
                  onChange={(e) => updateField(setName, 'name')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.name ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  id="phone"
                  name="phone"
                  onChange={(e) => updateField(setPhone, 'phone')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.phone ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  id="email"
                  name="email"
                  onChange={(e) => updateField(setEmail, 'email')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.email ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 pt-3.5 flex items-start text-slate-500 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </span>
                <textarea
                  placeholder="Permanent Address"
                  rows={2}
                  value={address}
                  id="address"
                  name="address"
                  onChange={(e) => updateField(setAddress, 'address')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold resize-none ${
                    errors.address ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.address}
                </p>
              )}
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
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Users className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  placeholder="Parent / Guardian Contact Number"
                  value={parentPhone}
                  id="parentPhone"
                  name="parentPhone"
                  onChange={(e) => updateField(setParentPhone, 'parentPhone')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.parentPhone ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.parentPhone && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.parentPhone}
                </p>
              )}
            </div>

            {/* Aadhar Card Number */}
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <IdCard className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="12-Digit Aadhar Card Number"
                  value={aadharNumber}
                  id="aadharNumber"
                  name="aadharNumber"
                  onChange={(e) => updateField(setAadharNumber, 'aadharNumber')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.aadharNumber ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.aadharNumber && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.aadharNumber}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  <Briefcase className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Occupation (e.g. Student, Software Developer)"
                  value={occupation}
                  id="occupation"
                  name="occupation"
                  onChange={(e) => updateField(setOccupation, 'occupation')(e.target.value)}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                    errors.occupation ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.occupation && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.occupation}
                </p>
              )}
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
                  id="joinedDate"
                  name="joinedDate"
                  onChange={(e) => updateField(setJoinedDate, 'joinedDate')(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold cursor-pointer ${
                    errors.joinedDate ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.joinedDate && (
                <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                  {errors.joinedDate}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Monthly Rent */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                    <IndianRupee className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    placeholder="Monthly Fee"
                    value={monthlyFee}
                    id="monthlyFee"
                    name="monthlyFee"
                    onChange={(e) => updateField(setMonthlyFee, 'monthlyFee')(e.target.value)}
                    className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                      errors.monthlyFee ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.monthlyFee && (
                  <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                    {errors.monthlyFee}
                  </p>
                )}
              </div>

              {/* Deposit */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                    <PiggyBank className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    placeholder="Deposit"
                    value={deposit}
                    id="deposit"
                    name="deposit"
                    onChange={(e) => updateField(setDeposit, 'deposit')(e.target.value)}
                    className={`w-full py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 text-xs bg-slate-950/80 border hover:border-purple-500/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all font-semibold ${
                      errors.deposit ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.deposit && (
                  <p className="text-[10px] font-bold text-rose-400 pl-1 mt-1">
                    {errors.deposit}
                  </p>
                )}
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
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${paymentStatus === 'Pending'
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
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${paymentStatus === 'Paid'
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
              <span>Submitting Profile...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>Submit Registration</span>
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
