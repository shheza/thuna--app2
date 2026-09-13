import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Phone, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  Eye, 
  MessageSquare,
  Zap,
  MapPin
} from 'lucide-react';

export const WorkerPublicProfileView: React.FC = () => {
  const { getActiveWorker, setSelectedWorkerForProfile } = useApp();
  const worker = getActiveWorker();

  const [copied, setCopied] = useState<boolean>(false);

  // Generate public profile URL
  const profileUrl = `${window.location.origin}${window.location.pathname}#/pro/${worker.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello! Need reliable ${worker.serviceName}? Check out my verified profile and book directly on Thuna with 0% middleman fees: ${profileUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-amber-400/30">
                Digital Business Card
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Public Presence</span>
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1.5 flex items-center space-x-2">
              <QrCode className="w-6 h-6 text-amber-400" />
              <span>Public Profile & Business QR Code</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Share your direct Thuna link with residents, paste your QR standee at your counter or vehicle, and get direct bookings with 0% middleman fees.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={() => setSelectedWorkerForProfile(worker)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center space-x-2 border border-white/20 transition-all"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Preview Resident View</span>
            </button>
          </div>
        </div>

        {/* Share Link Row */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="w-full flex-1 flex items-center bg-slate-950/80 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-300 overflow-hidden">
            <Share2 className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <span className="truncate font-mono select-all">{profileUrl}</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-400/20 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Live Preview Card on Left & Business QR Standee on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Live Public Profile Card Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Resident Perspective
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Live Public Directory Card
                </h3>
              </div>

              <button
                onClick={() => setSelectedWorkerForProfile(worker)}
                className="text-xs text-amber-600 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Full Modal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rendered Resident Discovery Card */}
            <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-black text-base text-slate-900">{worker.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">{worker.serviceName}</p>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>{worker.locality} • {worker.cityDistrict.split('(')[0].trim()}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Visit from</span>
                  <span className="text-base font-black text-emerald-600">₹{worker.startingPrice}</span>
                </div>
              </div>

              {/* Stats pill bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Rating</span>
                  <span className="font-extrabold text-amber-600 flex items-center justify-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{worker.rating}</span>
                  </span>
                </div>
                <div className="border-x border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Experience</span>
                  <span className="font-extrabold text-slate-800">{worker.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Recommended</span>
                  <span className="font-extrabold text-slate-800">👍 {worker.communityRecommendationsCount}</span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-600 italic bg-white/70 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{worker.bio}"
              </p>

              {/* Direct Connect Buttons (simulated) */}
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={`tel:${worker.phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call {worker.phone}</span>
                </a>
                <button
                  onClick={() => setSelectedWorkerForProfile(worker)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center pt-2">
            ✓ Publicly indexed and searchable across student hostels & residential apartments in {worker.locality}.
          </div>
        </div>

        {/* 2. Business QR Code Standee / Poster */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Instant Customer Booking
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Business QR Code Standee
                </h3>
              </div>

              <button
                onClick={handlePrintQR}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                title="Print Standee / Poster"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Standee</span>
              </button>
            </div>

            {/* Standee Printable Card Preview */}
            <div className="mt-4 bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 p-1.5 rounded-3xl shadow-xl max-w-sm mx-auto text-center">
              <div className="bg-slate-950 text-white rounded-[22px] p-6 space-y-4">
                
                {/* Brand and Verified Pro Header */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
                    th.
                  </div>
                  <span className="font-black text-lg tracking-tight">thuna</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Verified Pro
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-lg text-white">{worker.name}</h4>
                  <p className="text-xs text-amber-300 font-bold">{worker.serviceName} • {worker.locality}</p>
                </div>

                {/* The QR Code Graphic (SVG) */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-4 border-amber-300">
                  <svg viewBox="0 0 100 100" className="w-40 h-40">
                    {/* Top-left position marker */}
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* Top-right position marker */}
                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* Bottom-left position marker */}
                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* QR Data Matrix Patterns */}
                    <rect x="38" y="8" width="8" height="8" fill="#0f172a" />
                    <rect x="50" y="8" width="6" height="6" fill="#0f172a" />
                    <rect x="42" y="20" width="8" height="8" fill="#0f172a" />
                    <rect x="54" y="20" width="6" height="6" fill="#0f172a" />
                    
                    <rect x="8" y="38" width="8" height="8" fill="#0f172a" />
                    <rect x="20" y="42" width="6" height="6" fill="#0f172a" />
                    <rect x="8" y="52" width="8" height="8" fill="#0f172a" />

                    <rect x="38" y="68" width="8" height="8" fill="#0f172a" />
                    <rect x="50" y="72" width="6" height="6" fill="#0f172a" />
                    <rect x="42" y="82" width="8" height="8" fill="#0f172a" />

                    <rect x="68" y="38" width="8" height="8" fill="#0f172a" />
                    <rect x="80" y="42" width="6" height="6" fill="#0f172a" />
                    <rect x="72" y="52" width="8" height="8" fill="#0f172a" />

                    <rect x="68" y="68" width="8" height="8" fill="#0f172a" />
                    <rect x="80" y="72" width="6" height="6" fill="#0f172a" />
                    <rect x="72" y="82" width="8" height="8" fill="#0f172a" />

                    {/* Center Brand Badge */}
                    <circle cx="50" cy="50" r="11" fill="#f59e0b" />
                    <text x="50" y="54" fontSize="10" fontWeight="900" textAnchor="middle" fill="#0f172a">th.</text>
                  </svg>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-amber-300">
                    Scan with any Camera or UPI App
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Direct Call • 0% Middleman • Verified Reviews
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Hotline: <strong>{worker.phone}</strong></span>
                </div>

              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handlePrintQR}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Poster for Shop / Vehicle</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
