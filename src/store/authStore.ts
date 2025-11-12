import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/app';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const storage =
  Platform.OS === 'web'
    ? {
        getItem: (name: string) => {
          const item = localStorage.getItem(name);
          return Promise.resolve(item ? JSON.parse(item) : null);
        },
        setItem: (name: string, value: any) => {
          localStorage.setItem(name, JSON.stringify(value));
          return Promise.resolve();
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
          return Promise.resolve();
        },
      }
    : {
        getItem: async (name: string) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      };


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isAuthenticated: false,

      setLoading: (val) => set({ loading: val }),

      login: async (userData: User) => {
        set({ user: userData, isAuthenticated: true });
      },

      logout: async () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'framez_user',
      storage: storage,
      onRehydrateStorage: () => (state) => {
        // when rehydrated
        if (!state) return;

        if (state?.user) {
          state.isAuthenticated = true;
          state.loading = false;
        } else {
          state.loading = false;
        }
      },
    }
  )
);
