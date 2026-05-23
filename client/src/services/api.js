import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
});

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/auth/register', userData);

export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const getCurrentUser = () => api.get('/auth/me');

export const getActiveParcelHelpers = () => api.get('/parcels/helpers');

export const createParcelHelperActivity = (activityData) => (
  api.post('/parcels/helpers', activityData)
);

export const searchUsers = (query) => api.get('/friends/search', {
  params: { q: query }
});

export const getFriendRequests = () => api.get('/friends/requests');

export const getFriends = () => api.get('/friends');

export const sendFriendRequest = (recipientId) => (
  api.post('/friends/requests', { recipientId })
);

export const respondToFriendRequest = (requestId, action) => (
  api.patch(`/friends/requests/${requestId}`, { action })
);

export default api;
