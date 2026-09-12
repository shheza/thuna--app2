import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Star,
  Briefcase,
  Wrench,
  UserCheck,
  Sparkles,
  Compass,
  Radio,
  Award,
  PhoneCall
} from 'lucide-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onExploreDirectly: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding, onExploreDirectly }) => {
  const { openAuthModal } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-between overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Tagline Badge with Icon */}
          <div className="inline-flex items-center space-x-2 bg-amber-100/90 border border-amber-300/80 px-4 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-amber-950">
              Your trusted local contacts, wherever you live
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Moving to a new city shouldn't mean <span className="text-amber-600 font-black">starting from zero.</span>
          </h1>

          {/* Subheading with Icon */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-600 inline mr-2 shrink-0 hidden sm:inline" />
            <span>Find trusted local plumbers, electricians, locksmiths, and repair technicians recommended by young adults, interns, and residents in your city & neighborhood.</span>
          </p>

          {/* Primary Action CTAs with Signup */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDirectly}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base px-6 py-4 rounded-2xl border border-slate-300 shadow-xs transition-all"
            >
              <Users className="w-5 h-5 text-amber-600" />
              <span>Explore Workers Directly</span>
            </button>
          </div>

          {/* Direct Role Signup Choices */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="text-slate-400 font-medium">Or jump straight to:</span>
            <button
              onClick={() => openAuthModal('signup', 'client')}
              className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Sign Up as Resident / Student</span>
            </button>
            <button
              onClick={() => openAuthModal('signup', 'worker')}
              className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl transition-colors shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Register as Service Worker</span>
            </button>
          </div>

          {/* Quick Trust Guarantee with Icons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Verified Local Workers</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Community Recommendation Scores</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Direct Call / WhatsApp (No Middlemen)</span>
            </div>
          </div>

        </div>

        {/* Live Mock City Card Preview */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2.5">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Local Network • Ernakulam / Kochi District
              </span>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              Edappally & Kalamassery
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    🔧 Plumber
                  </span>
                  <span className="text-xs font-bold text-slate-600 flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> 4.9
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Rahul Plumbing Services</h4>
                <p className="text-xs text-slate-500 mt-1">📍 0.8 km away • Available now</p>
                <div className="mt-3 bg-amber-100/70 text-amber-900 text-[11px] font-semibold p-2 rounded-xl flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Recommended by 38 locals in Kochi</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">From ₹150</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Verified</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    ⚡ Electrician
                  </span>
                  <span className="text-xs font-bold text-slate-600 flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> 4.8
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Anwar Electricals</h4>
                <p className="text-xs text-slate-500 mt-1">📍 1.1 km away • Available now</p>
                <div className="mt-3 bg-amber-100/70 text-amber-900 text-[11px] font-semibold p-2 rounded-xl flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Recommended by 42 young adults</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">From ₹180</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Verified</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md">
                    🔑 Locksmith
                  </span>
                  <span className="text-xs font-bold text-slate-600 flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> 4.9
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Kabeer Emergency Locksmith</h4>
                <p className="text-xs text-slate-500 mt-1">📍 0.5 km away • 15 min express</p>
                <div className="mt-3 bg-red-100/70 text-red-900 text-[11px] font-semibold p-2 rounded-xl flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                  <span>Night Lockout Responder</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">From ₹200</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Verified</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Dedicated Section for Skilled Tradespeople & Workers */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-400 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>For Local Pros & Technicians</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Are you a skilled electrician, plumber, or appliance tech?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect directly with young renters, college students, and apartment owners within 3 km of your workshop. <strong>Zero commission cuts</strong> — keep 100% of what you earn and build long-term trusted relationships.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-lg font-black text-amber-400 block">0% Fees</span>
                  <span className="text-xs text-slate-400">No middlemen or hidden commissions</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-lg font-black text-emerald-400 block">Direct Phone</span>
                  <span className="text-xs text-slate-400">Customers call & WhatsApp you directly</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-lg font-black text-white block">Verified Pro</span>
                  <span className="text-xs text-slate-400">Local trust score & recommendation badges</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3 bg-slate-800/90 p-6 rounded-3xl border border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-white text-lg text-center">List Your Trade Today</h3>
              <p className="text-xs text-slate-400 text-center">Takes less than 2 minutes to create your profile and start accepting jobs.</p>
              
              <button
                onClick={() => openAuthModal('signup', 'worker')}
                className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-100"
              >
                <span>Register as a Worker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Community-Backed Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why residents trust thuna over generic service apps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 flex items-center justify-center space-x-1.5">
              <Users className="w-4 h-4 text-amber-600 inline shrink-0" />
              <span>Built specifically for young adults, interns, PGs, and shared flat residents.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200/80">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold mb-4 shadow-md shadow-amber-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Local Trust System</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                See how many young adults and residents in your district recommended a worker. Filter authentic reviews from nearby PGs, flats, and neighborhoods.
              </p>
            </div>

            <div className="bg-red-50/50 p-6 rounded-3xl border border-red-200/80">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold mb-4 shadow-md shadow-red-600/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-Tap Emergency Help</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pipe burst? Locked out of your flat at midnight? Scooter battery died? Tap "I NEED HELP NOW" to get matched with emergency workers within 2km instantly.
              </p>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold mb-4 shadow-md shadow-emerald-600/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">"My Trusted Workers" Rolodex</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                After using a reliable plumber or electrician once, save them to your personal trusted contact book. Never search from scratch again.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <p className="font-medium text-slate-300">
          thuna • Your Trusted Local Service Network for Young Adults & Residents
        </p>
        <p className="mt-2 text-slate-500">
          Serving Kochi, Malappuram, Calicut, Trivandrum, Thrissur & Cities Across Kerala
        </p>
      </footer>

    </div>
  );
};
