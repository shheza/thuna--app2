import React from 'react';
import type { Worker } from '../types';
import { useApp } from '../context/AppContext';
import { calculateTrustScore } from '../utils/trustScore';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  BookmarkCheck, 
  Bookmark, 
  PhoneCall, 
  MessageSquare,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  onSelectProfile: (w: Worker) => void;
  onRequestService: (w: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelectProfile, onRequestService }) => {
  const { isWorkerSaved, toggleSaveTrustedWorker, userProfile } = useApp();

  const isSaved = isWorkerSaved(worker.id);
  const trustDetails = calculateTrustScore(worker, userProfile.cityDistrict);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      <div>
        {/* Card Header with Badges & Save Action */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-3">
            
            {/* Worker Avatar & Basic Info */}
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img 
                  src={worker.avatar} 
                  alt={worker.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                {worker.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white" title="Verified Worker">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 
                    onClick={() => onSelectProfile(worker)}
                    className="font-bold text-slate-900 text-base sm:text-lg hover:text-amber-600 cursor-pointer transition-colors line-clamp-1"
                  >
                    {worker.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {worker.serviceName}
                </p>

                {/* Rating & Distance */}
                <div className="flex items-center space-x-3 mt-1 text-xs">
                  <div className="flex items-center font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    <span>{worker.rating}</span>
                    <span className="text-slate-400 font-normal ml-1">({worker.reviewCount})</span>
                  </div>

                  <div className="flex items-center text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <span>{worker.distanceKm} km away</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Save to My Trusted Button */}
            <button
              onClick={() => toggleSaveTrustedWorker(worker.id)}
              title={isSaved ? "Remove from My Trusted" : "Save to My Trusted Workers"}
              className={`p-2.5 rounded-xl transition-all ${
                isSaved 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>

          </div>

          {/* Local Recommendation Banner */}
          <div className="mt-3.5 bg-amber-50/90 border border-amber-200/70 text-amber-900 rounded-xl px-3 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2 font-semibold truncate">
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="truncate">{trustDetails.badgeLabel}</span>
            </div>
            <span className="ml-2 font-bold text-[11px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md shrink-0">
              {trustDetails.recommendationLevel}
            </span>
          </div>

        </div>

        {/* Card Details & Price */}
        <div className="p-4 sm:p-5 space-y-3">
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-semibold ${
                worker.availabilityStatus === 'Available Now' ? 'text-emerald-700' : 'text-slate-600'
              }`}>
                {worker.availabilityStatus}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Starting from</span>
              <span className="text-base font-extrabold text-slate-900">₹{worker.startingPrice}</span>
            </div>
          </div>

          {/* Badges list */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {worker.badges.slice(0, 3).map((b, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                {b}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-0 bg-white border-t border-slate-100 flex items-center gap-2">
        {/* Call Button */}
        <a 
          href={`tel:${worker.phone}`}
          onClick={(e) => {
            e.preventDefault();
            alert(`Demo Call initiated to ${worker.name} at ${worker.phone}`);
          }}
          title="Call Worker"
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center"
        >
          <PhoneCall className="w-4 h-4" />
        </a>

        {/* WhatsApp Button */}
        <a 
          href={`https://wa.me/${worker.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.preventDefault();
            alert(`Opening WhatsApp Chat with ${worker.name} (${worker.phone})`);
          }}
          title="WhatsApp Chat"
          className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors flex items-center justify-center"
        >
          <MessageSquare className="w-4 h-4" />
        </a>

        {/* Request Service Primary CTA */}
        <button
          onClick={() => onRequestService(worker)}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1"
        >
          <span>Request Service</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
