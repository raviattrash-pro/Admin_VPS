import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.toString().startsWith('http')) return path;
  // If API_BASE is a relative path like '/api', use window.location.origin
  const base = API_BASE.startsWith('http') ? API_BASE : window.location.origin + API_BASE;
  return `${base}/uploads/${path}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/auth/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const resetPassword = (userId) => api.put(`/admin/reset-password/${userId}`);

// Students (Admin)
export const createStudent = (formData) =>
  api.post('/admin/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getStudents = () => api.get('/admin/students');
export const getStudentById = (id) => api.get(`/admin/students/${id}`);
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);
export const getMyProfile = () => api.get('/students/me');

// Fees
export const submitPayment = (formData) =>
  api.post('/fees/pay', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyFees = () => api.get('/fees/my');
export const recordOfflinePayment = (data) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => { if (v != null) params.append(k, v); });
  return api.post('/admin/fees/offline', null, { params });
};
export const verifyPayment = (id, approved) =>
  api.put(`/admin/fees/${id}/verify`, null, { params: { approved } });
export const getPendingPayments = () => api.get('/admin/fees/pending');
export const getAllFees = () => api.get('/admin/fees');
export const getStudentFeesForAdmin = (studentId) => api.get(`/admin/fees/student/${studentId}`);
export const downloadReceipt = (id) =>
  api.get(`/fees/${id}/receipt`, { responseType: 'blob' });

// Payment Config
export const getPaymentConfig = () => api.get('/payment-config');
export const updatePaymentConfig = (formData) =>
  api.put('/admin/payment-config', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Stock
export const getStockItems = (category) =>
  api.get('/admin/stock', { params: category ? { category } : {} });
export const createStockItem = (data) => api.post('/admin/stock', data);
export const updateStockItem = (id, data) => api.put(`/admin/stock/${id}`, data);
export const deleteStockItem = (id) => api.delete(`/admin/stock/${id}`);
export const issueStockItem = (id, data) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => { if (v != null) params.append(k, v); });
  return api.post(`/admin/stock/${id}/issue`, null, { params });
};
export const getStockHistory = () => api.get('/admin/stock/history');
export const getItemHistory = (id) => api.get(`/admin/stock/${id}/history`);

// Expenses
export const createExpense = (data) => api.post('/admin/expenses', data);
export const getExpenses = () => api.get('/admin/expenses');
export const updateExpense = (id, data) => api.put(`/admin/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/admin/expenses/${id}`);
export const getProfitLossSummary = () => api.get('/admin/expenses/summary');

// Notices
export const getActiveNotices = () => api.get('/notices');
export const getAllNotices = () => api.get('/admin/notices');
export const createNotice = (data) => api.post('/admin/notices', data);
export const updateNotice = (id, data) => api.put(`/admin/notices/${id}`, data);
export const deleteNotice = (id) => api.delete(`/admin/notices/${id}`);

// User Management (Admin & System Admin)
export const getUsers = (role) => api.get('/admin/users', { params: { role } });
export const createUser = (data) => api.post('/admin/users', data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const resetUserPassword = (id) => api.put(`/admin/users/${id}/reset-password`);

// System
export const getSystemHealth = () => api.get('/system/health');
export const getSystemDiagnosis = () => api.get('/system/environment');

export default api;
