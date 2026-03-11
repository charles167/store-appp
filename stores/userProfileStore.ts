import React from 'react';
import { create } from 'zustand';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { apiClient } from '@/utils/api';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  userType: 'customer' | 'seller' | 'admin';
  createdAt?: string;
}

interface UserProfileStore {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Fetch and update
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => void;

  // Utilities
  clearError: () => void;
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getUserProfile();
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        userType: data.user_type || 'customer',
        createdAt: data.created_at,
      };
      set({ profile, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching profile:', error);
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.updateUserProfile(
        data.firstName || '',
        data.lastName || '',
        data.phone,
        data.avatarUrl
      );

      const profile: UserProfile = {
        id: response.id,
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
        phone: response.phone,
        avatarUrl: response.avatar_url,
        userType: response.user_type || 'customer',
      };
      set({ profile, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: errorMessage, loading: false });
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  setProfile: (profile) => set({ profile }),
  clearError: () => set({ error: null }),
}));

// Hook to initialize profile on auth
export function useInitializeProfile() {
  const { isSignedIn } = useAuth();
  const { fetchProfile } = useUserProfileStore();

  React.useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
    }
  }, [isSignedIn, fetchProfile]);
}
