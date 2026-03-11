# 🔌 Backend Integration Guide

## Overview
This guide helps you connect the React Native frontend to a Node.js backend with PostgreSQL.

## Architecture

```
Mobile App (React Native)
    ↓ (HTTP/HTTPS)
Backend API (Node.js + Express/NestJS)
    ↓
PostgreSQL Database (Neon)
```

## Step 1: Set Up Backend API

### Recommended Stack
- **Node.js** 18+
- **Express** or **NestJS**
- **Prisma** ORM
- **PostgreSQL** (Neon)
- **Zod** for validation
- **JWT** for auth

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(uuid())
  clerkId       String    @unique
  email         String    @unique
  firstName     String?
  lastName      String?
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  sellerProfile Seller?
  
  @@map("users")
}

enum Role {
  CUSTOMER
  SELLER
  ADMIN
}

model Seller {
  id          String    @id @default(uuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id])
  storeName   String
  status      SellerStatus @default(PENDING)
  rating      Float     @default(0)
  createdAt   DateTime  @default(now())
  
  products    Product[]
  
  @@map("sellers")
}

enum SellerStatus {
  PENDING
  ACTIVE
  SUSPENDED
}

model Product {
  id          String    @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int
  imageUrl    String
  sellerId    String
  seller      Seller    @relation(fields: [sellerId], references: [id])
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  orderItems  OrderItem[]
  
  @@map("products")
}

model Category {
  id       String    @id @default(uuid())
  name     String
  icon     String
  products Product[]
  
  @@map("categories")
}

model Order {
  id          String      @id @default(uuid())
  orderNumber String      @unique
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Float
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  items       OrderItem[]
  payment     Payment?
  
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  
  @@map("order_items")
}

model Payment {
  id        String   @id @default(uuid())
  orderId   String   @unique
  order     Order    @relation(fields: [orderId], references: [id])
  amount    Float
  status    String
  createdAt DateTime @default(now())
  
  @@map("payments")
}
```

## Step 2: API Endpoints

### Authentication
```typescript
// Sync with Clerk
POST   /api/auth/sync-user
POST   /api/auth/update-role
```

### Products
```typescript
GET    /api/products              // List all products
GET    /api/products/:id          // Get single product
POST   /api/products              // Create product (Seller)
PUT    /api/products/:id          // Update product (Seller)
DELETE /api/products/:id          // Delete product (Seller)
GET    /api/products/search       // Search products
```

### Orders
```typescript
GET    /api/orders                // User's orders
GET    /api/orders/:id            // Single order
POST   /api/orders                // Create order
PUT    /api/orders/:id/status     // Update order status (Seller)
```

### Cart (optional - can be local)
```typescript
POST   /api/cart/sync             // Sync cart to server
GET    /api/cart                  // Get saved cart
```

### Sellers
```typescript
GET    /api/sellers               // List sellers (Admin)
POST   /api/sellers/register      // Register as seller
PUT    /api/sellers/:id/approve   // Approve seller (Admin)
PUT    /api/sellers/:id/suspend   // Suspend seller (Admin)
```

### Admin
```typescript
GET    /api/admin/stats           // Platform statistics
GET    /api/admin/users           // List all users
PUT    /api/admin/users/:id       // Update user role
```

## Step 3: Frontend Integration

### 1. Create API Client

```typescript
// utils/api.ts
import { useAuth } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}
```

### 2. Create React Query Hooks

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from '@/utils/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchAPI('/api/products'),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchAPI(`/api/products/${id}`),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => fetchAPI('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}
```

### 3. Update Components

```typescript
// app/(customer)/home.tsx
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) {
    return <ProductCardSkeleton />;
  }
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

## Step 4: Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Step 5: Error Handling

```typescript
// utils/errorHandler.ts
export function handleAPIError(error: any) {
  if (error.response?.status === 401) {
    // Redirect to login
    return 'Authentication failed';
  }
  
  if (error.response?.status === 403) {
    return 'Permission denied';
  }
  
  if (error.response?.status === 404) {
    return 'Resource not found';
  }
  
  return error.message || 'Something went wrong';
}
```

## Step 6: Offline Support (Optional)

```typescript
// Use MMKV for offline storage
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Cache products locally
export function cacheProducts(products: Product[]) {
  storage.set('products', JSON.stringify(products));
}

export function getCachedProducts() {
  const cached = storage.getString('products');
  return cached ? JSON.parse(cached) : [];
}
```

## Step 7: Image Upload

```typescript
// utils/uploadImage.ts
export async function uploadImage(uri: string) {
  const formData = new FormData();
  formData.append('image', {
    uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  
  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  const data = await response.json();
  return data.url;
}
```

## Testing

### 1. Use Mock Service Worker (MSW)
```bash
npm install msw --save-dev
```

### 2. Create Mock Handlers
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', name: 'Product 1', price: 99.99 },
    ]));
  }),
];
```

## Deployment

### Backend
- **Render.com** - Easy deployment
- **Railway.app** - PostgreSQL included
- **Vercel** - For API routes
- **AWS/GCP** - Production scale

### Database
- **Neon** - Serverless PostgreSQL
- **Supabase** - PostgreSQL + Auth
- **PlanetScale** - MySQL alternative

## Security Checklist

- ✅ Use HTTPS for all requests
- ✅ Validate JWT tokens on backend
- ✅ Implement rate limiting
- ✅ Sanitize user inputs
- ✅ Use environment variables
- ✅ Implement CORS properly
- ✅ Add request/response logging
- ✅ Set up error monitoring (Sentry)

## Next Steps

1. Set up your backend API
2. Deploy to Render/Railway
3. Update `.env` with API URL
4. Replace mock data with real API calls
5. Test all user flows
6. Add error boundaries
7. Implement analytics
8. Set up crash reporting

---

**Need Help?**
- Prisma Docs: https://www.prisma.io/docs
- React Query: https://tanstack.com/query
- Clerk Backend: https://clerk.com/docs/backend-requests
