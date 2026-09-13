import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserProfile, 
  Worker, 
  Review, 
  ServiceRequest, 
  AppView, 
  RoleMode, 
  ServiceCategory,
  RequestStatus,
  AccountType,
  AuthUser,
  ClientRegistrationData,
  WorkerRegistrationData,
  EmergencyAlert
} from '../types';
import { INITIAL_WORKERS, INITIAL_REVIEWS, DISTRICTS_CITIES, LOCALITIES_BY_DISTRICT } from '../data/initialData';

interface AppContextType {
  // User & Auth State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  activeWorkerId: string | null;
  setActiveWorkerId: (id: string | null) => void;
  getActiveWorker: () => Worker;

  // General App State
  workers: Worker[];
  reviews: Review[];
  trustedWorkerIds: string[];
  requests: ServiceRequest[];
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;
  selectedCategory: ServiceCategory | null;
  setSelectedCategory: (cat: ServiceCategory | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Sliders
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  authModalRole: AccountType | null;
  setAuthModalRole: (role: AccountType | null) => void;
  openAuthModal: (mode?: 'login' | 'signup', role?: AccountType) => void;
  
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;

  selectedWorkerForProfile: Worker | null;
  setSelectedWorkerForProfile: (w: Worker | null) => void;
  selectedWorkerForRequest: Worker | null;
  setSelectedWorkerForRequest: (w: Worker | null) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  emergencyCategoryFilter: string | null;
  setEmergencyCategoryFilter: (type: string | null) => void;
  
  // Emergency Alert State for Workers
  activeEmergencyAlert: EmergencyAlert | null;
  triggerEmergencyAlert: (custom?: Partial<EmergencyAlert>) => void;
  dismissEmergencyAlert: () => void;
  
  // Actions & Auth Methods
  registerClient: (data: ClientRegistrationData) => void;
  registerWorker: (data: WorkerRegistrationData) => Worker;
  login: (identifier: string, role: AccountType, password?: string) => boolean;
  loginAsDemo: (role: AccountType, specificWorkerId?: string) => void;
  logout: () => void;

  completeOnboarding: (profile: UserProfile) => void;
  toggleSaveTrustedWorker: (workerId: string) => void;
  isWorkerSaved: (workerId: string) => boolean;
  recommendWorker: (workerId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  createServiceRequest: (params: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ServiceRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  updateWorkerAvailability: (workerId: string, status: Worker['availabilityStatus']) => void;
  updateWorkerProfile: (workerId: string, updates: Partial<Worker>) => void;
  resetDemoData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Thomas',
  cityDistrict: DISTRICTS_CITIES[0], // Ernakulam / Kochi
  locality: LOCALITIES_BY_DISTRICT[DISTRICTS_CITIES[0]][0], // Edappally
  livingSituation: 'Shared Apartment',
  addressDetails: 'Green Acres Flat 3B, Edappally',
  phone: '+91 98950 11223',
  email: 'alex.thomas@example.com',
  isOnboarded: false,
  accountType: 'client'
};

const INITIAL_DEMO_REQUEST: ServiceRequest = {
  id: 'req-demo-1',
  workerId: 'w1',
  workerName: 'Rahul K. (Rahul Plumbing Services)',
  workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  workerPhone: '+91 98470 12345',
  serviceCategory: 'plumbing',
  serviceTitle: 'Washroom Tap Leakage Repair',
  userName: 'Alex Thomas',
  userPhone: '+91 98950 11223',
  cityDistrict: DISTRICTS_CITIES[0],
  locality: LOCALITIES_BY_DISTRICT[DISTRICTS_CITIES[0]][0],
  livingSituation: 'Shared Apartment',
  addressDetails: 'Green Acres Flat 3B, Edappally',
  problemDescription: 'Water tap leaking continuously near wash basin',
  preferredDate: 'Today',
  preferredTime: 'Immediate',
  estimatedPrice: 200,
  status: 'Worker On The Way',
  isEmergency: false,
  createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('thuna_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('thuna_is_auth') === 'true';
  });

  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('thuna_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [activeWorkerId, setActiveWorkerId] = useState<string | null>(() => {
    return localStorage.getItem('thuna_active_worker_id') || 'w1';
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('thuna_workers');
    if (saved) {
      try {
        const parsed: Worker[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_WORKERS.length) {
          return parsed;
        }
        // Automatically incorporate newly defined initial workers
        const existingIds = new Set(parsed.map(w => w.id));
        const missing = INITIAL_WORKERS.filter(w => !existingIds.has(w.id));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_WORKERS;
      }
    }
    return INITIAL_WORKERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('thuna_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [trustedWorkerIds, setTrustedWorkerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('thuna_trusted_ids');
    return saved ? JSON.parse(saved) : ['w1', 'w2', 'w5']; // Rahul, Anwar, Kabeer
  });

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('thuna_requests');
    return saved ? JSON.parse(saved) : [INITIAL_DEMO_REQUEST];
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    const isAuth = localStorage.getItem('thuna_is_auth') === 'true';
    const userRole = localStorage.getItem('thuna_current_user');
    if (isAuth && userRole) {
      try {
        const parsed = JSON.parse(userRole);
        if (parsed.role === 'worker') return 'worker_portal';
        return 'home';
      } catch {
        return 'home';
      }
    }
    return 'landing';
  });
  
