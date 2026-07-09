import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.covoitgo.com/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('covoitgo_jwt');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (like 401, 403, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Handle token expiration / unauthorized
        localStorage.removeItem('covoitgo_jwt');
        localStorage.removeItem('covoitgo_user');
        window.location.href = '/login';
      }
      if (status === 403) {
        // Forbidden
        window.location.href = '/403';
      }
      if (status === 500) {
        // Internal server error
        window.location.href = '/500';
      }
    }
    return Promise.reject(error);
  }
);

// Toggle to easily switch between Mock API and real API
export const IS_MOCK_MODE = true;

// Helper to simulate network latency for TanStack Query loading states
export const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));
