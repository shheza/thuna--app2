import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Crown, 
  Award, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Percent, 
  Gift, 
  Users, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ServiceCategory } from '../../types';

export const WorkerLeaderboardPerks: React.FC = () => {
  const { workers, getActiveWorker } = useApp();
  const activeWorker = getActiveWorker();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: '🌟 All Trades' },
    { id: 'plumbing', label: '🚰 Plumbing' },
    { id: 'electrical', label: '⚡ Electrical' },
    { id: 'locksmith', label: '🔑 Locksmith' },
    { id: 'ac_appliance', label: '❄️ AC & Appliances' },
    { id: 'carpenter', label: '🪚 Carpentry' },
    { id: 'cleaning', label: '🧹 Cleaning' },
    { id: 'device_repair', label: '📱 Wi-Fi & CCTV' },
    { id: 'moving_transport', label: '📦 Moving' }
  ];

  // Filter and sort workers by rating and recommendations
  const filteredWorkers = workers
    .filter(w => selectedCategory === 'all' || w.serviceCategory === selectedCategory)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.communityRecommendationsCount - a.communityRecommendationsCount;
    });

  const top1 = filteredWorkers[0];
  const top2 = filteredWorkers[1];
  const top3 = filteredWorkers[2];

  // Find active worker rank in the filtered list
  const activeWorkerRank = filteredWorkers.findIndex(w => w.id === activeWorker.id) + 1;

  const perks = [
    {
      icon: <Percent className="w-5 h-5 text-emerald-500" />,
      title: '0% Platform Fee Guarantee',
      desc: 'Keep 100% of customer payments directly via cash or UPI with zero middleman commissions.',
      status: 'Active & Unlocked',
      unlocked: true
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: 'Priority SOS Emergency Dispatch',
      desc: 'Instant audio alarm popups for high-urgency lockouts and pipe bursts with premium pay.',
      status: 'Active & Unlocked',
      unlocked: true
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      title: 'Verified Resident Trust Badge',
      desc: 'Community vetted badge displayed on search results to build immediate credibility with hostelers.',
      status: 'Active & Unlocked',
      unlocked: true
    },
    {
      icon: <Crown className="w-5 h-5 text-purple-500" />,
      title: 'Homepage Pro Spotlight',
      desc: 'Top 3 ranked pros are featured directly on the Thuna discovery carousel for high volume leads.',
      status: activeWorkerRank > 0 && activeWorkerRank <= 3 ? 'Active & Unlocked' : 'Rank in Top 3 to Unlock',
      unlocked: activeWorkerRank > 0 && activeWorkerRank <= 3
    },
    {
      icon: <Gift className="w-5 h-5 text-rose-500" />,
      title: '₹1,500 Trade Tool Subsidy',
      desc: 'Equipment voucher for power tools, multimeters, or leak detectors upon 30 completed jobs.',
      status: '24 / 30 Jobs Completed',
      unlocked: false
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-amber-400/30 flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Community Standings</span>
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                Updated Daily from Resident Feedback
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1.5 flex items-center space-x-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <span>Leaderboard & Community Perks</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Top rated pros earn higher customer visibility, priority SOS calls, and verified badge recognition from local apartments and student hostels.
            </p>
          </div>

          {/* Active Worker Rank Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center space-x-3 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
              #{activeWorkerRank > 0 ? activeWorkerRank : '—'}
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase block tracking-wider">
                Your Current Rank
              </span>
              <span className="font-extrabold text-white text-sm">
                {activeWorkerRank > 0 ? `Top Pro (${activeWorker.locality})` : 'Unranked'}
              </span>
              <span className="text-[11px] text-slate-300 block">
                ★ {activeWorker.rating} Rating • {activeWorker.communityRecommendationsCount} Recs
              </span>
            </div>
          </div>
        </div>

        {/* Category Filters Carousel */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Top Pros Podium (1st, 2nd, 3rd) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center max-w-md mx-auto">
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            🏆 Community Hall of Fame
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            Top Rated Pros in {selectedCategory === 'all' ? 'All Trades' : selectedCategory.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by star rating, completed emergency dispatches, and local resident reviews.
          </p>
        </div>

        {/* The 3-Step Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-6 max-w-3xl mx-auto">
          
          {/* 2nd Place (Silver) */}
          {top2 && (
            <div className="order-2 sm:order-1 flex flex-col items-center">
              <div className="relative mb-2">
                <span className="absolute -top-3 -right-2 text-2xl">🥈</span>
                <img 
                  src={top2.avatar} 
                  alt={top2.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-slate-300 shadow-md"
                />
              </div>
              <div className="w-full bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                  Rank #2 Silver
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-1 truncate">{top2.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{top2.serviceName}</p>
                <div className="mt-2 flex items-center justify-center space-x-1.5 text-xs font-black text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{top2.rating}</span>
                  <span className="text-slate-400 font-normal">({top2.communityRecommendationsCount} recs)</span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Champion) */}
          {top1 && (
            <div className="order-1 sm:order-2 flex flex-col items-center">
              <div className="relative mb-3">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                  👑
                </div>
                <img 
                  src={top1.avatar} 
                  alt={top1.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-400 shadow-xl ring-4 ring-amber-300/40"
                />
                <span className="absolute -bottom-2 -right-2 text-2xl">🥇</span>
              </div>
              <div className="w-full bg-gradient-to-b from-amber-50 via-amber-100/60 to-amber-200/50 border-2 border-amber-400 rounded-2xl p-5 text-center shadow-lg transform sm:-translate-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  🏆 Rank #1 Gold Champion
                </span>
                <h4 className="font-black text-base text-slate-950 mt-1.5 truncate">{top1.name}</h4>
                <p className="text-xs text-amber-900 font-bold truncate">{top1.serviceName}</p>
                <div className="mt-2 flex items-center justify-center space-x-1.5 text-sm font-black text-amber-700">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{top1.rating}</span>
                  <span className="text-amber-800/80 font-semibold text-xs">({top1.communityRecommendationsCount} recs)</span>
                </div>
                <span className="inline-block mt-2 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Top Recommended
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {top3 && (
            <div className="order-3 flex flex-col items-center">
              <div className="relative mb-2">
                <span className="absolute -top-3 -right-2 text-2xl">🥉</span>
                <img 
                  src={top3.avatar} 
                  alt={top3.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-amber-700/40 shadow-md"
                />
              </div>
              <div className="w-full bg-gradient-to-b from-orange-50 to-orange-100/60 border border-amber-700/30 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-orange-200/80 px-2 py-0.5 rounded-md">
                  Rank #3 Bronze
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-1 truncate">{top3.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{top3.serviceName}</p>
                <div className="mt-2 flex items-center justify-center space-x-1.5 text-xs font-black text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{top3.rating}</span>
                  <span className="text-slate-400 font-normal">({top3.communityRecommendationsCount} recs)</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Complete Rank Standings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Complete Community Standings ({filteredWorkers.length} Pros)
            </h3>
            <p className="text-xs text-slate-500">
              Verified tradespeople listed by trust score and performance.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {selectedCategory === 'all' ? 'All Services' : selectedCategory}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Pro & Service</th>
                <th className="py-3 px-3">Locality</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Recs</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((w, index) => {
                const isYou = w.id === activeWorker.id;
                const rankNum = index + 1;

                return (
                  <tr 
                    key={w.id}
                    className={`transition-colors ${
                      isYou 
                        ? 'bg-amber-50/80 font-bold border-l-4 border-amber-500' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-black text-sm text-slate-900">
                      {rankNum === 1 ? '🥇 #1' : rankNum === 2 ? '🥈 #2' : rankNum === 3 ? '🥉 #3' : `#${rankNum}`}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-900">{w.name}</span>
                            {isYou && (
                              <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">{w.serviceName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {w.locality}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-black text-amber-600 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 inline" />
                        <span>{w.rating}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-bold">
                      👍 {w.communityRecommendationsCount}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.availabilityStatus === 'Available Now'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {w.availabilityStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Perks & Benefits Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Community Perks & Rewards Program</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Exclusive benefits unlocked automatically as you maintain high customer ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {perks.map((perk, i) => (
            <div 
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                perk.unlocked 
                  ? 'bg-emerald-50/40 border-emerald-200' 
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  {perk.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  perk.unlocked 
                    ? 'bg-emerald-100 text-emerald-900' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {perk.status}
                </span>
              </div>

              <h4 className="font-black text-slate-900 text-sm mt-3">{perk.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
