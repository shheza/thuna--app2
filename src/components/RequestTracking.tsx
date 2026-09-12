import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { RequestStatus } from '../types';
import { 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Star, 
  Navigation,
  ThumbsUp,
  BookmarkCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const STATUS_STEPS: RequestStatus[] = [
  'Request Sent',
  'Worker Accepted',
  'Worker On The Way',
  'Service Completed'
];

export const RequestTracking: React.FC = () => {
  const { 
    requests, 
    updateRequestStatus, 
    addReview, 
    recommendWorker, 
    userProfile,
    setActiveView 
  } = useApp();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requests[0]?.id || null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [reviewInput, setReviewInput] = useState<string>('');
  const [isReviewed, setIsReviewed] = useState<boolean>(false);

  const activeRequest = requests.find(r => r.id === selectedRequestId) || requests[0];

  if (!activeRequest) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 my-10">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-2xl">
          📋
        </div>
        <h3 className="font-extrabold text-slate-900 text-lg">No Active Requests</h3>
        <p className="text-xs text-slate-500">You haven't requested any service yet.</p>
        <button
          onClick={() => setActiveView('discovery')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
        >
          Find Local Workers
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(activeRequest.status);

  const handleAdvanceStatus = () => {
    if (currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStepIndex + 1];
      updateRequestStatus(activeRequest.id, nextStatus);
    }
  };

  const handleCompleteReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewInput.trim()) return;

    addReview({
      workerId: activeRequest.workerId,
      userName: userProfile.name || 'Resident',
      cityDistrict: userProfile.cityDistrict,
      livingSituation: userProfile.livingSituation,
      roomAddress: userProfile.addressDetails,
      rating: ratingInput,
      comment: reviewInput,
      isRecommended: true,
      serviceType: activeRequest.serviceTitle
    });

    recommendWorker(activeRequest.workerId);
    setIsReviewed(true);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Live Service Tracking
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Request #{activeRequest.id.slice(-6)}
          </h1>
          <p className="text-xs text-slate-500">{activeRequest.serviceTitle} • {activeRequest.workerName}</p>
        </div>

        {/* Request selector if multiple exist */}
        {requests.length > 1 && (
          <select
            value={activeRequest.id}
            onChange={e => setSelectedRequestId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-2.5 rounded-xl focus:outline-none"
          >
            {requests.map(r => (
              <option key={r.id} value={r.id}>
                {r.serviceTitle} ({r.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Pipeline Status Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Status Pipeline Visualizer */}
        <div className="relative">
          {/* Track line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />

          <div className="relative z-10 flex justify-between">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted 
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-md' 
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 text-center max-w-[80px] ${
                    isCurrent ? 'text-amber-900 font-extrabold' : (isCompleted ? 'text-slate-900' : 'text-slate-400')
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hackathon Live Simulator Control Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-semibold">
              Live Status: <span className="text-amber-400 font-extrabold">{activeRequest.status}</span>
            </span>
          </div>

          {currentStepIndex < STATUS_STEPS.length - 1 && (
            <button
              onClick={handleAdvanceStatus}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1"
            >
              <span>Simulate Next Step ➔</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Grid: Worker Contact & Map Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Worker Contact Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
            <span>Assigned Local Worker</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </h3>

          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <img src={activeRequest.workerAvatar} alt={activeRequest.workerName} className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h4 className="font-bold text-slate-900 text-base">{activeRequest.workerName}</h4>
              <p className="text-xs text-slate-500">{activeRequest.serviceTitle}</p>
              <p className="text-xs font-semibold text-emerald-700 mt-1">Est. Price: ₹{activeRequest.estimatedPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a 
              href={`tel:${activeRequest.workerPhone}`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Calling worker ${activeRequest.workerName} at ${activeRequest.workerPhone}`);
              }}
              className="p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Worker</span>
            </a>

            <a 
              href={`https://wa.me/${activeRequest.workerPhone}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                alert(`Opening WhatsApp Chat with ${activeRequest.workerName}`);
              }}
              className="p-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all border border-emerald-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Request details */}
          <div className="text-xs space-y-2 pt-2 border-t border-slate-100 text-slate-600">
            <div className="flex justify-between">
              <span className="font-medium">Service Address:</span>
              <span className="font-bold text-slate-800">{activeRequest.addressDetails}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Scheduled Time:</span>
              <span className="font-bold text-slate-800">{activeRequest.preferredDate} ({activeRequest.preferredTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Problem Note:</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{activeRequest.problemDescription}</span>
            </div>
          </div>

        </div>

        {/* Map Preview Mock */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="font-bold text-sm">Live Location Dispatch Map</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Neighborhood Radar
            </span>
          </div>

          <div className="my-8 relative z-10 text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mx-auto animate-pulse-subtle">
              <MapPin className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-xs text-slate-300">
              Worker is <span className="font-bold text-white">0.8 km away</span> from {userProfile.locality}
            </p>
          </div>

          <div className="relative z-10 bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-300">Target Destination:</span>
            <span className="font-bold text-amber-400">{userProfile.addressDetails}</span>
          </div>
        </div>

      </div>

      {/* Completion & Review Prompt Modal Section */}
      {activeRequest.status === 'Service Completed' && (
        <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">
                Service Completed!
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Rate & Recommend {activeRequest.workerName} to Your Neighborhood
              </h3>
            </div>
          </div>

          {isReviewed ? (
            <div className="bg-white p-4 rounded-2xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                <span>Worker has been reviewed and saved to "My Trusted Workers"!</span>
              </div>
              <button
                onClick={() => setActiveView('my_trusted')}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold"
              >
                View My Trusted
              </button>
            </div>
          ) : (
            <form onSubmit={handleCompleteReviewSubmit} className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rate Service Quality
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingInput(s)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${s <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Write a short review for local residents
                </label>
                <textarea
                  rows={2}
                  required
                  value={reviewInput}
                  onChange={e => setReviewInput(e.target.value)}
                  placeholder="e.g., Arrived within 15 minutes, solved the leakage cleanly. Very polite!"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all"
              >
                Submit Review & Save to My Trusted Workers
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
