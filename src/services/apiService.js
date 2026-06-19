import axios from 'axios';

const API_BASE_URL = 'http://13.60.202.87:4000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('ownerToken');

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  registerLogin: (ownerNumber) =>
    apiClient.post('/auth/register-login', { ownerNumber }),
};

// Hostel APIs
export const hostelAPI = {
  createHostel: (data) => apiClient.post('/hostel/create', data),
  listHostels: () => apiClient.get('/hostel/list'),
  getHostelAnalytics: () => apiClient.get('/hostel/analytics'),
  getHostelById: (hostelId) => apiClient.get(`/hostel/${hostelId}`),
  updateHostel: (hostelId, data) => apiClient.put(`/hostel/${hostelId}`, data),
  deleteHostel: (hostelId) => apiClient.delete(`/hostel/${hostelId}`),
};

// Floor APIs
export const floorAPI = {
  createFloor: (data) => apiClient.post('/floor/create', data),
  getFloorsByHostel: (hostelId) => apiClient.get(`/floor/${hostelId}`),
  getFloorById: (floorId) => apiClient.get(`/floor/single/${floorId}`),
  getFloorDetails: (hostelId, floorNumber) =>
    apiClient.get(`/floor/${hostelId}/details/${floorNumber}`),
  updateFloor: (floorId, data) => apiClient.put(`/floor/${floorId}`, data),
  deleteFloor: (floorId) => apiClient.delete(`/floor/${floorId}`),
};

// Room APIs
export const roomAPI = {
  createRoom: (data) => apiClient.post('/room/create', data),
  getRoomsByHostel: (hostelId) => apiClient.get(`/room/${hostelId}`),
  getRoomsByFloor: (floorId) => apiClient.get(`/room/floor/${floorId}`),
  getRoomById: (roomId) => apiClient.get(`/room/single/${roomId}`),
  updateRoom: (roomId, data) => apiClient.put(`/room/${roomId}`, data),
  deleteRoom: (roomId) => apiClient.delete(`/room/${roomId}`),
};

// Tenant APIs
export const tenantAPI = {
  createTenant: (data) => apiClient.post('/tenant/create', data),
  getTenantsByHostel: (hostelId) => apiClient.get(`/tenant/${hostelId}`),
  getTenantById: (tenantId) => apiClient.get(`/tenant/single/${tenantId}`),
  updateTenant: (tenantId, data) => apiClient.put(`/tenant/${tenantId}`, data),
  deleteTenant: (tenantId) => apiClient.delete(`/tenant/${tenantId}`),
};

// Expense APIs
export const expenseAPI = {
  createExpense: (data) => apiClient.post('/expense/create', data),
  getExpensesByHostel: (hostelId, params) =>
    apiClient.get(`/expense/${hostelId}`, { params }),
  updateExpense: (expenseId, data) => apiClient.put(`/expense/${expenseId}`, data),
  deleteExpense: (expenseId) => apiClient.delete(`/expense/${expenseId}`),
};

// Payment APIs
export const paymentAPI = {
  getPaymentsByTenant: (tenantId) => apiClient.get(`/payment/${tenantId}`),
  getPaymentsByHostel: (hostelId) => apiClient.get(`/payment/hostel/${hostelId}`),
  updatePayment: (paymentId, data) => apiClient.put(`/payment/${paymentId}`, data),
};

// Temporary Tenant APIs
export const tempTenantAPI = {
  generateToken: (hostelId) =>
    apiClient.post('/temporary-tenant/generate-token', { hostelId }),
  getByHostel: (hostelId) => apiClient.get(`/temporary-tenant/hostel/${hostelId}`),
  approve: (tempTenantId) =>
    apiClient.post(`/temporary-tenant/approve/${tempTenantId}`),
  delete: (tempTenantId) => apiClient.delete(`/temporary-tenant/${tempTenantId}`),
};

// Ticket APIs
export const ticketAPI = {
  getByHostel: (hostelId) => apiClient.get(`/tickets/hostel/${hostelId}`),
  getByTenant: (tenantId) => apiClient.get(`/tickets/tenant/${tenantId}`),
  updateStatus: (ticketId, status) =>
    apiClient.put(`/tickets/${ticketId}/status`, { status }),
};

export default apiClient;
