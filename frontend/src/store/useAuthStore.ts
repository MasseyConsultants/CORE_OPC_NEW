/**
 * Authentication store using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest } from '../types';
import apiService from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        try {
          await apiService.login(credentials);
          const user = await apiService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: true, 
            loading: false, 
            error: null 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Login failed', 
            loading: false 
          });
          throw error;
        }
      },

      logout: () => {
        apiService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      getCurrentUser: async () => {
        if (!apiService.isAuthenticated()) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ loading: true });
        try {
          const user = await apiService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: true, 
            loading: false, 
            error: null 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Failed to get user', 
            loading: false,
            isAuthenticated: false,
            user: null
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
