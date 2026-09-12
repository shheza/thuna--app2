import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICTS_CITIES, LOCALITIES_BY_DISTRICT, CATEGORIES } from '../data/initialData';
import type { AccountType, ServiceCategory } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  User, 
  Briefcase, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    authModalRole,
    setAuthModalRole,
    registerClient,
    registerWorker,
    login,
    loginAsDemo,
    workers
  } = useApp();

  // Tab State: 'signup' | 'login'
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  
  // Selected Role for Signup: null | 'client' | 'worker'
  const [selectedRole, setSelectedRole] = useState<AccountType | null>(null);

  // Common Auth States
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Client Form States
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientDistrict, setClientDistrict] = useState<string>(DISTRICTS_CITIES[0]);
  const [clientLocality, setClientLocality] = useState<string>(LOCALITIES_BY_DISTRICT[DISTRICTS_CITIES[0]][0]);
  const [livingSituation, setLivingSituation] = useState<'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel'>('Shared Apartment');
  const [addressDetails, setAddressDetails] = useState<string>('');

  // Worker Form States
  const [workerName, setWorkerName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('plumbing');
  const [workerPhone, setWorkerPhone] = useState<string>('');
  const [workerWhatsapp, setWorkerWhatsapp] = useState<string>('');
  const [workerEmail, setWorkerEmail] = useState<string>('');
  const [workerDistrict, setWorkerDistrict] = useState<string>(DISTRICTS_CITIES[0]);
  const [workerLocality, setWorkerLocality] = useState<string>(LOCALITIES_BY_DISTRICT[DISTRICTS_CITIES[0]][0]);
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [startingPrice, setStartingPrice] = useState<number>(150);
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState<boolean>(true);
  const [bio, setBio] = useState<string>('');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginRole, setLoginRole] = useState<AccountType>('client');

  // Sync initial mode & role from Context
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalMode);
      setSelectedRole(authModalRole);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalMode, authModalRole]);

  if (!isAuthModalOpen) return null;

  const currentClientLocalities = LOCALITIES_BY_DISTRICT[clientDistrict] || ['Central Town'];
  const currentWorkerLocalities = LOCALITIES_BY_DISTRICT[workerDistrict] || ['Central Town'];

  const handleClientDistrictChange = (d: string) => {
    setClientDistrict(d);
    const locs = LOCALITIES_BY_DISTRICT[d] || ['Central Town'];
    setClientLocality(locs[0]);
  };

  const handleWorkerDistrictChange = (d: string) => {
    setWorkerDistrict(d);
    const locs = LOCALITIES_BY_DISTRICT[d] || ['Central Town'];
    setWorkerLocality(locs[0]);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Handle Client Signup Submission
  const handleClientSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    triggerConfetti();
    setSuccessMsg('Account created successfully! Welcome to Thuna.');

    setTimeout(() => {
      registerClient({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim(),
        password,
        cityDistrict: clientDistrict,
        locality: clientLocality,
        livingSituation,
        addressDetails: addressDetails.trim() || `${livingSituation} in ${clientLocality}`
      });
    }, 600);
  };

  // Handle Worker Signup Submission
  const handleWorkerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!workerName.trim() || !workerPhone.trim()) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    triggerConfetti();
    setSuccessMsg('Worker registered successfully! Redirecting to Worker Dashboard...');

    setTimeout(() => {
      registerWorker({
        name: workerName.trim(),
        businessName: businessName.trim() || undefined,
        serviceCategory,
        phone: workerPhone.trim(),
        whatsapp: workerWhatsapp.trim() || workerPhone.trim(),
        email: workerEmail.trim(),
        password,
        cityDistrict: workerDistrict,
        locality: workerLocality,
        experienceYears: Number(experienceYears) || 3,
        startingPrice: Number(startingPrice) || 150,
        isEmergencyAvailable,
        bio: bio.trim() || `Verified local ${serviceCategory} specialist serving ${workerLocality} and nearby residential areas.`
      });
    }, 600);
  };

  // Handle Standard Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please provide your phone number or email address.');
      return;
    }

    triggerConfetti();
    setSuccessMsg('Signed in successfully!');

    setTimeout(() => {
      login(loginIdentifier.trim(), loginRole, loginPassword);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] relative">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 relative">
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm shadow-amber-500/30">
              th<span className="text-white">.</span>
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                Thuna Account Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {activeTab === 'signup' 
                  ? (!selectedRole ? 'Join the Local Network' : selectedRole === 'client' ? 'Resident / Student Sign Up' : 'Service Worker Registration')
                  : 'Welcome Back to Thuna'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-normal max-w-md">
            {activeTab === 'signup'
              ? 'Connect directly with trusted local contacts, emergency repairs, and verified community professionals.'
              : 'Log in to track your service requests, contact saved workers, or manage your service jobs.'}
          </p>

          {/* Mode Tabs (Sign Up vs Sign In) */}
          <div className="mt-5 flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 max-w-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: SIGN UP FLOW */}
          {/* ========================================================================= */}
          {activeTab === 'signup' && (
            <>
              {/* STEP 1: SELECT ROLE (Client vs Worker) */}
              {!selectedRole ? (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      How would you like to use Thuna?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose your account type to personalize your experience
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option 1: Resident / Client */}
                    <div 
                      onClick={() => {
                        setSelectedRole('client');
                        setAuthModalRole('client');
                      }}
                      className="group cursor-pointer bg-slate-50 hover:bg-amber-50/60 p-5 rounded-3xl border-2 border-slate-200 hover:border-amber-500 transition-all flex flex-col justify-between shadow-xs hover:shadow-md text-left"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700">
                              Client / Resident
                            </h4>
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            For Students & Renters
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Looking for trusted local plumbers, electricians, locksmiths, and technicians for your flat, PG, or hostel.
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/80 space-y-1.5">
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>Direct Call & WhatsApp (0% Middlemen)</span>
                        </div>
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>1-Tap Emergency SOS Dispatch</span>
                        </div>
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>Save trusted workers to personal rolodex</span>
                        </div>

                        <button
                          type="button"
                          className="w-full mt-3 py-2.5 bg-slate-900 group-hover:bg-amber-500 text-white group-hover:text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <span>Sign Up as Resident</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Option 2: Worker / Service Professional */}
                    <div 
                      onClick={() => {
                        setSelectedRole('worker');
                        setAuthModalRole('worker');
                      }}
                      className="group cursor-pointer bg-slate-50 hover:bg-slate-900/5 p-5 rounded-3xl border-2 border-slate-200 hover:border-slate-800 transition-all flex flex-col justify-between shadow-xs hover:shadow-md text-left"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base group-hover:text-slate-950">
                            Service Worker
                          </h4>
                          <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Technicians & Tradespeople
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Provide plumbing, electrical, carpentry, AC, or key services to local residents without losing commission fees.
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/80 space-y-1.5">
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>0% commission on any job</span>
                        </div>
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>Direct job dispatch & notifications</span>
                        </div>
                        <div className="flex items-center text-[11px] text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                          <span>Instant Verified Provider Badge</span>
                        </div>

                        <button
                          type="button"
                          className="w-full mt-3 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-slate-800 transition-colors"
                        >
                          <span>Sign Up as Worker</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-amber-700 font-bold hover:underline"
                      >
                        Sign In here
                      </button>
                    </p>
                  </div>
                </div>
              ) : selectedRole === 'client' ? (
                /* ========================================================================= */
                /* STEP 2A: CLIENT (RESIDENT / STUDENT) SIGNUP FORM */
                /* ========================================================================= */
                <form onSubmit={handleClientSignup} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Role (Currently: Resident)</span>
                    </button>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Resident Account
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="e.g. Alex Thomas or Ananya P."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={e => setClientPhone(e.target.value)}
                          placeholder="+91 98950 11223"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={e => setClientEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location (City/District + Locality) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City / District *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={clientDistrict}
                          onChange={e => handleClientDistrictChange(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          {DISTRICTS_CITIES.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Locality / Neighborhood *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={clientLocality}
                          onChange={e => setClientLocality(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          {currentClientLocalities.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Living Situation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Living Situation *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { type: 'Shared Apartment', label: 'Flat / Apt', icon: '🏢' },
                        { type: 'PG', label: 'Paying Guest', icon: '🏠' },
                        { type: 'Single Flat', label: 'Single Flat', icon: '🏬' },
                        { type: 'Hostel', label: 'Hostel', icon: '🏫' }
                      ].map(item => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setLivingSituation(item.type as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            livingSituation === item.type
                              ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold ring-2 ring-amber-500/30'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <span className="text-base block mb-0.5">{item.icon}</span>
                          <span className="text-[11px] leading-tight block">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Apartment / PG / Room Details
                    </label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={e => setAddressDetails(e.target.value)}
                      placeholder="e.g. Skyline Apartments Flat 4B, or St. Joseph Men's PG Room 102"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Resident Registration & Enter</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* ========================================================================= */
                /* STEP 2B: WORKER / SERVICE PROFESSIONAL SIGNUP FORM */
                /* ========================================================================= */
                <form onSubmit={handleWorkerSignup} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Role (Currently: Service Worker)</span>
                    </button>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Pro Provider</span>
                    </span>
                  </div>

                  {/* Worker Name & Trade / Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={workerName}
                          onChange={e => setWorkerName(e.target.value)}
                          placeholder="e.g. Suresh Kumar"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Trade / Business Title
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        placeholder="e.g. Suresh Electrical & AC Works"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* Trade Category & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Service Trade Category *
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={e => setServiceCategory(e.target.value as ServiceCategory)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} {cat.emergencySupported ? '⚡ (Emergency)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Experience
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={experienceYears}
                          onChange={e => setExperienceYears(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Base Visit (₹)
                        </label>
                        <input
                          type="number"
                          min="50"
                          step="20"
                          value={startingPrice}
                          onChange={e => setStartingPrice(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Phone & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={workerPhone}
                          onChange={e => setWorkerPhone(e.target.value)}
                          placeholder="+91 98470 54321"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={workerWhatsapp}
                        onChange={e => setWorkerWhatsapp(e.target.value)}
                        placeholder="Same as phone if blank"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* District & Primary Locality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City / District *
                      </label>
                      <select
                        value={workerDistrict}
                        onChange={e => handleWorkerDistrictChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        {DISTRICTS_CITIES.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Base Locality / Area *
                      </label>
                      <select
                        value={workerLocality}
                        onChange={e => setWorkerLocality(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        {currentWorkerLocalities.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Emergency Toggle */}
                  <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Available for Emergency / Night Calls?
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Receive priority urgent dispatch from locked out or leak emergencies
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEmergencyAvailable}
                        onChange={e => setIsEmergencyAvailable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Short Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Short Bio / Services Provided
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="e.g. 5+ years experience repairing tap leaks, motor issues, washbasin piping with guaranteed quality."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-black py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span>Register As Verified Worker & Open Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SIGN IN / LOGIN FLOW */}
          {/* ========================================================================= */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Role Switcher for Login */}
              <div className="flex items-center justify-center space-x-3 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setLoginRole('client')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    loginRole === 'client'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Resident / Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('worker')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    loginRole === 'worker'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Service Worker</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {loginRole === 'client' ? 'Phone Number or Email' : 'Registered Worker Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder={loginRole === 'client' ? '+91 98950 11223 or user@gmail.com' : '+91 98470 12345 (Rahul K.)'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <span>Sign In to Thuna</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  ⚡ Or Try Instant 1-Click Demo Accounts
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerConfetti();
                      loginAsDemo('client');
                    }}
                    className="p-3 bg-slate-50 hover:bg-amber-50 rounded-2xl border border-slate-200 hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">👤</span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Alex Thomas</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Resident Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerConfetti();
                      loginAsDemo('worker', 'w1');
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-200 hover:border-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">🔧</span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-400">Rahul K.</span>
                    </div>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-300 block">Plumber Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerConfetti();
                      loginAsDemo('worker', 'w2');
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-200 hover:border-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">⚡</span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-400">Anwar</span>
                    </div>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-300 block">Electrician Demo</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setSelectedRole(null);
                    }}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Create a Client or Worker Account
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
