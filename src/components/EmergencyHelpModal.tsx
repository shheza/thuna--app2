import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Worker } from '../types';
import { 
  AlertTriangle, 
  X, 
  Droplets, 
  Zap, 
  Key, 
  Snowflake, 
  Car, 
  HelpCircle, 
  PhoneCall, 
  CheckCircle2
} from 'lucide-react';

const EMERGENCY_TYPES = [
  { id: 'water', label: 'Water Leakage / Pipe Burst', icon: <Droplets className="w-6 h-6 text-blue-500" />, cat: 'plumbing' },
  { id: 'power', label: 'Power Failure / Short Circuit', icon: <Zap className="w-6 h-6 text-amber-500" />, cat: 'electrical' },
  { id: 'locked', label: 'Locked Out of Flat / Room', icon: <Key className="w-6 h-6 text-violet-500" />, cat: 'locksmith' },
  { id: 'ac', label: 'AC / Appliance Emergency', icon: <Snowflake className="w-6 h-6 text-cyan-500" />, cat: 'ac_appliance' },
  { id: 'vehicle', label: 'Vehicle Breakdown / Puncture', icon: <Car className="w-6 h-6 text-red-500" />, cat: 'mechanic' },
  { id: 'other', label: 'Other Emergency Help', icon: <HelpCircle className="w-6 h-6 text-slate-500" />, cat: null }
];

export const EmergencyHelpModal: React.FC = () => {
  const { 
    isEmergencyModalOpen, 
    setIsEmergencyModalOpen, 
    workers, 
    createServiceRequest, 
    userProfile,
    setActiveView,
    triggerEmergencyAlert 
  } = useApp();

  const [selectedEmergency, setSelectedEmergency] = useState<typeof EMERGENCY_TYPES[0] | null>(null);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  if (!isEmergencyModalOpen) return null;

  const handleClose = () => {
    setIsEmergencyModalOpen(false);
    setSelectedEmergency(null);
    setIsDispatched(false);
  };

  // Find matching emergency workers
  const matchedWorkers = workers.filter(w => {
    if (!w.isEmergencyAvailable) return false;
    if (selectedEmergency && selectedEmergency.cat) {
      return w.serviceCategory === selectedEmergency.cat;
    }
    return true;
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const handleExpressDispatch = (worker: Worker) => {
    triggerEmergencyAlert({
      emergencyType: selectedEmergency?.label || 'Urgent Assistance Required',
      category: worker.serviceCategory,
      clientName: userProfile.name,
      phone: userProfile.phone,
      locality: userProfile.locality,
      address: userProfile.addressDetails
    });

    createServiceRequest({
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceCategory: worker.serviceCategory,
      serviceTitle: `EMERGENCY: ${selectedEmergency?.label || 'Urgent Help'}`,
      userName: userProfile.name,
      userPhone: userProfile.phone,
      cityDistrict: userProfile.cityDistrict,
      locality: userProfile.locality,
      livingSituation: userProfile.livingSituation,
      addressDetails: userProfile.addressDetails,
      problemDescription: `URGENT EMERGENCY: ${selectedEmergency?.label}. Immediate response requested at ${userProfile.addressDetails}.`,
      preferredDate: 'Today',
      preferredTime: 'Immediate Express (< 20 mins)',
      estimatedPrice: worker.startingPrice,
      isEmergency: true,
      emergencyType: selectedEmergency?.label
    });

    setIsDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col my-auto relative">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 p-6 text-white relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 bg-red-700/80 hover:bg-red-800 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded-md">
                15-Min Express Dispatch
              </span>
              <h3 className="text-2xl font-black text-white mt-1">EMERGENCY ASSISTANCE</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {isDispatched ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Emergency Dispatch Sent!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                The nearby emergency responder has been notified with your address details ({userProfile.addressDetails}).
              </p>
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-900 font-semibold">
                Estimated Worker Arrival: <span className="text-base font-extrabold text-red-600 ml-1">12-15 Minutes</span>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveView('requests');
                  }}
                  className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl text-xs"
                >
                  Track Emergency Status
                </button>
              </div>
            </div>
          ) : !selectedEmergency ? (
            <>
              <div className="text-center">
                <h4 className="text-lg font-extrabold text-slate-900">What happened?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Select your emergency type to view immediate available responders near {userProfile.locality}, {userProfile.cityDistrict.split('(')[0].trim()}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_TYPES.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedEmergency(item);
                      triggerEmergencyAlert({
                        emergencyType: item.label,
                        category: item.cat as any,
                        clientName: userProfile.name,
                        phone: userProfile.phone,
                        locality: userProfile.locality,
                        address: userProfile.addressDetails
                      });
                    }}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-red-50/80 hover:border-red-300 text-left transition-all flex items-center space-x-3 group"
                  >
                    <div className="p-3 rounded-xl bg-white shadow-xs group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-700">
                        {item.label}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium">Express Dispatch</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Emergency Workers Matching List */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Selected Issue: {selectedEmergency.label}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Available Responders Near You ({matchedWorkers.length})
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="text-xs text-slate-500 font-semibold hover:text-slate-800 underline"
                >
                  Change Issue
                </button>
              </div>

              <div className="space-y-4">
                {matchedWorkers.map(w => (
                  <div key={w.id} className="bg-slate-50 p-4 rounded-2xl border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center space-x-3">
                      <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-xl object-cover border-2 border-red-400" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h5 className="font-bold text-slate-900 text-sm">{w.name}</h5>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Ready</span>
                        </div>
                        <p className="text-xs text-slate-500">{w.serviceName}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-600 mt-1">
                          <span className="font-bold text-amber-600">⭐ {w.rating}</span>
                          <span>📍 {w.distanceKm} km away</span>
                          <span className="font-semibold text-emerald-700">⚡ Est. {Math.round(w.distanceKm * 10 + 5)} mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a 
                        href={`tel:${w.phone}`}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Emergency Direct Call to ${w.name} (${w.phone})`);
                        }}
                        className="p-3 bg-red-100 text-red-800 hover:bg-red-200 rounded-xl transition-colors"
                        title="Emergency Call"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleExpressDispatch(w)}
                        className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
                      >
                        Dispatch Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
