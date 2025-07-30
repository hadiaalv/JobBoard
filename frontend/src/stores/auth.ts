import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, AuthResponse, LoginData, RegisterData } from '@/types';
import api from '@/lib/api';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>, avatar?: File, resume?: File) => Promise<void>;
  deleteUser: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      editing: false,
      setEditing: (value: boolean) => set({ editing: value }),

      login: async (data: LoginData) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', data);
          const { user, token, access_token } = response.data;
          const authToken = token || access_token;
          Cookies.set('auth-token', authToken, { expires: 7, path: '/' });
          console.log('Token after login:', Cookies.get('auth-token'));
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/register', data);
          const { user, token, access_token } = response.data;
          const authToken = token || access_token;
          Cookies.set('auth-token', authToken, { expires: 7, path: '/' });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove('auth-token');
        set({ user: null, isAuthenticated: false });
      },

      updateUser: async (data: Partial<User>, avatar?: File, resume?: File) => {
        try {
          const formData = new FormData();
          
          Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
              if (key === 'skills' && Array.isArray(data[key])) {
                const skillsString = data[key].join(',');
                formData.append(key, skillsString);
              } else {
                formData.append(key, data[key]);
              }
            }
          });
          
          if (avatar) {
            formData.append('avatar', avatar);
          }
          
          if (resume) {
            formData.append('resume', resume);
          }
          
          const response = await api.patch<User>('/users/me', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to update user:', error);
          throw error;
        }
      },

      deleteUser: async () => {
        try {
          await api.delete('/users/me');
          Cookies.remove('auth-token');
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Failed to delete user:', error);
          throw error;
        }
      },

      initializeAuth: () => {
        const token = Cookies.get('auth-token');
        if (token) {
          api.get<User>('/users/me')
            .then(response => {
              set({ user: response.data, isAuthenticated: true });
            })
            .catch(() => {
              Cookies.remove('auth-token');
              set({ user: null, isAuthenticated: false });
            });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);