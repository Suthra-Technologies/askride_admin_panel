import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_admin_token');
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
  getVerifications: () => api.get('/admin/verifications'),
  getAnalytics: () => api.get('/admin/analytics'),
  blockUser: (id: string, isBlocked: boolean) => api.patch(`/admin/users/${id}/block`, { isBlocked }),
  verifyIdProof: (id: string, approved: boolean) => api.patch(`/admin/verifications/${id}/id-proof`, { approved }),
  verifyLicense: (id: string, approved: boolean) => api.patch(`/admin/verifications/${id}/license`, { approved }),
  verifyVehicle: (id: string, approved: boolean) => api.patch(`/admin/vehicles/${id}/verify`, { approved }),
};

export default api;
