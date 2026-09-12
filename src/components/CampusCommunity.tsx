import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_TIPS } from '../data/initialData';
import { 
  Users, 
  Award, 
  Star, 
  MessageSquare, 
  Sparkles
} from 'lucide-react';

export const CampusCommunity: React.FC = () => {
  const { workers, reviews, userProfile, setSelectedWorkerForProfile } = useApp();

  // Top recommended leaderboard
  const leaderboard = [...workers].sort((a, b) => b.communityRecommendationsCount - a.communityRecommendationsCount).slice(0, 5);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          <Users className="w-4 h-4 text-amber-700" />
          <span>Neighborhood Recommendations & Community Trust</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Local Community Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          See what residents in <span className="font-bold text-slate-900">{userProfile.cityDistrict}</span> are recommending this week.
        </p>
      </div>

      {/* Community Weekly Highlights Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-slate-800 px-2.5 py-1 rounded-md">
            🔥 Community Trend This Week
          </span>
          <h3 className="text-xl font-bold text-white">
            12 residents recommended Anwar Electrician this week
          </h3>
          <p className="text-xs text-slate-300">
            Quick fan capacitor replacement & flat switchboard fixes for young professionals & flat residents.
          </p>
        </div>

        <button
          onClick={() => {
            const w = workers.find(x => x.id === 'w2');
            if (w) setSelectedWorkerForProfile(w);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all shrink-0"
        >
          View Anwar's Profile
        </button>
      </div>

      {/* Leaderboard & Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Local Leaderboard */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Top Trusted Local Workers</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Ranked by Recs</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((worker, rank) => (
              <div 
                key={worker.id}
                onClick={() => setSelectedWorkerForProfile(worker)}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-amber-50/70 hover:border-amber-300 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    rank === 0 ? 'bg-amber-400 text-slate-950' : (rank === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-100 text-amber-900')
                  }`}>
                    #{rank + 1}
                  </div>
                  <img src={worker.avatar} alt={worker.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{worker.name.split('(')[0]}</h4>
                    <p className="text-[11px] text-slate-500">{worker.serviceName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md block">
                    👍 {worker.communityRecommendationsCount} Recs
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                    ⭐ {worker.rating} / 5.0
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Advice & Tips Board */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Local Community Tips</h3>
            </div>
          </div>

          <div className="space-y-3">
            {INITIAL_TIPS.map(tip => (
              <div key={tip.id} className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950">{tip.title}</span>
                  <span className="text-slate-400 text-[10px]">{tip.createdAt}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{tip.content}</p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Posted by: <strong className="text-slate-800">{tip.author}</strong></span>
                  <span className="text-amber-800 font-bold">❤️ {tip.likes} helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Local Resident Reviews Stream */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <span>Recent Verified Resident Reviews</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{r.userName}</span>
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  {r.livingSituation} ({r.roomAddress || 'Local Resident'})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic">"{r.comment}"</p>
              <div className="text-[10px] text-slate-400 font-medium pt-1 flex justify-between">
                <span>Service: {r.serviceType}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
