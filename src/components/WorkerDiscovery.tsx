import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import type { ServiceCategory, Worker } from '../types';
import { WorkerCard } from './WorkerCard';
import { 
  Search, 
  Users, 
  SlidersHorizontal,
  X 
} from 'lucide-react';

export const WorkerDiscovery: React.FC = () => {
  const { 
    workers, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setSelectedWorkerForProfile,
    setSelectedWorkerForRequest,
    userProfile 
  } = useApp();

  const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'rating' | 'price'>('recommended');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);

  // Filter workers based on category, search, verified, emergency
  const filteredWorkers = workers.filter(w => {
    if (selectedCategory && w.serviceCategory !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchService = w.serviceName.toLowerCase().includes(q);
      const matchBio = w.bio.toLowerCase().includes(q);
      const matchCategory = w.serviceCategory.toLowerCase().includes(q);
      if (!matchName && !matchService && !matchBio && !matchCategory) return false;
    }
    if (onlyVerified && !w.isVerified) return false;
    if (onlyEmergency && !w.isEmergencyAvailable) return false;

    return true;
  });

  // Sort workers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortBy === 'recommended') return b.communityRecommendationsCount - a.communityRecommendationsCount;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.startingPrice - b.startingPrice;
    return 0;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Title & Location Context */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted Local Workers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified local services recommended by residents in <span className="font-semibold text-slate-800">{userProfile.cityDistrict}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-full border border-amber-200/80 w-fit">
            <Users className="w-4 h-4 text-amber-700" />
            <span>Showing {sortedWorkers.length} Workers</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by worker name, service (e.g. tap leak, short circuit)..."
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200">
        
        {/* Sort dropdown */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-800 font-semibold text-xs py-1.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="recommended">🏡 Local Recommendations</option>
            <option value="distance">📍 Distance (Nearest First)</option>
            <option value="rating">⭐ Highest Rating</option>
            <option value="price">💰 Price (Lowest First)</option>
          </select>
        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={e => setOnlyVerified(e.target.checked)}
              className="accent-amber-500 rounded-sm w-4 h-4"
            />
            <span className="text-slate-700">Verified Only</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyEmergency}
              onChange={e => setOnlyEmergency(e.target.checked)}
              className="accent-red-500 rounded-sm w-4 h-4"
            />
            <span className="text-slate-700">24/7 Emergency Ready</span>
          </label>
        </div>

      </div>

      {/* Workers Grid */}
      {sortedWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkers.map(worker => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onSelectProfile={setSelectedWorkerForProfile}
              onRequestService={setSelectedWorkerForRequest}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No matching workers found</h3>
          <p className="text-xs text-slate-500">
            Try clearing search keywords or selecting a different service category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setOnlyVerified(false);
              setOnlyEmergency(false);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
