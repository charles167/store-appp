# Screen Integration Checklist

This checklist helps you migrate screens from mock data to backend API calls.

## Customer Screens

### ✅ Product Details (`app/product/[id].tsx`)
**Status**: Already integrated with cart
- [x] Adds to cart via `useCartStore`
- [x] Toast notifications on add
- [ ] Fetch product from backend (optional - can use static product list)

### [ ] Home (`app/(customer)/home.tsx`)

**Changes needed:**
```typescript
// BEFORE: Static mock data
const FEATURED_PRODUCTS = [...]

// AFTER: Dynamic from backend
import { useProductStore } from '@/stores/productStore';

const { products, fetchProducts, loading } = useProductStore();

useEffect(() => {
  fetchProducts({ limit: 10 });
}, []);
```

**Steps:**
1. Remove `FEATURED_PRODUCTS` constant
2. Import `useProductStore`
3. Add `fetchProducts()` in useEffect
4. Replace `FEATURED_PRODUCTS.map()` with `products.map()`
5. Show loading state while fetching

---

### [ ] Search (`app/(customer)/search.tsx`)

**Changes needed:**
```typescript
// Use backend API instead of filtering ALL_PRODUCTS locally
const { products, fetchProducts } = useProductStore();

const handleSearch = (query) => {
  fetchProducts({ search: query, category: selectedCategory });
};
```

**Steps:**
1. Remove `ALL_PRODUCTS` constant
2. Import `useProductStore`
3. Update search to call `fetchProducts()` with search filter
4. Update category filter to pass to backend
5. Remove local filtering logic

---

### [ ] Cart (`app/(customer)/cart.tsx`)

**Changes needed:**
```typescript
// Use orderStore to create order
import { useOrderStore } from '@/stores/orderStore';

const { createOrder } = useOrderStore();

const handleCheckout = async () => {
  const items = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));
  await createOrder(items, shippingAddress);
  // Clear cart after successful order
  clearCart();
};
```

**Steps:**
1. Import `useOrderStore`
2. Update `handleCheckout()` to use `createOrder()`
3. Convert cart items format for API
4. Clear cart after success
5. Show success/error toast

---

### [ ] Orders (`app/(customer)/orders.tsx`)

**Changes needed:**
```typescript
// Remove mock MOCK_ORDERS
import { useOrderStore } from '@/stores/orderStore';

const { orders, fetchOrders } = useOrderStore();

useEffect(() => {
  fetchOrders();
}, []);

// Use real orders data
return (
  <FlatList
    data={orders}
    renderItem={({ item }) => <OrderCard order={item} />}
  />
);
```

**Steps:**
1. Remove `MOCK_ORDERS` constant
2. Import `useOrderStore`
3. Add `fetchOrders()` in useEffect
4. Replace mock data with `orders`
5. Update OrderCard component prop names if needed

---

### [ ] Wallet (`app/(customer)/wallet.tsx`)

**Changes needed:**
```typescript
// Already partially done
const { wallet, addFunds, withdraw } = useWalletStore();

const handleAddFunds = async (amount) => {
  try {
    await addFunds(amount);
    showToast('Funds added successfully');
  } catch (error) {
    showToast(error.message);
  }
};
```

**Steps:**
1. Update button handlers to use store methods
2. Add error handling with try/catch
3. Remove mock transaction generation
4. Keep AsyncStorage for offline support

---

## Seller Screens

### [ ] Products (`app/(seller)/products.tsx`)

**Changes needed:**
```typescript
// Remove MOCK_PRODUCTS
import { useProductStore } from '@/stores/productStore';

const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();

useEffect(() => {
  fetchProducts(); // Will fetch seller's products from backend
}, []);

// For create/update
const handleSave = async (productData) => {
  if (editingId) {
    await updateProduct(editingId, productData);
  } else {
    await createProduct(productData);
  }
};
```

**Steps:**
1. Remove `MOCK_PRODUCTS`
2. Import `useProductStore`
3. Use `fetchProducts()` to load seller's products
4. Update create button to use `createProduct()`
5. Update edit/delete to use store methods
6. Add loading states and error handling

---

