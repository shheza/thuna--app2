import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICTS_CITIES, LOCALITIES_BY_DISTRICT } from '../data/initialData';
import type { UserProfile } from '../types';
import { Sparkles, MapPin, Building, CheckCircle2, User, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, completeOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userProfile.name || '');
  const [cityDistrict, setCityDistrict] = useState<string>(userProfile.cityDistrict || DISTRICTS_CITIES[0]);
  const [locality, setLocality] = useState<string>(userProfile.locality || LOCALITIES_BY_DISTRICT[DISTRICTS_CITIES[0]][0]);
  const [livingSituation, setLivingSituation] = useState<'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel'>(userProfile.livingSituation || 'Shared Apartment');
  const [addressDetails, setAddressDetails] = useState<string>(userProfile.addressDetails || '');
  const [phone, setPhone] = useState<string>(userProfile.phone || '');

  if (!isOpen) return null;

  const currentLocalities = LOCALITIES_BY_DISTRICT[cityDistrict] || ['Town Center', 'Central Area'];

  const handleDistrictChange = (d: string) => {
    setCityDistrict(d);
    const locs = LOCALITIES_BY_DISTRICT[d] || ['Town Center'];
    setLocality(locs[0]);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name: name || 'Resident',
      cityDistrict: cityDistrict || DISTRICTS_CITIES[0],
      locality: locality || currentLocalities[0],
      livingSituation,
      addressDetails: addressDetails || (livingSituation === 'Shared Apartment' ? 'Green Acres Flat 3B, Edappally' : 'Metro PG, Room 12'),
      phone: phone || '+91 98950 11223',
      isOnboarded: true
    };
    completeOnboarding(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Progress */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Location Personalization • Step {step} of 2</span>
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Skip
            </button>
          </div>
          <h3 className="text-xl font-bold text-white">
            {step === 1 ? 'Select your City / District & Locality' : 'Where do you live in your city?'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            We will prioritize trusted local workers recommended by young adults and residents in your neighborhood.
          </p>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-400 h-full transition-all duration-300" 
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-6 space-y-5 overflow-y-auto flex-1">
          {step === 1 ? (
            <>
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Alex Thomas"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* City / District Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City / District
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={cityDistrict}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  >
                    {DISTRICTS_CITIES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locality Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Locality / Neighborhood Area
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  >
                    {currentLocalities.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Continue to Living Situation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Living Situation Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  What is your living situation?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Shared Apartment', icon: '🏢', desc: 'Rented Flat / Apartment' },
                    { type: 'PG', icon: '🏠', desc: 'Paying Guest PG' },
                    { type: 'Single Flat', icon: '🏬', desc: 'Single Rented Flat' },
                    { type: 'Hostel', icon: '🏫', desc: 'Working Hostel' }
                  ].map(item => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setLivingSituation(item.type as any)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                        livingSituation === item.type
                          ? 'border-amber-500 bg-amber-50 text-slate-900 ring-2 ring-amber-500/30'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="font-bold text-xs">{item.type}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Room or Address Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Flat / PG Name & Address Details
                </label>
                <input
                  type="text"
                  required
                  value={addressDetails}
                  onChange={e => setAddressDetails(e.target.value)}
                  placeholder="e.g., Green Acres Flat 3B, Near Edappally Metro Station"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              {/* Contact Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone Number (For Worker Service)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g., +91 98950 11223"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl transition-all"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Personalize My Home</span>
                </button>
              </div>
            </>
          )}
        </form>

      </div>
    </div>
  );
};
