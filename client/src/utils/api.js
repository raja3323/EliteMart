// client/src/utils/api.js
// Central axios instance — attaches token automatically to every request

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // proxied to http://localhost:5000 via package.json "proxy"
  headers: { 'Content-Type': 'application/json' },
});

// Before every request, attach the JWT token from localStorage (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If server returns 401 (expired/invalid token), log user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
