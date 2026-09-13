import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkerDiscovery } from './components/WorkerDiscovery';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { RequestServiceModal } from './components/RequestServiceModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { RequestTracking } from './components/RequestTracking';
import { MyTrustedWorkers } from './components/MyTrustedWorkers';
import { CampusCommunity } from './components/CampusCommunity';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { FloatingEmergencyButton } from './components/FloatingEmergencyButton';

const MainAppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView,
    roleMode, 
    selectedWorkerForProfile, 
    setSelectedWorkerForProfile,
    selectedWorkerForRequest,
    setSelectedWorkerForRequest,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    openAuthModal
  } = useApp();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Render view router
  const renderView = () => {
    if (roleMode === 'worker') {
      return <WorkerDashboard />;
    }

    switch (activeView) {
      case 'landing':
        return (
          <LandingPage 
            onStartOnboarding={() => openAuthModal('signup', 'client')}
            onExploreDirectly={() => setActiveView('home')}
          />
        );
      case 'home':
        return <HomeDashboard />;
      case 'discovery':
        return <WorkerDiscovery />;
      case 'community_hub':
        return <CampusCommunity />;
      case 'my_trusted':
        return <MyTrustedWorkers />;
      case 'requests':
        return <RequestTracking />;
      case 'worker_portal':
        return <WorkerDashboard />;
      default:
        return (
          <LandingPage 
            onStartOnboarding={() => openAuthModal('signup', 'client')}
            onExploreDirectly={() => setActiveView('home')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {renderView()}
      </main>

      {/* Global Modals */}
      <AuthModal />

      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <WorkerProfileModal
        worker={selectedWorkerForProfile}
        onClose={() => setSelectedWorkerForProfile(null)}
        onRequestService={(w) => setSelectedWorkerForRequest(w)}
      />

      <RequestServiceModal
        worker={selectedWorkerForRequest}
        onClose={() => setSelectedWorkerForRequest(null)}
      />

      {/* Floating Emergency Action Button (Bottom Right) */}
      <FloatingEmergencyButton />

      <EmergencyHelpModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
