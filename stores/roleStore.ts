import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type UserRole = 'customer' | 'vendor' | 'admin';

interface RoleStore {
  role: UserRole | null;
  isLoading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  getRole: () => Promise<UserRole | null>;
  clearRole: () => Promise<void>;
}

// Helper functions for cross-platform storage
const setItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useRoleStore = create<RoleStore>((set, get) => ({
  role: null,
  isLoading: true,

  setRole: async (role: UserRole) => {
    try {
      await setItem('user_role', role);
      set({ role });
    } catch (error) {
      console.error('Error setting role:', error);
      throw error;
    }
  },

  getRole: async () => {
    try {
      const storedRole = await getItem('user_role');
      if (storedRole) {
        set({ role: storedRole as UserRole });
        return storedRole as UserRole;
      }
      return null;
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  },

  clearRole: async () => {
    try {
      await deleteItem('user_role');
      set({ role: null });
    } catch (error) {
      console.error('Error clearing role:', error);
      throw error;
    }
  },
}));
