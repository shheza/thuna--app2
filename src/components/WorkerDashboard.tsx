import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Clock, 
  Star, 
  ToggleLeft, 
  ToggleRight, 
  AlertTriangle, 
  Navigation,
  Trophy,
  CreditCard,
  QrCode,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { WorkerEmergencyAlert } from './WorkerEmergencyAlert';
import { WorkerPlacesCoverage } from './worker/WorkerPlacesCoverage';
import { WorkerLeaderboardPerks } from './worker/WorkerLeaderboardPerks';
import { WorkerRateCard } from './worker/WorkerRateCard';
import { WorkerPublicProfileView } from './worker/WorkerPublicProfileView';

export type WorkerTab = 'requests' | 'coverage' | 'leaderboard' | 'rate_card' | 'public_profile';

export const WorkerDashboard: React.FC = () => {
  const { 
    workers, 
    requests, 
    updateRequestStatus, 
    updateWorkerAvailability, 
    getActiveWorker,
    setActiveWorkerId,
    activeEmergencyAlert 
  } = useApp();

  const [activeTab, setActiveTab] = useState<WorkerTab>('requests');

  // Active logged-in worker
  const activeWorker = getActiveWorker();

  const workerRequests = requests.filter(r => r.workerId === activeWorker.id);
  const pendingRequests = workerRequests.filter(r => r.status === 'Request Sent');
  const activeJobs = workerRequests.filter(r => r.status === 'Worker Accepted' || r.status === 'Worker On The Way');
  const completedJobs = workerRequests.filter(r => r.status === 'Service Completed');

  const handleToggleOnline = () => {
    const nextStatus = activeWorker.availabilityStatus === 'Available Now' ? 'Busy' : 'Available Now';
    updateWorkerAvailability(activeWorker.id, nextStatus);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Active Resident Emergency Alert Banner with Cute Mascot Animation */}
      <WorkerEmergencyAlert />

      {/* Worker Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img src={activeWorker.avatar} alt={activeWorker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black">{activeWorker.name}</h1>
                {activeWorker.isVerified && (
                  <span 
                    title="Verified Worker" 
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">{activeWorker.serviceName} • {activeWorker.locality}</p>
            </div>
          </div>

          {/* Right Action Controls: Availability */}
          <div className="flex items-center space-x-2.5">
            {/* Availability Toggle */}
            <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                <span className={`text-xs font-extrabold ${
                  activeWorker.availabilityStatus === 'Available Now' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {activeWorker.availabilityStatus}
                </span>
              </div>
              <button
                onClick={handleToggleOnline}
                className="p-1 text-amber-400 hover:text-amber-300"
              >
                {activeWorker.availabilityStatus === 'Available Now' ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid with Interactive Tab Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button 
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-center transition-all cursor-pointer hover:border-amber-400/40 text-left sm:text-center"
            title="View Community Leaderboard"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
            <span className="text-lg font-black text-amber-400 flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 inline mr-0.5" /> {activeWorker.rating}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-center transition-all cursor-pointer hover:border-amber-400/40 text-left sm:text-center"
            title="View Community Recommendations"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Recs</span>
            <span className="text-lg font-black text-amber-400">
              👍 {activeWorker.communityRecommendationsCount}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('requests')}
            className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-center transition-all cursor-pointer hover:border-amber-400/40 text-left sm:text-center"
            title="View Active Requests & Jobs"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Jobs</span>
            <span className="text-lg font-black text-white">{activeJobs.length + pendingRequests.length}</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('rate_card')}
            className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-center transition-all cursor-pointer hover:border-emerald-400/40 text-left sm:text-center"
            title="Manage Rate Card"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Revenue</span>
            <span className="text-lg font-black text-emerald-400">
              ₹{completedJobs.reduce((sum, r) => sum + r.estimatedPrice, 0) + 1250}
            </span>
          </button>
        </div>

      </div>

      {/* Navigation Tabs for Worker Dashboard - Floats at bottom on mobile, static in-page on desktop */}
      <nav 
        aria-label="Worker Dashboard Navigation"
        className="fixed bottom-3 inset-x-2 sm:inset-x-4 max-w-lg mx-auto z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 p-1.5 flex items-center justify-around md:static md:bottom-auto md:inset-x-auto md:max-w-none md:z-auto md:bg-white md:border-slate-200 md:shadow-xs md:justify-start md:gap-1.5 md:overflow-x-auto md:scrollbar-none"
      >
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col md:flex-row items-center justify-center py-1.5 px-2 sm:px-3 md:px-4 md:py-2.5 rounded-xl transition-all relative shrink-0 md:space-x-2 ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="md:hidden text-[10px] font-bold mt-0.5">Jobs</span>
          <span className="hidden md:inline text-xs font-black">Requests & Pipeline</span>
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 md:static md:ml-1 bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[9px] md:text-[10px] font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('coverage')}
          className={`flex flex-col md:flex-row items-center justify-center py-1.5 px-2 sm:px-3 md:px-4 md:py-2.5 rounded-xl transition-all shrink-0 md:space-x-2 ${
            activeTab === 'coverage'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4 text-amber-500" />
          <span className="md:hidden text-[10px] font-bold mt-0.5">Coverage</span>
          <span className="hidden md:inline text-xs font-black">Places & Coverage</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col md:flex-row items-center justify-center py-1.5 px-2 sm:px-3 md:px-4 md:py-2.5 rounded-xl transition-all shrink-0 md:space-x-2 ${
            activeTab === 'leaderboard'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="md:hidden text-[10px] font-bold mt-0.5">Rank</span>
          <span className="hidden md:inline text-xs font-black">Leaderboard & Perks</span>
        </button>

        <button
          onClick={() => setActiveTab('rate_card')}
          className={`flex flex-col md:flex-row items-center justify-center py-1.5 px-2 sm:px-3 md:px-4 md:py-2.5 rounded-xl transition-all shrink-0 md:space-x-2 ${
            activeTab === 'rate_card'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-500" />
          <span className="md:hidden text-[10px] font-bold mt-0.5">Rates</span>
          <span className="hidden md:inline text-xs font-black">Manage Rate Card</span>
        </button>

        <button
          onClick={() => setActiveTab('public_profile')}
          className={`flex flex-col md:flex-row items-center justify-center py-1.5 px-2 sm:px-3 md:px-4 md:py-2.5 rounded-xl transition-all shrink-0 md:space-x-2 ${
            activeTab === 'public_profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-purple-500" />
          <span className="md:hidden text-[10px] font-bold mt-0.5">QR Card</span>
          <span className="hidden md:inline text-xs font-black">Public Profile & QR</span>
        </button>
      </nav>

      {/* Tab 1: Requests & In-Progress Pipeline */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Incoming Pending Requests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Incoming Resident Requests ({pendingRequests.length})</span>
              </h2>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white p-5 rounded-3xl border-2 border-amber-400 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                        {req.isEmergency ? '🚨 EMERGENCY DISPATCH' : 'Standard Request'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">Est: ₹{req.estimatedPrice}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{req.serviceTitle}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <strong>Resident:</strong> {req.userName} ({req.cityDistrict.split('(')[0].trim()})
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>Address:</strong> {req.addressDetails}
                      </p>
                      <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-xl">
                        "{req.problemDescription}"
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => updateRequestStatus(req.id, 'Cancelled')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => updateRequestStatus(req.id, 'Worker Accepted')}
                        className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      >
                        Accept Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No pending requests waiting for response.
              </div>
            )}
          </div>

          {/* Active Jobs Pipeline Management */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span>Active In-Progress Jobs ({activeJobs.length})</span>
            </h2>

            {activeJobs.length > 0 ? (
              <div className="space-y-4">
                {activeJobs.map(req => (
                  <div key={req.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Status: <strong className="text-amber-700">{req.status}</strong></span>
                      <span className="text-xs font-bold text-slate-900">₹{req.estimatedPrice}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.serviceTitle}</h4>
                      <p className="text-xs text-slate-600">Location: {req.addressDetails}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end space-x-2">
                      {req.status === 'Worker Accepted' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Worker On The Way')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
                        >
                          Mark "On The Way"
                        </button>
                      )}

                      {req.status === 'Worker On The Way' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Service Completed')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          Mark "Service Completed"
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No active jobs in progress.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Places & Coverage */}
      {activeTab === 'coverage' && (
        <div className="animate-fadeIn">
          <WorkerPlacesCoverage />
        </div>
      )}

      {/* Tab 3: Leaderboard & Perks */}
      {activeTab === 'leaderboard' && (
        <div className="animate-fadeIn">
          <WorkerLeaderboardPerks />
        </div>
      )}

      {/* Tab 4: Manage Rate Card */}
      {activeTab === 'rate_card' && (
        <div className="animate-fadeIn">
          <WorkerRateCard />
        </div>
      )}

      {/* Tab 5: Public Profile View & QR Code */}
      {activeTab === 'public_profile' && (
        <div className="animate-fadeIn">
          <WorkerPublicProfileView />
        </div>
      )}

    </div>
  );
};
