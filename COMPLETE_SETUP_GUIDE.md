# Complete Backend Integration - Setup & Implementation Guide

## 🎯 Project Status

### ✅ Completed
- [x] Backend Express server created (`c:\onlinestore-backend`)
- [x] PostgreSQL schema with Neon integration
- [x] Authentication routes (register, login)
- [x] Product CRUD routes
- [x] Order management routes
- [x] Wallet management routes
- [x] Seller analytics routes
- [x] API Client with Clerk JWT integration (`utils/api.ts`)
- [x] Product Store with backend sync (`stores/productStore.ts`)
- [x] Order Store with backend sync (`stores/orderStore.ts`)
- [x] Wallet Store updated with backend calls
- [x] User Profile Store with Clerk integration
- [x] Environment configuration (`.env`)

### 🚀 Ready to Implement
- [ ] Update UI screens to use stores (See SCREEN_UPDATE_CHECKLIST.md)
- [ ] Test all API endpoints
- [ ] Deploy backend to production

## 📁 Project Structure

```
c:\onlinestore (Frontend - React Native with Expo)
├── app/
│   ├── (auth)/          ← Sign in/up
│   ├── (customer)/      ← Home, Search, Cart, Orders, Wallet
│   ├── (seller)/        ← Products, Orders, Analytics, Withdrawal
│   ├── (admin)/         ← Users, Analytics, Dashboard
│   └── product/         ← Product details
├── components/          ← Reusable UI components
├── stores/
│   ├── cartStore.ts     ← Shopping cart (local)
│   ├── productStore.ts  ← Products (backend synced)
│   ├── orderStore.ts    ← Orders (backend synced)
│   ├── walletStore.ts   ← Wallet (backend synced)
│   ├── userProfileStore.ts ← User profile (backend synced)
│   └── roleStore.ts     ← User role management
├── utils/
│   ├── api.ts           ← API client with Clerk integration
│   └── ...
├── .env                 ← API URL configuration
└── INTEGRATION_GUIDE.md  ← Detailed integration docs

c:\onlinestore-backend (Express Backend)
├── src/
│   ├── index.js         ← Main server file
│   ├── db/
│   │   ├── config.js    ← Database connection
│   │   └── schema.sql   ← Database schema
│   ├── middleware/
│   │   └── auth.js      ← JWT verification
│   └── routes/
│       ├── auth.js      ← Register & login
│       ├── users.js     ← User profile
│       ├── products.js  ← Product CRUD
│       ├── orders.js    ← Order management
│       ├── sellers.js   ← Seller analytics
│       └── wallet.js    ← Wallet operations
├── scripts/
│   └── migrate.js       ← Database migration
├── .env.example         ← Environment template
├── package.json         ← Dependencies
└── README.md            ← Backend setup guide
```

## 🚀 Quick Start

### Step 1: Start Backend

```bash
cd c:\onlinestore-backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Update .env with your Neon connection string:
# DATABASE_URL=postgresql://user:pass@ep-XXXXX.neon.tech/onlinestore?sslmode=require
# JWT_SECRET=your-secret-key-here

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Backend runs on: `http://localhost:3000`

### Step 2: Verify Backend Connection

```bash
# In another terminal, test connection:
curl http://localhost:3000/health
curl http://localhost:3000/api/db-test
```

### Step 3: Update Frontend Screens

See `SCREEN_UPDATE_CHECKLIST.md` for step-by-step instructions to update each screen.

### Step 4: Test Frontend

```bash
cd c:\onlinestore

# Start frontend
npm run dev
# or
npx expo start
```

## 🔐 Authentication Flow

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ 1. Signs in with Clerk
       ▼
┌──────────────────────┐
│  Clerk Auth          │
│  (Sign In/Sign Up)   │
└──────┬───────────────┘
       │
       │ 2. Provides JWT Token
       ▼
