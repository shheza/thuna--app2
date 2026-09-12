import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICTS_CITIES, LOCALITIES_BY_DISTRICT } from '../data/initialData';
import { 
  X, 
  User, 
  MapPin, 
  Building, 
  Phone, 
  Home, 
  BookmarkCheck, 
  Clock, 
  Edit3, 
  Check, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    userProfile, 
    setUserProfile, 
    trustedWorkerIds, 
    requests, 
    reviews,
    resetDemoData 
  } = useApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [cityDistrict, setCityDistrict] = useState<string>(userProfile.cityDistrict);
  const [locality, setLocality] = useState<string>(userProfile.locality);
  const [livingSituation, setLivingSituation] = useState<'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel'>(userProfile.livingSituation);
  const [addressDetails, setAddressDetails] = useState<string>(userProfile.addressDetails);
  const [phone, setPhone] = useState<string>(userProfile.phone);

  if (!isOpen) return null;

  const currentLocalities = LOCALITIES_BY_DISTRICT[cityDistrict] || ['Central Area'];

  const handleDistrictChange = (d: string) => {
    setCityDistrict(d);
    const locs = LOCALITIES_BY_DISTRICT[d] || ['Central Area'];
    setLocality(locs[0]);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name,
      cityDistrict,
      locality,
      livingSituation,
      addressDetails,
      phone,
      isOnboarded: true
    });
    setIsEditing(false);
  };

  // Stats
  const userReviewsCount = reviews.filter(r => r.userName === userProfile.name).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto relative">
        
        {/* Header Cover */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-white">{userProfile.name}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Resident</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {userProfile.locality}, {userProfile.cityDistrict.split('(')[0].trim()}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Trusted Contacts</span>
              <span className="text-base font-extrabold text-amber-600 flex items-center justify-center space-x-1">
                <BookmarkCheck className="w-4 h-4 mr-0.5" />
                <span>{trustedWorkerIds.length}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Service Requests</span>
              <span className="text-base font-extrabold text-slate-900 flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 mr-0.5" />
                <span>{requests.length}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Reviews Posted</span>
              <span className="text-base font-extrabold text-emerald-600">
                {userReviewsCount}
              </span>
            </div>
          </div>

          {!isEditing ? (
            /* View Profile Mode */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Personal & Location Details
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Full Name</span>
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{userProfile.name}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>City / District</span>
                  </span>
                  <span className="font-bold text-slate-900">{userProfile.cityDistrict}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Locality / Area</span>
                  </span>
                  <span className="font-bold text-slate-900">{userProfile.locality}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <Home className="w-4 h-4 text-slate-400" />
                    <span>Living Situation</span>
                  </span>
                  <span className="font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md">
                    {userProfile.livingSituation}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <Home className="w-4 h-4 text-slate-400" />
                    <span>Address Details</span>
                  </span>
                  <span className="font-bold text-slate-900">{userProfile.addressDetails}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>Phone Number</span>
                  </span>
                  <span className="font-bold text-slate-900">{userProfile.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Profile Mode Form */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Edit Personal & Location Info
                </h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / District
                  </label>
                  <select
                    value={cityDistrict}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {DISTRICTS_CITIES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Locality / Area
                  </label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {currentLocalities.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Living Situation
                </label>
                <select
                  value={livingSituation}
                  onChange={e => setLivingSituation(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Shared Apartment">Shared Apartment / Rented Flat</option>
                  <option value="PG">PG (Paying Guest)</option>
                  <option value="Single Flat">Single Rented Flat</option>
                  <option value="Hostel">Working Hostel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address Details
                </label>
                <input
                  type="text"
                  required
                  value={addressDetails}
                  onChange={e => setAddressDetails(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Reset Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Close Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
