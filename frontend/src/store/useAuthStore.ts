import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types'; // Import User từ types chung

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  // Hàm quan trọng còn thiếu
  updateUser: (updates: Partial<User>) => void;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Logic cập nhật user cục bộ (Merge thông tin mới vào thông tin cũ)
      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),

      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);