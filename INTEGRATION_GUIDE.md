# Frontend-Backend Integration Guide

This document explains how the frontend is integrated with the Express backend using Neon PostgreSQL.

## Architecture Overview

### Authentication Flow (Clerk)
1. User signs in/up with Clerk
2. Clerk provides JWT token to frontend
3. Frontend uses Clerk token to authenticate API requests
4. Backend verifies token and processes requests

### API Integration

#### Base Setup
- **API Client**: `utils/api.ts` - Centralized HTTP client with Clerk token handling
- **Stores**: Zustand stores for state management with backend integration
- **Environment**: `EXPO_PUBLIC_API_URL` in `.env`

## Stores Integration

### 1. Product Store (`stores/productStore.ts`)
Manages product catalog with backend sync.

```typescript
import { useProductStore } from '@/stores/productStore';

// In component:
const { products, fetchProducts, loading } = useProductStore();

useEffect(() => {
  fetchProducts({ category: 'Electronics', limit: 20 });
}, []);
```

**Available Methods:**
- `fetchProducts(filters?)` - Get all products with optional filters
- `fetchProduct(id)` - Get single product details
- `createProduct(data)` - Create new product (seller only)
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

### 2. Order Store (`stores/orderStore.ts`)
Manages orders and checkout flow.

```typescript
import { useOrderStore } from '@/stores/orderStore';

const { orders, createOrder } = useOrderStore();

// Create order from cart
await createOrder(cartItems, shippingAddress);
```

**Available Methods:**
- `fetchOrders()` - Get user's orders
- `fetchOrder(id)` - Get order details
- `createOrder(items, address)` - Create new order
- `updateOrderStatus(id, status)` - Update order status

### 3. Wallet Store (`stores/walletStore.ts`)
Manages wallet balance and transactions.

```typescript
import { useWalletStore } from '@/stores/walletStore';

const { wallet, addFunds, withdraw } = useWalletStore();

// Add funds
await addFunds(5000); // Add ₦5000

// Withdraw
await withdraw(2000); // Withdraw ₦2000
```

**Available Methods:**
- `fetchWallet(userId?)` - Get wallet balance
- `addFunds(amount)` - Add funds to wallet
- `withdraw(amount)` - Withdraw from wallet
- `addTransaction(transaction)` - Track transaction

### 4. User Profile Store (`stores/userProfileStore.ts`)
Manages user profile with Clerk integration.

```typescript
import { useUserProfileStore, useInitializeProfile } from '@/stores/userProfileStore';

// Auto-initialize profile on auth
useInitializeProfile();

// Manual fetch/update
const { profile, fetchProfile, updateProfile } = useUserProfileStore();

await updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+2348012345678',
});
```

## API Client Usage

The API client in `utils/api.ts` handles all HTTP requests with Clerk authentication.

### Direct API Client Usage

```typescript
import { apiClient } from '@/utils/api';

// Will automatically include Clerk token
const products = await apiClient.getProducts({ category: 'Electronics' });
const wallet = await apiClient.getWallet();
```

### Hook-Based Usage

```typescript
import { useApi } from '@/utils/api';

function MyComponent() {
  const api = useApi(); // Automatically sets up Clerk token
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getProducts();
    };
    fetchData();
  }, [api]);
}
```

## Environment Setup

### 1. Local Development

Create `.env` file:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Production

Update `.env.production`:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Key Features

### 1. Cart to Order Flow

```typescript
// 1. Add to cart (uses cartStore)
const { addItem } = useCartStore();
addItem(product);

// 2. Create order (uses orderStore + backend)
const { createOrder } = useOrderStore();
const items = cartStore.items.map(item => ({
  productId: item.id,
  quantity: item.quantity
}));
await createOrder(items, shippingAddress);

// 3. Wallet payment
const { withdraw } = useWalletStore();
await withdraw(totalAmount);
```

### 2. Seller Management

Sellers can:
- Create/update/delete products via `useProductStore`
- View their orders (seller-specific endpoint)
- Access analytics dashboard
- Manage withdrawals (uses `addWithdrawalRequest`)

### 3. Customer Features

Customers can:
- Browse products from `useProductStore`
- Create orders with `useOrderStore`
- Manage wallet with `useWalletStore`
- View order history

## Error Handling

All stores include error management:

```typescript
const { error, clearError } = useProductStore();

if (error) {
  console.error('Product error:', error);
  clearError();
}
```

## Loading States

All async operations set loading state:

```typescript
const { loading, products } = useProductStore();

if (loading) {
  return <LoadingSpinner />;
}
```

## Clerk Token Integration

The API client automatically handles Clerk tokens:

1. **In `useApi()` hook**: Fetches token on mount
2. **In standalone `apiClient`**: Call `setToken()` manually if needed

```typescript
import { apiClient } from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';

const { getToken } = useAuth();
const token = await getToken();
apiClient.setToken(token);
```

## Backend API Endpoints

All endpoints are in the Express backend (`onlinestore-backend`):

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/:id`

### Products
- `GET /api/products` (with filters)
- `GET /api/products/:id`
- `POST /api/products` (seller)
- `PUT /api/products/:id` (seller)
- `DELETE /api/products/:id` (seller)

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status`

### Wallet
- `GET /api/wallet`
- `POST /api/wallet/add-funds`
- `POST /api/wallet/withdraw`

### Sellers
- `GET /api/sellers/:id`
- `GET /api/sellers/analytics/orders`
- `GET /api/sellers/analytics/dashboard`

## Testing

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. DB Connection
```bash
curl http://localhost:3000/api/db-test
```

### 3. Test with Token
```bash
# Get Clerk token from your app
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:3000/api/users/me
```

## Troubleshooting

### CORS Issues
- Backend has CORS enabled for all origins by default
- In production, update backend CORS settings

### Authentication Errors
- Ensure Clerk is properly initialized in app
- Check `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Verify user is signed in before making API calls

### Backend Connection
- Ensure backend is running on port 3000
- Check `EXPO_PUBLIC_API_URL` in `.env`
- Test with `/health` endpoint

### Database Issues
- Verify Neon connection string in backend `.env`
- Run migrations: `npm run migrate`
- Check database is created in Neon dashboard

## Next Steps

1. **Implement UI Integration**: Update all screens to use stores instead of mock data
2. **Error Handling**: Add better error handling in components
3. **Offline Support**: Add offline-first sync with AsyncStorage
4. **Caching**: Implement query caching with TanStack Query
5. **Testing**: Add unit and integration tests
