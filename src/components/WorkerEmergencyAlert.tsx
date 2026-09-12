import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  X,
  User,
  Zap,
  ShieldAlert,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  playEmergencySound, 
  startEmergencySoundLoop, 
  stopEmergencySoundLoop 
} from '../utils/audioAlert';

export const WorkerEmergencyAlert: React.FC = () => {
  const { 
    activeEmergencyAlert, 
    dismissEmergencyAlert, 
    getActiveWorker,
    createServiceRequest 
  } = useApp();

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Loop alert sound continuously while alert is active until worker Accepts or Rejects
  useEffect(() => {
    if (activeEmergencyAlert && !isSoundMuted) {
      startEmergencySoundLoop();
    } else {
      stopEmergencySoundLoop();
    }

    return () => {
      stopEmergencySoundLoop();
    };
  }, [activeEmergencyAlert, isSoundMuted]);

  if (!activeEmergencyAlert) return null;

  const activeWorker = getActiveWorker();

  const handleToggleSound = () => {
    if (isSoundMuted) {
      setIsSoundMuted(false);
      startEmergencySoundLoop();
    } else {
      setIsSoundMuted(true);
      stopEmergencySoundLoop();
    }
  };

  const handleAcceptEmergency = () => {
    // Immediately stop the alarm sound on Accept
    stopEmergencySoundLoop();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Add as active request in pipeline
    createServiceRequest({
      workerId: activeWorker.id,
      workerName: activeWorker.name,
      workerAvatar: activeWorker.avatar,
      workerPhone: activeWorker.phone,
      serviceCategory: activeWorker.serviceCategory,
      serviceTitle: `🚨 SOS DISPATCH: ${activeEmergencyAlert.emergencyType}`,
      userName: activeEmergencyAlert.clientName,
      userPhone: activeEmergencyAlert.phone,
      cityDistrict: activeWorker.cityDistrict,
      locality: activeEmergencyAlert.locality,
      livingSituation: 'Apartment / PG',
      addressDetails: activeEmergencyAlert.address,
      problemDescription: `URGENT SOS: Client requested immediate emergency dispatch at ${activeEmergencyAlert.address}. Contact: ${activeEmergencyAlert.phone}`,
      preferredDate: 'Today',
      preferredTime: 'Immediate Express (< 15 mins)',
      estimatedPrice: activeWorker.startingPrice + 100,
      isEmergency: true,
      emergencyType: activeEmergencyAlert.emergencyType
    });

    dismissEmergencyAlert();
  };

  const handleRejectEmergency = () => {
    // Immediately stop the alarm sound on Reject
    stopEmergencySoundLoop();
    dismissEmergencyAlert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Modal Card Container with glowing animated border */}
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-1 shadow-2xl shadow-red-600/50 my-auto overflow-hidden animate-scaleUp">
        
        {/* Animated ambient background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="bg-slate-950/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-7 text-white relative overflow-hidden flex flex-col space-y-5">
          
          {/* Top Bar: Live Beacon & Sound Control & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs flex items-center space-x-1.5 animate-pulse">
                <span className="w-2 h-2 bg-amber-300 rounded-full animate-ping" />
                <span>NEARBY EMERGENCY SOS</span>
              </span>
              <span className="text-[11px] text-amber-300 font-bold hidden xs:inline">
                Instant Dispatch
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Sound control button */}
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-1.5 px-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors border shadow-xs ${
                  !isSoundMuted 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-amber-300 border-red-500/40 animate-pulse' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-400 border-white/20'
                }`}
                title={isSoundMuted ? "Click to resume alert sound" : "Click to silence alert sound"}
              >
                {!isSoundMuted ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce text-amber-300" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">🔊 Ringing... (Mute)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">🔇 Silenced</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRejectEmergency}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cute Animated Mascot & Urgent Header */}
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            
            {/* Cute Animated Siren Buddy Mascot */}
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Radiating radar pulse rings */}
              <span className="absolute -inset-2.5 rounded-2xl bg-red-500/35 animate-ping pointer-events-none" />
              <span className="absolute -inset-1 rounded-2xl bg-amber-400/25 animate-pulse pointer-events-none" />

              {/* Siren Mascot Body */}
              <div 
                className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-600 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 transform hover:rotate-6 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group" 
                onClick={handleToggleSound}
                title={!isSoundMuted ? "Alert is ringing! Click to silence 🚨" : "Alert is silenced. Click to sound! 🚨"}
              >
                {/* Flashing dual beacon lights */}
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </div>
                
                {/* Wobbly Siren Icon */}
                <span className="text-2xl select-none animate-bounce" role="img" aria-label="siren">
                  🚨
                </span>
                
                {/* Cute little eyes on the mascot base */}
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="w-1 h-1 bg-slate-950 rounded-full" />
                  <span className="w-1 h-1 bg-slate-950 rounded-full" />
                </div>
              </div>
            </div>

            {/* Headline Details */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                Resident Needs Immediate Assistance
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug truncate">
                {activeEmergencyAlert.emergencyType}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">~0.8 km away in <strong>{activeEmergencyAlert.locality}</strong></span>
              </p>
            </div>

          </div>

          {/* Resident Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Resident</span>
              <span className="font-extrabold text-white truncate block text-xs sm:text-sm">{activeEmergencyAlert.clientName}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Payout Rate</span>
              <span className="font-black text-emerald-400 text-xs sm:text-sm">₹{activeWorker.startingPrice + 100} (Express)</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Response Time</span>
              <span className="font-bold text-amber-300 text-xs">Under 15 Mins</span>
            </div>
          </div>

          {/* Exact Address Alert Box */}
          <div className="bg-red-500/15 border border-red-500/35 p-3 rounded-xl text-xs text-slate-200 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Exact Destination Address:</span>
              <span className="text-slate-300 leading-tight block mt-0.5">{activeEmergencyAlert.address}</span>
            </div>
          </div>

          {/* Decision Buttons: Accept vs Reject */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {/* Reject / Pass Button */}
            <button
              type="button"
              onClick={handleRejectEmergency}
              className="w-full sm:w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
            >
              <XCircle className="w-4 h-4 text-slate-400" />
              <span>Reject / Pass</span>
            </button>

            {/* Accept & Dispatch Button */}
            <button
              type="button"
              onClick={handleAcceptEmergency}
              className="w-full sm:w-2/3 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/30 transform hover:scale-102 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Accept Emergency Job (₹{activeWorker.startingPrice + 100})</span>
            </button>
          </div>

          {/* Quick Call Link */}
          <div className="text-center pt-1">
            <a
              href={`tel:${activeEmergencyAlert.phone}`}
              className="text-xs text-amber-300 hover:underline inline-flex items-center space-x-1"
            >
              <Phone className="w-3 h-3" />
              <span>Or call resident directly: {activeEmergencyAlert.phone}</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
