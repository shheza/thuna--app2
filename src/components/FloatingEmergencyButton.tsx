import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const FloatingEmergencyButton: React.FC = () => {
  const { roleMode, setIsEmergencyModalOpen } = useApp();

  // Only display for resident/student view
  if (roleMode !== 'student') return null;

  return (
    <aside aria-label="Emergency Help" className="fixed bottom-22 right-4 sm:bottom-8 sm:right-8 z-40">
      {/* Outer pulsing glow blur effect */}
      <div className="absolute -inset-1.5 bg-red-600 rounded-full blur-md opacity-60 animate-pulse pointer-events-none" />
      
      {/* Animated Ping Radar Ring */}
      <span className="absolute -inset-1 rounded-full animate-ping bg-red-500/40 pointer-events-none" />

      {/* Main Interactive Floating Button */}
      <button
        onClick={() => setIsEmergencyModalOpen(true)}
        className="relative group flex items-center space-x-2.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-red-600/50 hover:shadow-red-600/75 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95 transition-all duration-300 border-2 border-red-300/40"
        title="Immediate Emergency Service (Lockout, Pipe Burst, Short Circuit)"
      >
        {/* Animated Flashing Signal Beacon */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300 shadow-xs" />
        </span>

        {/* Warning Icon */}
        <AlertTriangle className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform shrink-0" />

        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] font-bold text-red-100 tracking-wider uppercase opacity-90">
            Emergency
          </span>
          <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase drop-shadow-xs">
            SOS Help Now
          </span>
        </div>
      </button>
    </aside>
  );
};
