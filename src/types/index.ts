export type UserRole = 'Super Admin' | 'Admin' | 'Support';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'driver' | 'passenger';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  rating: number;
  totalRides: number;
}

export interface Ride {
  id: string;
  userId: string;
  userName: string;
  driverId?: string;
  driverName?: string;
  status: 'completed' | 'ongoing' | 'cancelled' | 'pending';
  fare: number;
  pickup: string;
  destination: string;
  startTime: string;
  endTime?: string;
}

export interface AnalyticsData {
  totalRides: number;
  activeDrivers: number;
  totalUsers: number;
  totalRevenue: number;
  averageRating: number;
  pendingRequests: number;
  revenueByPeriod: {
    labels: string[];
    data: number[];
  };
  rideStatusDistribution: {
    status: string;
    count: number;
  }[];
  ridesOverTime: {
    date: string;
    count: number;
  }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
}

export interface VerificationRequest {
  id: string;
  driverId: string;
  driverName: string;
  submittedAt: string;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  status: 'pending' | 'approved' | 'rejected';
}
