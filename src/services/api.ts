import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('askride_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  adminLogin: (data: { email: string; password: any }) => api.post('/auth/admin/login', data),
  verifyAdminOtp: (data: { email: string; otp: string }) => api.post('/auth/admin/verify-otp', data),
};

export const adminApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getRides: (params?: any) => api.get('/admin/rides', { params }),
  getVerifications: (params?: any) => api.get('/admin/verifications', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  blockUser: (id: string, isBlocked: boolean) => api.patch(`/admin/users/${id}/block`, { isBlocked }),
  verifyIdProof: (id: string, approved: boolean) => api.patch(`/admin/verifications/${id}/id-proof`, { approved }),
  verifyLicense: (id: string, approved: boolean) => api.patch(`/admin/verifications/${id}/license`, { approved }),
  verifyVehicle: (id: string, approved: boolean) => api.patch(`/admin/vehicles/${id}/verify`, { approved }),
  getNotifications: (params?: any) => api.get('/admin/notifications', { params }),
  getUnreadNotificationCount: () => api.get('/admin/notifications/unread-count'),
  markNotificationRead: (id: string) => api.patch(`/admin/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/admin/notifications/read-all'),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string; phone?: string }) =>
    api.patch('/admin/profile', data),
  getTeam: () => api.get('/admin/team'),
  promoteToAdmin: (userId: string) => api.post('/admin/team/promote', { userId }),
  demoteAdmin: (id: string) => api.patch(`/admin/team/${id}/demote`),
  getPlatformStatus: () => api.get('/admin/platform-status'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: Record<string, boolean>) => api.patch('/admin/settings', data),
  getAudienceCounts: () => api.get('/admin/broadcasts/audience-counts'),
  getBroadcasts: (params?: any) => api.get('/admin/broadcasts', { params }),
  sendBroadcast: (data: { audience: string; userId?: string; title: string; message: string }) =>
    api.post('/admin/broadcasts', data),
};

export default api;
