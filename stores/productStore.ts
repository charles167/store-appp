import { create } from 'zustand';
import { apiClient } from '@/utils/api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
  rating?: number;
  reviews?: number;
  seller?: string;
  sellerId?: string;
}

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Fetch actions
  fetchProducts: (filters?: { category?: string; search?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Local state management
  setCurrentProduct: (product: Product | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async (filters?) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getProducts(filters);
      set({ products: data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching products:', error);
    }
  },

  fetchProduct: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getProduct(productId);
      set({ currentProduct: data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching product:', error);
    }
  },

  createProduct: async (productData: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.createProduct(productData);
      set((state) => ({ products: [data, ...state.products], loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      set({ error: errorMessage, loading: false });
      console.error('Error creating product:', error);
    }
  },

  updateProduct: async (productId: string, productData: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.updateProduct(productId, productData);
      set((state) => ({
        products: state.products.map((p) => (p.id === productId ? data : p)),
        currentProduct: state.currentProduct?.id === productId ? data : state.currentProduct,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      set({ error: errorMessage, loading: false });
      console.error('Error updating product:', error);
    }
  },

  deleteProduct: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.deleteProduct(productId);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
        currentProduct: state.currentProduct?.id === productId ? null : state.currentProduct,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting product:', error);
    }
  },

  setCurrentProduct: (product) => set({ currentProduct: product }),
  clearError: () => set({ error: null }),
}));
