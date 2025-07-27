// src/lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token');
    console.log('API: Request to', config.url, 'with token:', token ? 'present' : 'missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API: Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API: Response from', response.config.url, 'status:', response.status);
    return response;
  },
  (error) => {
    console.error('API: Response error from', error.config?.url, 'status:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      Cookies.remove('user');
      window.location.href = '/auth/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default api;