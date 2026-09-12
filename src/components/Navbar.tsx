import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Search, 
  BookmarkCheck, 
  Users, 
  Clock, 
  Briefcase,
  MapPin,
  RefreshCw,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import type { AppView } from '../types';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    roleMode, 
    setRoleMode, 
    userProfile, 
    requests,
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    setIsUserProfileModalOpen,
    activeEmergencyAlert,
    resetDemoData
  } = useApp();

  const activeRequestsCount = requests.filter(r => r.status !== 'Service Completed' && r.status !== 'Cancelled').length;

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'discovery', label: 'Find Workers', icon: <Search className="w-4 h-4" /> },
    { id: 'community_hub', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'my_trusted', label: 'My Trusted', icon: <BookmarkCheck className="w-4 h-4" /> },
    { id: 'requests', label: 'Requests', icon: <Clock className="w-4 h-4" />, badge: activeRequestsCount }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Top Banner: Role Switcher & System Status */}
      <div className="bg-slate-950 text-white text-xs px-4 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Network
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px] font-medium">
            Local service network for students, renters & neighborhood pros
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Segmented Role Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setRoleMode('student');
                if (activeView === 'worker_portal') setActiveView('landing');
              }}
              className={`px-2.5 py-0.5 rounded-md font-bold text-xs transition-all ${
                roleMode === 'student' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👤 Resident
            </button>
            <button
              onClick={() => {
                setRoleMode('worker');
                setActiveView('worker_portal');
              }}
              className={`px-2.5 py-0.5 rounded-md font-bold text-xs transition-all relative ${
                roleMode === 'worker' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔧 Worker View</span>
              {activeEmergencyAlert && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>
          </div>

          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('signup', 'worker')}
              className="hidden md:inline text-amber-400 hover:text-amber-300 text-[11px] font-bold transition-colors"
            >
              Join as Pro
            </button>
          )}

          <button
            onClick={resetDemoData}
            title="Reset All Demo Data"
            className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Clean Brand Logo without 'Local Contacts' */}
          <div 
            title="Return to Thuna Home"
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0" 
            onClick={() => {
              setRoleMode('student');
              setActiveView('landing');
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              th<span className="text-white">.</span>
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tight font-sans group-hover:text-amber-600 transition-colors">
              thuna
            </span>
          </div>

          {/* Center: Organized Floating Pill Menu for Resident Mode */}
          {roleMode === 'student' ? (
            <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shadow-xs">
              {navItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-xs shadow-slate-200/50'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-2 bg-slate-900 text-white px-4 py-1.5 rounded-2xl shadow-xs">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">Worker Service Portal</span>
            </div>
          )}

          {/* Right Action Cluster: Emergency & Auth Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Location Pill (compact) */}
            {roleMode === 'student' && userProfile.isOnboarded && (
              <div className="hidden xl:flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 truncate max-w-[110px]">
                  {userProfile.locality}
                </span>
              </div>
            )}


            {/* Auth / Profile Area */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'worker') {
                      setActiveView('worker_portal');
                    } else {
                      setIsUserProfileModalOpen(true);
                    }
                  }}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-xs"
                  title="View Profile"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold uppercase">
                    {currentUser.role === 'worker' ? 'Pro' : 'Resident'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile View Indicator */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => {
                  setRoleMode('student');
                  setActiveView('landing');
                }}
                className="p-2 text-slate-600 hover:text-slate-900 font-bold text-xs bg-slate-100 rounded-lg"
              >
                Home
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {roleMode === 'student' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-lg">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium relative ${
                activeView === item.id ? 'text-amber-600 font-bold' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 right-1 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
