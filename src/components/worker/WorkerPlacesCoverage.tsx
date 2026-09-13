import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Plus, 
  Check, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  Compass, 
  Sparkles,
  Building2
} from 'lucide-react';

export const WorkerPlacesCoverage: React.FC = () => {
  const { getActiveWorker, updateWorkerProfile, requests } = useApp();
  const worker = getActiveWorker();

  // Local state for active service zones
  const [activeZones, setActiveZones] = useState<string[]>(
    worker.serviceArea && worker.serviceArea.length > 0 
      ? worker.serviceArea 
      : [worker.locality, 'Kakkanad', 'Edappally', 'Kaloor', 'Thrikkakara', 'Palarivattom']
  );

  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(15);
  const [newZoneInput, setNewZoneInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Common popular localities in Kerala cities for quick addition
  const suggestedLocalities = [
    'Infopark Phase 1 & 2',
    'Marine Drive',
    'MG Road',
    'Vyttila Mobility Hub',
    'Aluva Metro',
    'Kadavanthra',
    'Panampilly Nagar',
    'Fort Kochi',
    'Maradu',
    'CUSAT Campus Area'
  ].filter(loc => !activeZones.includes(loc));

  // Places worked in with statistics derived from completed jobs or community records
  const placesWorkedIn = [
    {
      locality: worker.locality,
      completedJobs: 24,
      avgRating: 4.9,
      feedback: 'Primary home base with highest density of recurring residents.',
      isHomeBase: true
    },
    {
      locality: 'Kakkanad (Infopark / SmartCity)',
      completedJobs: 18,
      avgRating: 5.0,
      feedback: 'High emergency demand from techies living in gated flats & hostels.',
      isHomeBase: false
    },
    {
      locality: 'Thrikkakara (CUSAT Area)',
      completedJobs: 14,
      avgRating: 4.8,
      feedback: 'Frequent student PG requests for quick plumbing & electrical fixes.',
      isHomeBase: false
    },
    {
      locality: 'Edappally (Lulu / Metro Corridor)',
      completedJobs: 9,
      avgRating: 4.9,
      feedback: 'Regular scheduled maintenance and apartment valve repairs.',
      isHomeBase: false
    },
    {
      locality: 'Kaloor (Stadium Enclave)',
      completedJobs: 6,
      avgRating: 4.7,
      feedback: 'Rapid express dispatch for residential lockouts and tap bursts.',
      isHomeBase: false
    }
  ];

  const handleToggleZone = (zone: string) => {
    if (activeZones.includes(zone)) {
      if (activeZones.length <= 1) {
        alert('You must maintain at least one active service zone to receive requests.');
        return;
      }
      setActiveZones(activeZones.filter(z => z !== zone));
    } else {
      setActiveZones([...activeZones, zone]);
    }
  };

  const handleAddCustomZone = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newZoneInput.trim();
    if (!trimmed) return;
    if (activeZones.includes(trimmed)) {
      setNewZoneInput('');
      return;
    }
    setActiveZones([...activeZones, trimmed]);
    setNewZoneInput('');
  };

  const handleSaveCoverage = () => {
    updateWorkerProfile(worker.id, {
      serviceArea: activeZones
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-amber-400/30">
                Service Geography
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center space-x-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Active Dispatch Live</span>
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1.5 flex items-center space-x-2">
              <Navigation className="w-6 h-6 text-amber-400" />
              <span>Places & Coverage Zones</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Configure which neighborhoods you are willing to travel to for standard bookings and urgent SOS dispatches.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Zones</span>
              <span className="text-xl font-black text-amber-400">{activeZones.length}</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Radius</span>
              <span className="text-xl font-black text-emerald-400">{serviceRadiusKm} km</span>
            </div>
          </div>
        </div>

        {/* Travel Radius Slider */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200">Maximum Travel Radius:</span>
            <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
              Within {serviceRadiusKm} km from {worker.locality}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-64">
            <span className="text-[11px] text-slate-400">3 km</span>
            <input 
              type="range" 
              min={3} 
              max={30} 
              step={1}
              value={serviceRadiusKm}
              onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[11px] text-slate-400">30 km</span>
          </div>
        </div>
      </div>

      {/* Places Worked In (History & Track Record) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span>Places Worked In (Community Track Record)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Localities where you have completed verified resident service calls.
            </p>
          </div>
          <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl self-start sm:self-auto">
            71+ Completed Local Visits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {placesWorkedIn.map((place, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                place.isHomeBase 
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <MapPin className={`w-4 h-4 ${place.isHomeBase ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span className="font-extrabold text-sm text-slate-900">{place.locality}</span>
                </div>
                {place.isHomeBase && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                    Home Base
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs my-2">
                <span className="font-bold text-slate-700">
                  ⚡ <strong>{place.completedJobs}</strong> jobs done
                </span>
                <span className="font-extrabold text-amber-600">
                  ★ {place.avgRating}
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  ✓ 100% On-time
                </span>
              </div>

              <p className="text-[11px] text-slate-500 italic mt-1 leading-snug">
                "{place.feedback}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customize Active Service Zones */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <span>Customize Active Service Zones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle the neighborhoods where you are open to take resident visits.
            </p>
          </div>

          <button
            onClick={handleSaveCoverage}
            className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>Saved to Profile!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Active Coverage</span>
              </>
            )}
          </button>
        </div>

        {/* Current Active Zones Tags */}
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
            Currently Serviced Neighborhoods ({activeZones.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {activeZones.map(zone => (
              <span
                key={zone}
                className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-950 border border-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-2xs group"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{zone}</span>
                <button
                  type="button"
                  onClick={() => handleToggleZone(zone)}
                  className="p-0.5 rounded-md hover:bg-amber-200 text-amber-800 hover:text-amber-950 transition-colors"
                  title="Remove zone"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add Custom Zone Form */}
        <div className="pt-2">
          <form onSubmit={handleAddCustomZone} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={newZoneInput}
                onChange={(e) => setNewZoneInput(e.target.value)}
                placeholder="Add custom locality (e.g. Rajagiri, Infopark Phase 2)"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              disabled={!newZoneInput.trim()}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Zone</span>
            </button>
          </form>
        </div>

        {/* Suggested Localities to Quickly Add */}
        {suggestedLocalities.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Add Popular Nearby Zones:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedLocalities.slice(0, 6).map(sugg => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setActiveZones([...activeZones, sugg])}
                  className="inline-flex items-center space-x-1 text-xs bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>{sugg}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
