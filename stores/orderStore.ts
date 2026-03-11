import { create } from 'zustand';
import { apiClient } from '@/utils/api';

export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
  name?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  // Fetch actions
  fetchOrders: () => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  createOrder: (items: OrderItem[], shippingAddress: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Local state management
  setCurrentOrder: (order: Order | null) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getOrders();
      set({ orders: data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching orders:', error);
    }
  },

  fetchOrder: async (orderId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getOrder(orderId);
      set({ currentOrder: data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching order:', error);
    }
  },

  createOrder: async (items: OrderItem[], shippingAddress: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.createOrder(items, shippingAddress);
      set((state) => ({ orders: [data, ...state.orders], loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      set({ error: errorMessage, loading: false });
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.updateOrderStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? data : o)),
        currentOrder: state.currentOrder?.id === orderId ? data : state.currentOrder,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
      set({ error: errorMessage, loading: false });
      console.error('Error updating order:', error);
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),
  clearError: () => set({ error: null }),
}));