  const [roleMode, setRoleMode] = useState<RoleMode>(() => {
    const savedUser = localStorage.getItem('thuna_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.role === 'worker' ? 'worker' : 'student';
      } catch {
        return 'student';
      }
    }
    return 'student';
  });

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Popups
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [authModalRole, setAuthModalRole] = useState<AccountType | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);

  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<Worker | null>(null);
  const [selectedWorkerForRequest, setSelectedWorkerForRequest] = useState<Worker | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpenState] = useState<boolean>(false);
  const [emergencyCategoryFilter, setEmergencyCategoryFilter] = useState<string | null>(null);

  // Active Emergency Alert State (broadcast to workers)
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState<EmergencyAlert | null>(() => {
    const saved = localStorage.getItem('thuna_emergency_alert');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeEmergencyAlert) {
      localStorage.setItem('thuna_emergency_alert', JSON.stringify(activeEmergencyAlert));
    } else {
      localStorage.removeItem('thuna_emergency_alert');
    }
  }, [activeEmergencyAlert]);

  const triggerEmergencyAlert = (custom?: Partial<EmergencyAlert>) => {
    const alert: EmergencyAlert = {
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      clientName: userProfile.name || 'Alex Thomas',
      locality: userProfile.locality || 'Edappally',
      address: userProfile.addressDetails || 'Green Acres Flat 3B, Edappally',
      emergencyType: custom?.emergencyType || 'Urgent Water Leakage / Pipe Burst SOS',
      phone: userProfile.phone || '+91 98950 11223',
      category: custom?.category || 'plumbing',
      ...custom
    };
    setActiveEmergencyAlert(alert);
  };

  const dismissEmergencyAlert = () => {
    setActiveEmergencyAlert(null);
  };

  const setIsEmergencyModalOpen = (open: boolean) => {
    setIsEmergencyModalOpenState(open);
    if (open) {
      triggerEmergencyAlert();
    }
  };

  // Sync states to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('thuna_current_user', JSON.stringify(currentUser));
      localStorage.setItem('thuna_is_auth', 'true');
    } else {
      localStorage.removeItem('thuna_current_user');
      localStorage.setItem('thuna_is_auth', 'false');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeWorkerId) {
      localStorage.setItem('thuna_active_worker_id', activeWorkerId);
    }
  }, [activeWorkerId]);

  useEffect(() => {
    localStorage.setItem('thuna_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('thuna_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('thuna_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('thuna_trusted_ids', JSON.stringify(trustedWorkerIds));
  }, [trustedWorkerIds]);

  useEffect(() => {
    localStorage.setItem('thuna_requests', JSON.stringify(requests));
  }, [requests]);

  const openAuthModal = (mode: 'login' | 'signup' = 'signup', role?: AccountType) => {
    setAuthModalMode(mode);
    setAuthModalRole(role || null);
    setIsAuthModalOpen(true);
  };

  const getActiveWorker = (): Worker => {
    if (activeWorkerId) {
      const found = workers.find(w => w.id === activeWorkerId);
      if (found) return found;
    }
    return workers[0] || INITIAL_WORKERS[0];
  };

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
  };

  const registerClient = (data: ClientRegistrationData) => {
    const newAuthUser: AuthUser = {
      id: `client-${Date.now()}`,
      name: data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@thuna.user`,
      phone: data.phone,
      role: 'client',
      createdAt: new Date().toISOString()
    };

    const newProfile: UserProfile = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      cityDistrict: data.cityDistrict,
      locality: data.locality,
      livingSituation: data.livingSituation,
      addressDetails: data.addressDetails,
      isOnboarded: true,
      accountType: 'client'
    };

    setCurrentUser(newAuthUser);
    setIsAuthenticated(true);
    setUserProfileState(newProfile);
    setRoleMode('student');
    setActiveView('home');
    setIsAuthModalOpen(false);
  };

  const registerWorker = (data: WorkerRegistrationData): Worker => {
    const workerId = `w-${Date.now()}`;
    const defaultAvatars: Record<ServiceCategory, string> = {
      plumbing: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      electrical: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      carpenter: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      cleaning: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      ac_appliance: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      mechanic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      locksmith: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      device_repair: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      moving_transport: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
    };

    const newWorker: Worker = {
      id: workerId,
      name: data.businessName ? `${data.name} (${data.businessName})` : data.name,
      avatar: defaultAvatars[data.serviceCategory] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      serviceCategory: data.serviceCategory,
      serviceName: data.businessName || `${data.name} Professional Services`,
      distanceKm: 0.8,
      locality: data.locality,
      cityDistrict: data.cityDistrict,
      rating: 5.0,
      reviewCount: 1,
      communityRecommendationsCount: 1,
      startingPrice: data.startingPrice,
      isVerified: true,
      availabilityStatus: 'Available Now',
      isEmergencyAvailable: data.isEmergencyAvailable,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      experienceYears: data.experienceYears,
      serviceArea: [data.locality, `${data.locality} surroundings`, 'City Center'],
      bio: data.bio || `Experienced ${data.serviceCategory} specialist serving ${data.locality}. Committed to honest, prompt, transparent service for students and residents.`,
      workPhotos: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
      ],
      priceList: [
        { item: 'Inspection & Diagnosis', price: data.startingPrice },
        { item: 'Standard Repair Service', price: Math.round(data.startingPrice * 1.5) },
        { item: 'Full Service / Replacement', price: Math.round(data.startingPrice * 2.5) }
      ],
      badges: ['Verified Worker', 'Direct Contact', 'Community Partner']
    };

    const newAuthUser: AuthUser = {
      id: `auth-${workerId}`,
      name: data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@pro.thuna`,
      phone: data.phone,
      role: 'worker',
      avatar: newWorker.avatar,
      createdAt: new Date().toISOString(),
      workerProfileId: workerId
    };

    setWorkers(prev => [newWorker, ...prev]);
    setCurrentUser(newAuthUser);
    setIsAuthenticated(true);
    setActiveWorkerId(workerId);
    setRoleMode('worker');
    setActiveView('worker_portal');
    setIsAuthModalOpen(false);

    return newWorker;
  };

  const login = (identifier: string, role: AccountType, _password?: string): boolean => {
    if (role === 'worker') {
      const match = workers.find(w => 
        w.phone.includes(identifier.trim()) || 
        w.name.toLowerCase().includes(identifier.toLowerCase())
      ) || workers[0];

      const user: AuthUser = {
        id: `auth-${match.id}`,
        name: match.name.split('(')[0].trim(),
        phone: match.phone,
        role: 'worker',
        avatar: match.avatar,
        createdAt: new Date().toISOString(),
        workerProfileId: match.id
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveWorkerId(match.id);
      setRoleMode('worker');
      setActiveView('worker_portal');
      setIsAuthModalOpen(false);
      return true;
    } else {
      const user: AuthUser = {
        id: `client-${Date.now()}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : userProfile.name,
        email: identifier.includes('@') ? identifier : userProfile.email,
        phone: userProfile.phone,
        role: 'client',
        createdAt: new Date().toISOString()
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setRoleMode('student');
      setActiveView('home');
      setIsAuthModalOpen(false);
      return true;
    }
  };

  const loginAsDemo = (role: AccountType, specificWorkerId?: string) => {
    if (role === 'worker') {
      const targetWorker = specificWorkerId 
        ? (workers.find(w => w.id === specificWorkerId) || workers[0])
        : workers[0];
      
      const user: AuthUser = {
        id: `auth-${targetWorker.id}`,
        name: targetWorker.name.split('(')[0].trim(),
        phone: targetWorker.phone,
        role: 'worker',
        avatar: targetWorker.avatar,
        createdAt: new Date().toISOString(),
        workerProfileId: targetWorker.id
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveWorkerId(targetWorker.id);
      setRoleMode('worker');
      setActiveView('worker_portal');
      setIsAuthModalOpen(false);
    } else {
      const demoClientProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        isOnboarded: true,
        accountType: 'client'
      };

      const user: AuthUser = {
        id: 'client-demo-alex',
        name: demoClientProfile.name,
        email: demoClientProfile.email,
        phone: demoClientProfile.phone,
        role: 'client',
        createdAt: new Date().toISOString()
      };

      setUserProfileState(demoClientProfile);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setRoleMode('student');
      setActiveView('home');
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRoleMode('student');
    setActiveView('landing');
  };

  const completeOnboarding = (profile: UserProfile) => {
    setUserProfileState({ ...profile, isOnboarded: true });
    setActiveView('home');
  };

  const toggleSaveTrustedWorker = (workerId: string) => {
    setTrustedWorkerIds(prev => {
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      } else {
        return [...prev, workerId];
      }
    });
  };

  const isWorkerSaved = (workerId: string) => {
    return trustedWorkerIds.includes(workerId);
  };

  const recommendWorker = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          communityRecommendationsCount: w.communityRecommendationsCount + 1
        };
      }
      return w;
    }));
  };

  const addReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    setReviews(prev => [newReview, ...prev]);

    // Also update worker review stats
    setWorkers(prev => prev.map(w => {
      if (w.id === newReviewData.workerId) {
        const newCount = w.reviewCount + 1;
        const newRating = Number(((w.rating * w.reviewCount + newReviewData.rating) / newCount).toFixed(1));
        const newRecs = newReviewData.isRecommended ? w.communityRecommendationsCount + 1 : w.communityRecommendationsCount;
        return {
          ...w,
          reviewCount: newCount,
          rating: newRating,
          communityRecommendationsCount: newRecs
        };
      }
      return w;
    }));
  };

  const createServiceRequest = (params: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      ...params,
      id: `req-${Date.now()}`,
      status: 'Request Sent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRequests(prev => [newReq, ...prev]);
    
    // Auto save worker to trusted list after requesting if not already saved
    if (!trustedWorkerIds.includes(params.workerId)) {
      setTrustedWorkerIds(prev => [...prev, params.workerId]);
    }

    return newReq;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    }));
  };

  const updateWorkerAvailability = (workerId: string, status: Worker['availabilityStatus']) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, availabilityStatus: status } : w));
  };

  const updateWorkerProfile = (workerId: string, updates: Partial<Worker>) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...updates } : w));
  };

  const resetDemoData = () => {
    localStorage.removeItem('thuna_current_user');
    localStorage.removeItem('thuna_is_auth');
    localStorage.removeItem('thuna_active_worker_id');
    localStorage.removeItem('thuna_user_profile');
    localStorage.removeItem('thuna_workers');
    localStorage.removeItem('thuna_reviews');
    localStorage.removeItem('thuna_trusted_ids');
    localStorage.removeItem('thuna_requests');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserProfileState(DEFAULT_PROFILE);
    setWorkers(INITIAL_WORKERS);
    setReviews(INITIAL_REVIEWS);
    setTrustedWorkerIds(['w1', 'w2', 'w5']);
    setRequests([INITIAL_DEMO_REQUEST]);
    setActiveEmergencyAlert(null);
    localStorage.removeItem('thuna_emergency_alert');
    setActiveWorkerId('w1');
    setRoleMode('student');
    setActiveView('landing');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      userProfile,
      setUserProfile,
      activeWorkerId,
      setActiveWorkerId,
      getActiveWorker,
      workers,
      reviews,
      trustedWorkerIds,
      requests,
      activeView,
      setActiveView,
      roleMode,
      setRoleMode,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      authModalRole,
      setAuthModalRole,
      openAuthModal,
      isUserProfileModalOpen,
      setIsUserProfileModalOpen,
      selectedWorkerForProfile,
      setSelectedWorkerForProfile,
      selectedWorkerForRequest,
      setSelectedWorkerForRequest,
      isEmergencyModalOpen,
      setIsEmergencyModalOpen,
      emergencyCategoryFilter,
      setEmergencyCategoryFilter,
      activeEmergencyAlert,
      triggerEmergencyAlert,
      dismissEmergencyAlert,
      registerClient,
      registerWorker,
      login,
      loginAsDemo,
      logout,
      completeOnboarding,
      toggleSaveTrustedWorker,
      isWorkerSaved,
      recommendWorker,
      addReview,
      createServiceRequest,
      updateRequestStatus,
      updateWorkerAvailability,
      updateWorkerProfile,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
