import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import type { ServiceCategory } from '../types';
import { WorkerCard } from './WorkerCard';
import { 
  Search, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  BookmarkCheck, 
  ChevronRight,
  Wrench,
  Zap,
  Hammer,
  Car,
  Key,
  Smartphone,
  Truck,
  Snowflake,
  MapPin,
  ShieldCheck
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Snowflake: <Snowflake className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  Key: <Key className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />
};

export const HomeDashboard: React.FC = () => {
  const { 
    userProfile, 
    workers, 
    trustedWorkerIds,
    setActiveView, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setSelectedWorkerForProfile,
    setSelectedWorkerForRequest,
    setIsEmergencyModalOpen
  } = useApp();

  const handleCategoryClick = (catId: ServiceCategory) => {
    setSelectedCategory(catId);
    setActiveView('discovery');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('discovery');
    }
  };

  // Saved workers list
  const savedWorkers = workers.filter(w => trustedWorkerIds.includes(w.id));
  
  // High community recommendation workers
  const popularWorkers = [...workers].sort((a, b) => b.communityRecommendationsCount - a.communityRecommendationsCount);

  // Near neighborhood workers (sorted by distance)
  const nearWorkers = [...workers].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Personalized Welcome Hero & Search */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1 rounded-full text-xs text-amber-400 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{userProfile.cityDistrict.split('(')[0].trim()} • {userProfile.locality}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Hey {userProfile.name.split(' ')[0]} 👋 <br />
            <span className="text-slate-300 font-normal text-2xl sm:text-3xl">What do you need help with today?</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />
            <span>Trusted plumbers, electricians, locksmiths & techs near your apartment, PG, or locality.</span>
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 'tap leakage', 'electrician', 'locksmith'..."
                className="w-full pl-12 pr-28 py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl text-sm sm:text-base font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                Search
              </button>
            </div>
          </form>

        </div>

        {/* Floating Prominent Emergency Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Emergency Fix Required?</h4>
              <p className="text-xs text-slate-400">Pipe burst, short circuit, locked out, breakdown?</p>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 transform hover:scale-105"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>I NEED HELP NOW 🚨</span>
          </button>
        </div>

      </section>

      {/* Service Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Service Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center space-x-1.5 mt-0.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
              <span>Select a category to view verified local workers</span>
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('discovery');
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform`}>
                {CATEGORY_ICON_MAP[cat.icon] || <Wrench className="w-6 h-6" />}
              </div>
              <span className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-amber-600">
                {cat.name}
              </span>
              {cat.emergencySupported && (
                <span className="mt-1 text-[9px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.5 rounded-full">
                  Emergency
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* "My Trusted Workers" Summary Widget */}
      {savedWorkers.length > 0 && (
        <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">My Trusted Workers</h3>
                <p className="text-xs text-slate-600">Your saved personal local contacts for instant booking</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('my_trusted')}
              className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-xl transition-colors"
            >
              View All ({savedWorkers.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedWorkers.slice(0, 3).map(w => (
              <div key={w.id} className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3">
                  <img src={w.avatar} alt={w.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{w.name.split('(')[0]}</h4>
                    <p className="text-[11px] text-slate-500">{w.serviceName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWorkerForRequest(w)}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* "Popular in Your City" Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Popular in Your City / District
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Most recommended workers in {userProfile.cityDistrict.split('(')[0].trim()}</p>
          </div>
          <button
            onClick={() => setActiveView('discovery')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularWorkers.slice(0, 3).map(w => (
            <WorkerCard
              key={w.id}
              worker={w}
              onSelectProfile={setSelectedWorkerForProfile}
              onRequestService={setSelectedWorkerForRequest}
            />
          ))}
        </div>
      </section>

      {/* "Trusted Near Your Neighborhood" Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Trusted Near Your Neighborhood (Within 2 km)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Local repair experts within 10-15 minutes arrival time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearWorkers.slice(0, 3).map(w => (
            <WorkerCard
              key={w.id}
              worker={w}
              onSelectProfile={setSelectedWorkerForProfile}
              onRequestService={setSelectedWorkerForRequest}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