┌──────────────────────┐
│  API Client          │
│  (utils/api.ts)      │
│  • Injects token     │
│  • Makes requests    │
└──────┬───────────────┘
       │
       │ 3. Sends request with
       │    Authorization header
       ▼
┌──────────────────────┐
│  Express Backend     │
│  • Verifies token    │
│  • Processes request │
└──────┬───────────────┘
       │
       │ 4. Queries database
       ▼
┌──────────────────────┐
│  Neon PostgreSQL     │
│  • Returns data      │
└──────────────────────┘
```

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/register    → Register new user
POST   /api/auth/login       → Login (for manual auth only)
```

### Users
```
GET    /api/users/me         → Get current user profile
PUT    /api/users/me         → Update profile
GET    /api/users/:id        → Get user by ID
```

### Products
```
GET    /api/products         → List products (filterable)
GET    /api/products/:id     → Get product details
POST   /api/products         → Create product (seller only)
PUT    /api/products/:id     → Update product (seller only)
DELETE /api/products/:id     → Delete product (seller only)
```

### Orders
```
POST   /api/orders           → Create order
GET    /api/orders           → Get user's orders
GET    /api/orders/:id       → Get order details
PUT    /api/orders/:id/status → Update order status
```

### Wallet
```
GET    /api/wallet           → Get wallet balance
POST   /api/wallet/add-funds → Add funds to wallet
POST   /api/wallet/withdraw  → Withdraw from wallet
```

### Sellers
```
GET    /api/sellers/:id      → Get seller profile
GET    /api/sellers/analytics/orders     → Get seller's orders
GET    /api/sellers/analytics/dashboard  → Get seller analytics
```

## 💾 Database Schema

### Users Table
- id (PK)
- email (unique)
- password_hash
- first_name, last_name
- phone, avatar_url
- user_type: 'customer' | 'seller' | 'admin'
- status: 'active' | 'suspended' | 'deleted'
- created_at, updated_at

### Products Table
- id (PK)
- seller_id (FK → users)
- name, description
- price, original_price
- category, image_url
- stock_quantity
- rating, reviews_count
- created_at, updated_at

### Orders Table
- id (PK)
- customer_id (FK → users)
- seller_id (FK → users)
- total_amount
- status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
- shipping_address
- created_at, updated_at

### Order Items Table
- id (PK)
- order_id (FK → orders)
- product_id (FK → products)
- quantity, price
- created_at

### Wallets Table
- id (PK)
- user_id (FK → users, unique)
- balance
- currency (default: '₦')
- last_updated

### Cart Items Table
- id (PK)
- user_id (FK → users)
- product_id (FK → products)
- quantity
- added_at

## 🛠 Key Integration Files

### API Client (`utils/api.ts`)
Handles all HTTP requests with automatic Clerk JWT injection:
```typescript
import { apiClient } from '@/utils/api';

// All methods automatically include Clerk token
const products = await apiClient.getProducts();
const wallet = await apiClient.getWallet();
const order = await apiClient.createOrder(items, address);
```

### Product Store (`stores/productStore.ts`)
State management for products:
```typescript
const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
```

### Order Store (`stores/orderStore.ts`)
State management for orders:
```typescript
const { orders, fetchOrders, createOrder } = useOrderStore();
```

### Wallet Store (`stores/walletStore.ts`)
Updated with backend API:
```typescript
const { wallet, fetchWallet, addFunds, withdraw } = useWalletStore();
```

### User Profile Store (`stores/userProfileStore.ts`)
Clerk + backend integration:
```typescript
const { profile, fetchProfile, updateProfile } = useUserProfileStore();
useInitializeProfile(); // Auto-fetch on auth
```

## 🎨 UI Integration Steps

### Example: Home Screen Update

**Before (Mock Data):**
```typescript
const FEATURED_PRODUCTS = [
  { id: '1', title: 'Product', price: 99.99, ... },
  { id: '2', title: 'Product', price: 199.99, ... },
];
```

