export type ServiceCategory = 
  | 'plumbing'
  | 'electrical'
  | 'carpenter'
  | 'cleaning'
  | 'ac_appliance'
  | 'mechanic'
  | 'locksmith'
  | 'device_repair'
  | 'moving_transport';

export interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  emergencySupported: boolean;
  color: string;
}

export interface PriceItem {
  item: string;
  price: number;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  distanceKm: number;
  locality: string;
  cityDistrict: string;
  rating: number;
  reviewCount: number;
  communityRecommendationsCount: number;
  startingPrice: number;
  isVerified: boolean;
  availabilityStatus: 'Available Now' | 'In 30 mins' | 'Available Tomorrow' | 'Busy';
  isEmergencyAvailable: boolean;
  phone: string;
  whatsapp: string;
  experienceYears: number;
  serviceArea: string[];
  bio: string;
  workPhotos: string[];
  priceList: PriceItem[];
  badges: string[];
}

export interface Review {
  id: string;
  workerId: string;
  userName: string;
  cityDistrict: string;
  livingSituation: 'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel';
  roomAddress?: string;
  rating: number;
  comment: string;
  date: string;
  isRecommended: boolean;
  serviceType: string;
}

export type RequestStatus = 'Request Sent' | 'Worker Accepted' | 'Worker On The Way' | 'Service Completed' | 'Cancelled';

export interface ServiceRequest {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerPhone: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  userName: string;
  userPhone: string;
  cityDistrict: string;
  locality: string;
  livingSituation: string;
  addressDetails: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  estimatedPrice: number;
  status: RequestStatus;
  isEmergency: boolean;
  emergencyType?: string;
  createdAt: string;
  updatedAt: string;
  userRating?: number;
  userReview?: string;
}

export interface UserProfile {
  name: string;
  cityDistrict: string;
  locality: string;
  livingSituation: 'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel';
  addressDetails: string;
  phone: string;
  email?: string;
  isOnboarded: boolean;
  accountType?: AccountType;
}

export interface CommunityTip {
  id: string;
  author: string;
  cityDistrict: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
}

export type AppView = 
  | 'landing'
  | 'home'
  | 'discovery'
  | 'my_trusted'
  | 'community_hub'
  | 'requests'
  | 'worker_portal';

export type RoleMode = 'student' | 'worker';

export type AccountType = 'client' | 'worker';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: AccountType;
  avatar?: string;
  createdAt: string;
  workerProfileId?: string;
}

export interface ClientRegistrationData {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  cityDistrict: string;
  locality: string;
  livingSituation: 'PG' | 'Shared Apartment' | 'Single Flat' | 'Hostel';
  addressDetails: string;
}

export interface WorkerRegistrationData {
  name: string;
  businessName?: string;
  serviceCategory: ServiceCategory;
  phone: string;
  whatsapp?: string;
  email?: string;
  password?: string;
  cityDistrict: string;
  locality: string;
  experienceYears: number;
  startingPrice: number;
  isEmergencyAvailable: boolean;
  bio: string;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  clientName: string;
  locality: string;
  address: string;
  emergencyType: string;
  phone: string;
  category?: ServiceCategory;
}
