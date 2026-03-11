import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/utils/api';

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WithdrawalRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  resolvedDate?: string;
  rejectionReason?: string;
  bankName?: string;
  accountNumber?: string;
}

interface WalletStore {
  // Wallet state
  wallet: Wallet | null;
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];

  // Wallet actions
  setWallet: (wallet: Wallet) => void;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  addFunds: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;

  // Withdrawal actions
  addWithdrawalRequest: (request: WithdrawalRequest) => void;
  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => void;
  getWithdrawalRequests: (vendorId?: string) => WithdrawalRequest[];

  // Fetch actions
  fetchWallet: (userId?: string) => Promise<void>;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  transactions: [],
  withdrawalRequests: [],

  setWallet: (wallet) => {
    set({ wallet });
    get().saveToStorage();
  },

  updateBalance: (amount) => {
    set((state) => {
      if (!state.wallet) return state;
      return {
        wallet: {
          ...state.wallet,
          balance: state.wallet.balance + amount,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
    get().saveToStorage();
  },

  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
    get().saveToStorage();
  },

  addFunds: async (amount: number) => {
    try {
      const data = await apiClient.addFunds(amount);
      set({
        wallet: {
          userId: data.user_id || '',
          balance: data.balance || 0,
          currency: data.currency || '₦',
          lastUpdated: data.last_updated || new Date().toISOString(),
        },
      });
      get().addTransaction({
        id: `txn-${Date.now()}`,
        type: 'credit',
        amount,
        description: 'Top-up via card',
        timestamp: new Date().toISOString(),
        status: 'completed',
      });
      await get().saveToStorage();
    } catch (error) {
      console.error('Failed to add funds:', error);
      throw error;
    }
  },

  withdraw: async (amount: number) => {
    try {
      const data = await apiClient.withdrawFunds(amount);
      set({
        wallet: {
          userId: data.user_id || '',
          balance: data.balance || 0,
          currency: data.currency || '₦',
          lastUpdated: data.last_updated || new Date().toISOString(),
        },
      });
      get().addTransaction({
        id: `txn-${Date.now()}`,
        type: 'debit',
        amount,
        description: 'Withdrawal',
        timestamp: new Date().toISOString(),
        status: 'completed',
      });
      await get().saveToStorage();
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
      throw error;
    }
  },

  addWithdrawalRequest: (request) => {
    set((state) => ({
      withdrawalRequests: [request, ...state.withdrawalRequests],
    }));
    // Update wallet balance immediately (deduct from available)
    get().updateBalance(-request.amount);
    get().saveToStorage();
  },

  updateWithdrawalStatus: (id, status, rejectionReason) => {
    set((state) => ({
      withdrawalRequests: state.withdrawalRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              rejectionReason: status === 'rejected' ? rejectionReason : undefined,
              resolvedDate: new Date().toISOString(),
            }
          : req
      ),
    }));

    // If rejected, refund the amount back to wallet
    if (status === 'rejected') {
      const request = get().withdrawalRequests.find((r) => r.id === id);
      if (request) {
        get().updateBalance(request.amount);
      }
    }

    get().saveToStorage();
  },

  getWithdrawalRequests: (vendorId?: string) => {
    const requests = get().withdrawalRequests;
    if (vendorId) {
      return requests.filter((r) => r.vendorId === vendorId);
    }
    return requests;
  },

  fetchWallet: async (userId?: string) => {
    try {
      const data = await apiClient.getWallet();
      set({
        wallet: {
          userId: userId || '',
          balance: data.balance || 0,
          currency: data.currency || '₦',
          lastUpdated: data.last_updated || new Date().toISOString(),
        },
      });
      await get().saveToStorage();
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      // Fallback to empty wallet on error
      set({
        wallet: {
          userId: userId || '',
          balance: 0,
          currency: '₦',
          lastUpdated: new Date().toISOString(),
        },
      });
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('walletStore');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          wallet: parsed.wallet,
          transactions: parsed.transactions || [],
          withdrawalRequests: parsed.withdrawalRequests || [],
        });
      }
    } catch (error) {
      console.error('Failed to load wallet from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        'walletStore',
        JSON.stringify({
          wallet: state.wallet,
          transactions: state.transactions,
          withdrawalRequests: state.withdrawalRequests,
        })
      );
    } catch (error) {
      console.error('Failed to save wallet to storage:', error);
    }
  },
}));