### [ ] Orders (`app/(seller)/orders.tsx`)

**Changes needed:**
```typescript
// Get seller's orders from backend
import { useOrderStore } from '@/stores/orderStore';

// Note: May need custom endpoint for seller orders
const getSellerOrders = async () => {
  return apiClient.request('/sellers/analytics/orders');
};
```

**Steps:**
1. Create `getSellerOrders()` endpoint if not exists
2. Fetch orders instead of using mock data
3. Update order status with `updateOrderStatus()`
4. Show real order data

---

### [ ] Dashboard (`app/(seller)/dashboard.tsx`)

**Changes needed:**
```typescript
// Fetch real analytics
const getSellerAnalytics = async () => {
  return apiClient.request('/sellers/analytics/dashboard');
};
```

**Steps:**
1. Create analytics endpoint in backend if needed
2. Fetch real metrics instead of mock
3. Update charts with real data

---

### [ ] Withdrawal (`app/(seller)/withdrawal.tsx`)

**Changes needed:**
```typescript
const { wallet, withdraw } = useWalletStore();

const handleRequestWithdrawal = async (amount) => {
  try {
    await withdraw(amount);
    // Show success message
  } catch (error) {
    // Show error message
  }
};
```

**Steps:**
1. Use `withdraw()` from wallet store
2. Add proper error handling
3. Show withdrawal history from backend
4. Update status tracking

---

## Admin Screens

### [ ] Users (`app/(admin)/users.tsx`)

**Changes needed:**
```typescript
// Create userStore or use API directly
const getUsers = async () => {
  return apiClient.request('/admin/users');
};

const deleteUser = async (userId) => {
  return apiClient.request(`/admin/users/${userId}`, { method: 'DELETE' });
};
```

**Steps:**
1. Add `/admin/users` endpoint to backend if needed
2. Implement user list/management
3. Add delete/suspend functionality
4. Update user status

---

### [ ] Analytics (`app/(admin)/analytics.tsx`)

**Changes needed:**
```typescript
const getAdminAnalytics = async () => {
  return apiClient.request('/admin/analytics');
};
```

**Steps:**
1. Add `/admin/analytics` endpoint to backend
2. Fetch real platform metrics
3. Update dashboard charts

---

## Implementation Priority

### 🔴 CRITICAL (Do First)
1. [ ] Product Store integration
2. [ ] Home screen
3. [ ] Search screen
4. [ ] Orders screen

### 🟡 IMPORTANT (Do Next)
5. [ ] Cart checkout with Orders
6. [ ] Wallet operations
7. [ ] Seller Products management

### 🟢 NICE-TO-HAVE (Do Later)
8. [ ] Admin screens
9. [ ] Analytics
10. [ ] Advanced features

---

## Testing Each Screen

### Before Updating
1. Verify backend is running: `npm run dev` in `onlinestore-backend`
2. Check database connection: `curl http://localhost:3000/api/db-test`

### After Updating Each Screen
1. Navigate to the screen
2. Verify data loads from API
3. Test create/update/delete if applicable
4. Check error handling
5. Verify loading states

---

## Common Patterns

### Fetch Pattern
```typescript
useEffect(() => {
  fetchData();
}, [fetchData]); // Or add dependency array
```

### Create/Update Pattern
```typescript
const handleSave = async (data) => {
  try {
    await createOrUpdate(data);
    showSuccess('Saved successfully');
  } catch (error) {
    showError(error.message);
  }
};
```

### Delete Pattern
```typescript
const handleDelete = async (id) => {
  Alert.alert('Confirm', 'Delete this item?', [
    { text: 'Cancel' },
    {
      text: 'Delete',
      onPress: async () => {
        try {
          await deleteItem(id);
          showSuccess('Deleted');
        } catch (error) {
          showError(error.message);
        }
      },
    },
  ]);
};
```

---

## Need Help?

Refer to `INTEGRATION_GUIDE.md` for:
- Detailed API method signatures
- Complete store usage examples
- Environment setup
- Troubleshooting

---

**Total Screens to Update**: 10+
**Estimated Time**: 2-3 hours
**Difficulty**: Low (mostly copy-paste patterns)
