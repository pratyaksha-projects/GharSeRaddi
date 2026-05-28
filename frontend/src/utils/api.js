import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const getMe    = ()     => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Prices
export const getPrices  = ()     => api.get('/prices');
export const seedPrices = ()     => api.post('/prices/seed');

// Pickups
export const bookPickup   = (data) => api.post('/pickups', data);
export const getMyPickups = ()     => api.get('/pickups/my');
export const getPickup    = (id)   => api.get(`/pickups/${id}`);
export const cancelPickup = (id)   => api.put(`/pickups/${id}/cancel`);

// Admin
export const getAdminStats   = ()       => api.get('/admin/stats');
export const getAllPickups    = (params) => api.get('/admin/pickups', { params });
export const updatePickup    = (id, d)  => api.put(`/admin/pickups/${id}`, d);
export const getAllUsers      = ()       => api.get('/admin/users');
export const updatePrice     = (id, d)  => api.put(`/prices/${id}`, d);

export default api;
