import React from 'react';
import { useAuth } from '@clerk/clerk-expo';

// Configure your backend URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email: string, password: string, firstName: string, lastName: string, userType: string = 'customer') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, userType }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/me', { method: 'GET' });
  }

  async updateUserProfile(firstName: string, lastName: string, phone?: string, avatarUrl?: string) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, phone, avatarUrl }),
    });
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`, { method: 'GET' });
  }

  // Product endpoints
  async getProducts(filters?: { category?: string; search?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/products${query}`, { method: 'GET' });
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`, { method: 'GET' });
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, { method: 'DELETE' });
  }

  // Order endpoints
  async createOrder(items: any[], shippingAddress: string) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress }),
    });
  }

  async getOrders() {
    return this.request('/orders', { method: 'GET' });
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}`, { method: 'GET' });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Wallet endpoints
  async getWallet() {
    return this.request('/wallet', { method: 'GET' });
  }

  async addFunds(amount: number) {
    return this.request('/wallet/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async withdrawFunds(amount: number) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Seller endpoints
  async getSellerProfile(sellerId: string) {
    return this.request(`/sellers/${sellerId}`, { method: 'GET' });
  }

  async getSellerOrders() {
    return this.request('/sellers/analytics/orders', { method: 'GET' });
  }

  async getSellerAnalytics() {
    return this.request('/sellers/analytics/dashboard', { method: 'GET' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Hook to use API with Clerk auth token
export function useApi() {
  const { getToken } = useAuth();

  React.useEffect(() => {
    const setupToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          apiClient.setToken(token);
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
      }
    };

    setupToken();
  }, [getToken]);

  return apiClient;
}
