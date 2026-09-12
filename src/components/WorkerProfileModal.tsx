import React, { useState } from 'react';
import type { Worker } from '../types';
import { useApp } from '../context/AppContext';
import { calculateTrustScore } from '../utils/trustScore';
import { 
  X, 
  Star, 
  MapPin, 
  CheckCircle2, 
  BookmarkCheck, 
  Bookmark, 
  PhoneCall, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Check,
  PlusCircle,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

interface WorkerProfileModalProps {
  worker: Worker | null;
  onClose: () => void;
  onRequestService: (w: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ worker, onClose, onRequestService }) => {
  const { 
    isWorkerSaved, 
    toggleSaveTrustedWorker, 
    recommendWorker, 
    reviews, 
    addReview, 
    userProfile 
  } = useApp();

  const [hasRecommended, setHasRecommended] = useState<boolean>(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  if (!worker) return null;

  const isSaved = isWorkerSaved(worker.id);
  const trustDetails = calculateTrustScore(worker, userProfile.cityDistrict);

  // Filter reviews for this worker
  const workerReviews = reviews.filter(r => r.workerId === worker.id);

  const handleRecommendClick = () => {
    if (!hasRecommended) {
      recommendWorker(worker.id);
      setHasRecommended(true);
    }
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      workerId: worker.id,
      userName: userProfile.name || 'Resident',
      cityDistrict: userProfile.cityDistrict,
      livingSituation: userProfile.livingSituation,
      roomAddress: userProfile.addressDetails,
      rating: newRating,
      comment: newComment,
      isRecommended: true,
      serviceType: worker.serviceName
    });

    setNewComment('');
    setShowAddReviewForm(false);
    setHasRecommended(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto relative">
        
        {/* Header Cover Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full backdrop-blur-xs transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img 
                src={worker.avatar} 
                alt={worker.name} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-800 shadow-lg"
              />
              {worker.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-slate-800" title="Verified Worker">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{worker.name}</h2>
                {worker.isVerified && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{worker.serviceName}</p>

              <div className="flex items-center space-x-4 text-xs pt-1 text-slate-300">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  {worker.rating} ({worker.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {worker.locality} ({worker.distanceKm} km)
                </span>
              </div>
            </div>
          </div>

          {/* Local Recommendation Banner */}
          <div className="mt-4 bg-amber-500/20 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-amber-200">{trustDetails.badgeLabel}</span>
            </div>
            <button
              onClick={handleRecommendClick}
              disabled={hasRecommended}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center space-x-1 ${
                hasRecommended
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
              }`}
            >
              {hasRecommended ? <Check className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
              <span>{hasRecommended ? 'Recommended!' : 'Recommend'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Experience</span>
              <span className="text-sm font-extrabold text-slate-900">{worker.experienceYears} Years</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting Price</span>
              <span className="text-sm font-extrabold text-amber-600">₹{worker.startingPrice}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-700">{worker.availabilityStatus}</span>
            </div>
          </div>

          {/* About & Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About & Services</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {worker.bio}
            </p>
          </div>

          {/* Price List Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Standard Job Price Estimates</h4>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {worker.priceList.map((p, idx) => (
                <div key={idx} className="p-3 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50">
                  <span className="font-medium text-slate-700">{p.item}</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Work Photos Gallery */}
          {worker.workPhotos && worker.workPhotos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Previous Work Photos</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {worker.workPhotos.map((img, i) => (
                  <img key={i} src={img} alt="Past Work" className="w-full h-36 rounded-2xl object-cover border border-slate-200 shadow-xs" />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resident Reviews ({workerReviews.length})
              </h4>
              <button
                onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Write Review Form */}
            {showAddReviewForm && (
              <form onSubmit={handleAddReviewSubmit} className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                <h5 className="font-bold text-xs text-amber-950">Add Review for {worker.name}</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-700">Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your experience (e.g. fixed tap leakage quickly, honest pricing)..."
                  className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReviewForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {workerReviews.map(r => (
                <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{r.userName}</span>
                      <span className="bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                        {r.livingSituation} ({r.roomAddress || 'Local Resident'})
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{r.date}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-normal">{r.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={() => toggleSaveTrustedWorker(worker.id)}
            className={`p-3 rounded-2xl border transition-all ${
              isSaved 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-600" /> : <Bookmark className="w-5 h-5" />}
          </button>

          <a 
            href={`tel:${worker.phone}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Calling ${worker.name} at ${worker.phone}`);
            }}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center space-x-1"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </a>

          <a 
            href={`https://wa.me/${worker.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              alert(`Opening WhatsApp Chat with ${worker.name}`);
            }}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-xs flex items-center space-x-1"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onRequestService(worker);
            }}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm py-3 px-4 rounded-2xl shadow-md transition-all text-center"
          >
            Request Service
          </button>

        </div>

      </div>
    </div>
  );
};
