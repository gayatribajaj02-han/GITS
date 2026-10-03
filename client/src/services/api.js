import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors & format user-friendly messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = error.response?.data?.message;

    // Check express-validator errors array
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      message = error.response.data.errors.map((e) => e.message || e.msg).join('. ');
    }

    if (!message) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        message = 'Cannot connect to server. Please make sure backend is running on port 5000 and MongoDB is connected.';
      } else {
        message = error.message || 'An unexpected error occurred. Please try again.';
      }
    }

    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=true';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