**After (Backend API):**
```typescript
import { useProductStore } from '@/stores/productStore';

export default function HomeScreen() {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts({ limit: 10 });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard {...item} />}
    />
  );
}
```

## 🧪 Testing Checklist

### Backend Tests
- [ ] Server starts on port 3000
- [ ] Health endpoint responds
- [ ] Database connection works
- [ ] Can register user
- [ ] Can login
- [ ] Can fetch products
- [ ] Can create order
- [ ] Can manage wallet

### Frontend Tests
- [ ] API client initialized
- [ ] Can fetch and display products
- [ ] Can create order
- [ ] Wallet operations work
- [ ] User profile displays correctly
- [ ] Offline mode works with AsyncStorage

### Integration Tests
- [ ] Sign in with Clerk → API call succeeds
- [ ] Create product → Appears in product list
- [ ] Add to cart → Can create order
- [ ] Create order → Wallet deducted
- [ ] Seller analytics → Shows real data

## 📊 Environment Variables

### Frontend (`.env`)
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Production Frontend
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Backend (`.env`)
```
DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Production Backend
```
DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
JWT_SECRET=strong-production-secret-key
PORT=3000
NODE_ENV=production
```

## 🚢 Deployment Checklist

### Backend Deployment (Vercel, Railway, etc.)
- [ ] Set production DATABASE_URL
- [ ] Set strong JWT_SECRET
- [ ] Run migrations on production database
- [ ] Update frontend API_URL to production domain
- [ ] Test all endpoints on production

### Frontend Deployment (EAS Build)
- [ ] Update EXPO_PUBLIC_API_URL
- [ ] Update Clerk keys for production
- [ ] Run EAS build
- [ ] Test on physical devices

## 📚 Documentation Files

- **INTEGRATION_GUIDE.md** - Detailed integration documentation
- **SCREEN_UPDATE_CHECKLIST.md** - Step-by-step screen update guide
- **BACKEND_INTEGRATION_COMPLETE.md** - Summary of what was created
- **Backend README.md** - Backend setup guide

## ❓ Common Issues & Solutions

### CORS Error
**Problem**: Frontend can't reach backend
**Solution**: Backend has CORS enabled. Check `EXPO_PUBLIC_API_URL` in `.env`

### Authentication Error
**Problem**: API returns 401 Unauthorized
**Solution**: 
- Ensure user is signed in with Clerk
- Check Clerk token is being sent
- Verify backend is checking correct claim

### Database Connection Error
**Problem**: Backend can't connect to Neon
**Solution**:
- Verify DATABASE_URL is correct in backend `.env`
- Test with: `npm run migrate`
- Check Neon dashboard for active connection

### Products Not Showing
**Problem**: Empty products list
**Solution**:
- Run migrations: `npm run migrate`
- Seed database with test products
- Check API response: `curl http://localhost:3000/api/products`

## 🎓 Learning Resources

- Zustand docs: https://github.com/pmndrs/zustand
- Express docs: https://expressjs.com
- PostgreSQL docs: https://www.postgresql.org/docs
- Clerk docs: https://clerk.com/docs
- Neon docs: https://neon.tech/docs

## ✅ Next Steps

1. **Start Backend** (5 min)
   - `cd c:\onlinestore-backend && npm run dev`

2. **Test Connection** (2 min)
   - Verify health endpoint

3. **Update 3 Critical Screens** (1-2 hours)
   - Home, Search, Orders (see SCREEN_UPDATE_CHECKLIST.md)

4. **Test End-to-End Flow** (30 min)
   - Browse → Cart → Checkout → Order confirmation

5. **Deploy to Production** (1-2 hours)
   - Backend to hosting service
   - Frontend with EAS Build

---

**Total Implementation Time**: 3-4 hours for full integration
**Difficulty Level**: Low-Medium (mostly following existing patterns)
**Support**: Refer to INTEGRATION_GUIDE.md and SCREEN_UPDATE_CHECKLIST.md

You're ready to go! 🚀
