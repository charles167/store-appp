import { create } from 'zustand';

interface UserRole {
  type: 'customer' | 'seller' | 'admin';
  isVerified?: boolean;
}

interface UserStore {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isCustomer: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  role: null,
  
  setRole: (role) => set({ role }),
  
  clearRole: () => set({ role: null }),
  
  isAdmin: () => {
    const state = get();
    return state.role?.type === 'admin';
  },
  
  isSeller: () => {
    const state = get();
    return state.role?.type === 'seller';
  },
  
  isCustomer: () => {
    const state = get();
    return state.role?.type === 'customer';
  },
}));
