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
        console.log('Auth store: updateUser called with', data, 'avatar:', avatar?.name, 'resume:', resume?.name);
        try {
          const formData = new FormData();
          
          Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
              // Handle skills specifically - convert array to comma-separated string
              if (key === 'skills' && Array.isArray(data[key])) {
                const skillsString = data[key].join(',');
                console.log(`Auth store: Adding skills as string:`, skillsString);
                formData.append(key, skillsString);
              } else {
                console.log(`Auth store: Adding field ${key}:`, data[key]);
                formData.append(key, data[key]);
              }
            }
          });
          
          if (avatar) {
            console.log('Auth store: Adding avatar file:', avatar.name);
            formData.append('avatar', avatar);
          }
          
          if (resume) {
            console.log('Auth store: Adding resume file:', resume.name);
            formData.append('resume', resume);
          }
          
          // Log all FormData entries
          console.log('Auth store: FormData entries:');
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }
          
          const response = await api.patch<User>('/users/me', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Auth store: API response', response.data);
          const updatedUser = response.data;
          set({ user: updatedUser });
          console.log('Auth store: User state updated', updatedUser);
          return updatedUser;
        } catch (error) {
          console.error('Auth store: Update user error:', error);
          console.error('Auth store: Error response:', error.response?.data);
          console.error('Auth store: Error status:', error.response?.status);
          throw error;
        }
      },

      initializeAuth: () => {
        const token = Cookies.get('auth-token');
        console.log('Initializing auth, token:', token);
        if (token) {
          api.get<User>('/users/me')
            .then(response => {
              set({ user: response.data, isAuthenticated: true });
            })
            .catch(() => {
              Cookies.remove('auth-token');
              set({ user: null, isAuthenticated: false });
            });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        editing: state.editing
      }),
    }
  )
);