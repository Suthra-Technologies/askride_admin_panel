import { User, Ride, AnalyticsData, VerificationRequest } from '../types';

export const mockUsers: User[] = [
  { id: '1', fullName: 'John Doe', email: 'john@example.com', role: 'driver', status: 'active', joinedDate: '2023-01-15', rating: 4.8, totalRides: 156 },
  { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', role: 'passenger', status: 'active', joinedDate: '2023-02-20', rating: 4.9, totalRides: 42 },
  { id: '3', fullName: 'Mike Ross', email: 'mike@example.com', role: 'driver', status: 'pending', joinedDate: '2023-05-10', rating: 0, totalRides: 0 },
  { id: '4', fullName: 'Harvey Specter', email: 'harvey@example.com', role: 'driver', status: 'suspended', joinedDate: '2023-03-05', rating: 4.5, totalRides: 89 },
];

export const mockRides: Ride[] = [
  { id: 'r1', userId: '2', userName: 'Jane Smith', driverId: '1', driverName: 'John Doe', status: 'completed', fare: 25.50, pickup: 'Central Park', destination: 'Main St', startTime: '2023-06-01T10:00:00Z', endTime: '2023-06-01T10:30:00Z' },
  { id: 'r2', userId: '5', userName: 'Alice Brown', driverId: '6', driverName: 'Bob Wilson', status: 'ongoing', fare: 15.00, pickup: 'Airport', destination: 'Hotel Hilton', startTime: '2023-06-01T11:45:00Z' },
  { id: 'r3', userId: '7', userName: 'Charlie Green', status: 'pending', fare: 12.75, pickup: 'Square Garden', destination: 'Wall Street', startTime: '2023-06-01T12:00:00Z' },
];

export const mockAnalytics: AnalyticsData = {
  totalRides: 1250,
  activeDrivers: 45,
  totalUsers: 850,
  totalRevenue: 25400,
  averageRating: 4.7,
  pendingRequests: 12,
  revenueByPeriod: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1200, 1500, 1100, 1800, 2200, 3000, 2800],
  },
  rideStatusDistribution: [
    { status: 'Completed', count: 850 },
    { status: 'Cancelled', count: 120 },
    { status: 'Ongoing', count: 45 },
    { status: 'Pending', count: 35 },
  ],
  ridesOverTime: [
    { date: '2023-05-25', count: 40 },
    { date: '2023-05-26', count: 45 },
    { date: '2023-05-27', count: 60 },
    { date: '2023-05-28', count: 55 },
    { date: '2023-05-29', count: 70 },
    { date: '2023-05-30', count: 65 },
    { date: '2023-05-31', count: 80 },
  ],
  userGrowth: [
    { date: '2023-01', count: 100 },
    { date: '2023-02', count: 250 },
    { date: '2023-03', count: 400 },
    { date: '2023-04', count: 600 },
    { date: '2023-05', count: 850 },
  ],
};

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'v1',
    driverId: '3',
    driverName: 'Mike Ross',
    submittedAt: '2023-05-10T14:30:00Z',
    status: 'pending',
    documents: [
      { type: 'ID Card', url: 'https://via.placeholder.com/400x300', status: 'pending' },
      { type: 'Driver License', url: 'https://via.placeholder.com/400x300', status: 'approved' },
      { type: 'Vehicle Insurance', url: 'https://via.placeholder.com/400x300', status: 'pending' },
    ],
  },
];
