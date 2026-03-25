import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Global app state interface
interface AppState {
  // UI State
  isLoading: boolean;
  globalError: string | null;
  successMessage: string | null;
  
  // Auth State
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
  clearMessages: () => void;
}

// Create the Zustand store
export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      globalError: null,
      successMessage: null,
      user: null,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),

      // UI Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setGlobalError: (error: string | null) => {
        set({ globalError: error });
        // Auto-clear error after 5 seconds
        if (error) {
          setTimeout(() => {
            if (get().globalError === error) {
              set({ globalError: null });
            }
          }, 5000);
        }
      },
      
      setSuccessMessage: (message: string | null) => {
        set({ successMessage: message });
        // Auto-clear success after 3 seconds
        if (message) {
          setTimeout(() => {
            if (get().successMessage === message) {
              set({ successMessage: null });
            }
          }, 3000);
        }
      },

      // Auth Actions
      setAuth: (user: any, token: string) => {
        localStorage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('admin');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      clearMessages: () => set({ 
        globalError: null, 
        successMessage: null 
      }),
    }),
    {
      name: 'app-store',
    }
  )
);

// Export types for use in components
export type { AppState };

