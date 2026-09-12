import React, { useState } from 'react';
import type { Worker } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera, 
  ArrowRight
} from 'lucide-react';

interface RequestServiceModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({ worker, onClose }) => {
  const { userProfile, createServiceRequest, setActiveView } = useApp();

  const [selectedServiceItem, setSelectedServiceItem] = useState<string>(worker?.priceList[0]?.item || worker?.serviceName || '');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('Today');
  const [preferredTime, setPreferredTime] = useState<string>('Immediate (Under 30 mins)');
  const [addressDetails, setAddressDetails] = useState<string>(userProfile.addressDetails || 'Green Acres Flat 3B, Edappally');
  const [phone, setPhone] = useState<string>(userProfile.phone || '+91 98950 11223');
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);

  if (!worker) return null;

  // Selected price calculation
  const matchedPriceItem = worker.priceList.find(p => p.item === selectedServiceItem);
  const estimatedPrice = matchedPriceItem ? matchedPriceItem.price : worker.startingPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createServiceRequest({
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceCategory: worker.serviceCategory,
      serviceTitle: selectedServiceItem,
      userName: userProfile.name || 'Resident',
      userPhone: phone,
      cityDistrict: userProfile.cityDistrict,
      locality: userProfile.locality,
      livingSituation: userProfile.livingSituation,
      addressDetails,
      problemDescription: problemDescription || `Requesting service for ${selectedServiceItem}.`,
      preferredDate,
      preferredTime,
      estimatedPrice,
      isEmergency: false
    });

    onClose();
    setActiveView('requests');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Requesting Service</span>
              <h3 className="text-xl font-black text-white">{worker.name}</h3>
              <p className="text-xs text-slate-300">{worker.serviceName}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Specific Task Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Specific Service / Task
            </label>
            <select
              value={selectedServiceItem}
              onChange={e => setSelectedServiceItem(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {worker.priceList.map((p, idx) => (
                <option key={idx} value={p.item}>
                  {p.item} — ₹{p.price}
                </option>
              ))}
              <option value={worker.serviceName}>General Inspection / Custom Job — From ₹{worker.startingPrice}</option>
            </select>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Problem Details / Instructions
            </label>
            <textarea
              rows={3}
              required
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="e.g. Washbasin tap leaking continuously in flat 3B, please bring replacement washer."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Date
              </label>
              <select
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Day after Tomorrow">Day after Tomorrow</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Immediate">Immediate (Under 30 mins)</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          {/* Location & Contact Phone */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Service Address / Flat Details
              </label>
              <input
                type="text"
                required
                value={addressDetails}
                onChange={e => setAddressDetails(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Contact Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Mock Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Attach Photo of Problem (Optional)
            </label>
            <button
              type="button"
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className={`w-full p-3 rounded-xl border border-dashed text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                photoUploaded
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{photoUploaded ? '✓ Photo Attached (tap_leak.jpg)' : '+ Upload Photo of Leak/Damage'}</span>
            </button>
          </div>

          {/* Price Summary */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-900 font-medium block">Estimated Price</span>
              <span className="text-[11px] text-amber-700">Pay directly to worker after completion</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900">₹{estimatedPrice}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Submit Service Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
