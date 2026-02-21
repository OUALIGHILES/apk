import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      loading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      setLoading: (loading) => set({ loading }),
      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        set({ user: null, isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
