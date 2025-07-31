import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      Cookies.remove('user');
      window.location.href = '/auth/login';
    }
    
    if (error.response) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.warn('Network error detected. Please check your connection and ensure the backend server is running.');
    }
    
    return Promise.reject(error);
  }
);

export default api;