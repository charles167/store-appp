# Implementation Examples

Quick copy-paste examples for common screen updates.

## Example 1: Home Screen with Products

**File**: `app/(customer)/home.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '@/theme/ThemeProvider';
import { useProductStore } from '@/stores/productStore'; // ← Add this
import { useWalletStore } from '@/stores/walletStore';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useTheme();
  
  // Replace static wallet with store
  const { wallet, fetchWallet } = useWalletStore();
  
  // Add product store
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Fetch wallet
    if (user?.id) {
      fetchWallet(user.id);
    }
  }, [user?.id, fetchWallet]);

  // Fetch products
  useEffect(() => {
    fetchProducts({ limit: 10 });
  }, []);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Rest of the component remains the same...
  return (
    <SafeAreaScroll>
      {/* Welcome header */}
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: '700' }}>
        {user?.firstName || 'Guest'} 👋
      </Text>

      {/* Wallet card - use real data */}
      {wallet && (
        <Card variant="elevated">
          <Text style={{ color: 'white', fontSize: 32, fontWeight: '800' }}>
            {wallet.currency}{wallet.balance.toLocaleString()}
          </Text>
        </Card>
      )}

      {/* Featured Products - use real data */}
      <View style={{ marginVertical: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
          Featured Products
        </Text>
        
        {productsLoading ? (
          <View style={{ flexDirection: 'row' }}>
            {[...Array(2)].map((_, i) => (
              <View key={i} style={{ width: '50%' }}>
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        ) : products.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {products.map((product, index) => (
              <View key={product.id} style={{ width: '50%' }}>
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onPress={() => handleProductPress(product.id)}
                  onFavoritePress={() => toggleFavorite(product.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary }}>No products available</Text>
        )}
      </View>
    </SafeAreaScroll>
  );
}
```

---

## Example 2: Search Screen with Backend

**File**: `app/(customer)/search.tsx`

```typescript
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useProductStore } from '@/stores/productStore'; // ← Add this
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import Input from '@/components/ui/Input';
import ProductCard from '@/components/ui/ProductCard';
import Header from '@/components/ui/Header';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Use product store
  const { products, fetchProducts, loading } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch products when search or category changes
  React.useEffect(() => {
    const filters: any = { limit: 50 };
    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    
    fetchProducts(filters);
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Search Products" showBackButton />

      <SafeAreaScroll contentContainerStyle={{ paddingHorizontal: 16 }}>
        {/* Search Input */}
        <Input
          placeholder="Search products..."
          icon="search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          rightIcon={searchQuery ? 'close-circle' : undefined}
          onRightIconPress={() => setSearchQuery('')}
          style={{ marginVertical: 16 }}
        />

        {/* Categories */}
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
          Categories
        </Text>
        <FlatList
          horizontal
          data={CATEGORIES}
          contentContainerStyle={{ gap: 12, marginBottom: 24 }}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedCategory === item ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: selectedCategory === item ? 'transparent' : colors.border,
              }}
            >
              <Text
                style={{
                  color: selectedCategory === item ? colors.background : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Results */}
        <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>
          {products.length} results
        </Text>

        {/* Products Grid */}
        {loading ? (
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Loading products...
          </Text>
        ) : products.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {products.map((product) => (
              <View key={product.id} style={{ width: '50%' }}>
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onPress={() => handleProductPress(product.id)}
                  onFavoritePress={() => toggleFavorite(product.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 32 }}>
            No products found
          </Text>
        )}
      </SafeAreaScroll>
    </View>
  );
}
```

---

## Example 3: Orders Screen

**File**: `app/(customer)/orders.tsx`

```typescript
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useOrderStore } from '@/stores/orderStore'; // ← Add this
import { SafeArea } from '@/components/ui/SafeArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Header from '@/components/ui/Header';

export default function OrdersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Use order store
  const { orders, fetchOrders, loading } = useOrderStore();

  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'shipped':
        return colors.warning;
      case 'pending':
        return colors.info;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details
    router.push(`/order/${orderId}`);
  };

  if (loading && orders.length === 0) {
    return (
      <SafeArea style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeArea>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeArea style={{ flex: 1 }}>
        <Header title="My Orders" showBackButton />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons
            name="bag-handle-outline"
            size={64}
            color={colors.textSecondary}
            style={{ marginBottom: 16, opacity: 0.5 }}
          />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            No Orders Yet
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24 }}>
            Start shopping to create your first order
          </Text>
          <Button
            title="Continue Shopping"
            variant="primary"
            onPress={() => router.push('/search')}
          />
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea style={{ flex: 1 }}>
      <Header title="My Orders" showBackButton />

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item: order }) => (
          <TouchableOpacity
            onPress={() => handleOrderPress(order.id)}
            activeOpacity={0.7}
          >
            <Card variant="elevated" style={{ padding: 16 }}>
              {/* Order Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <View>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>
                    Order #{order.id}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: getStatusColor(order.status) + '20', borderRadius: 8 }}>
                  <Text
                    style={{
                      color: getStatusColor(order.status),
                      fontSize: 12,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Order Amount */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {order.items?.length || 0} items
                </Text>
                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>
                  ₦{order.totalAmount.toLocaleString()}
                </Text>
              </View>

              {/* Items Preview */}
              {order.items && order.items.length > 0 && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                  {order.items.slice(0, 2).map((item, idx) => (
                    <Text
                      key={idx}
                      style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}
                      numberOfLines={1}
                    >
                      • {item.name || `Product ${item.productId}`}
                    </Text>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      +{order.items.length - 2} more
                    </Text>
                  )}
                </View>
              )}
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeArea>
  );
}
```

---

## Example 4: Seller Products Screen

**File**: `app/(seller)/products.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useProductStore } from '@/stores/productStore'; // ← Add this
import { SafeArea } from '@/components/ui/SafeArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Header from '@/components/ui/Header';

export default function SellerProductsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { products, fetchProducts, deleteProduct, loading } = useProductStore();

  useEffect(() => {
    // Fetch seller's products
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    router.push('/seller/product-create');
  };

  const handleEditProduct = (productId: string) => {
    router.push({
      pathname: '/seller/product-edit/[id]',
      params: { id: productId },
    });
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert('Delete Product', `Remove "${productName}" from store?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(productId);
            Alert.alert('Success', 'Product deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
  };

  if (loading && products.length === 0) {
    return (
      <SafeArea style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading products...</Text>
      </SafeArea>
    );
  }

  return (
    <SafeArea style={{ flex: 1 }}>
      <Header
        title="My Products"
        rightAction={{
          icon: 'add-circle',
          onPress: handleAddProduct,
        }}
      />

      {products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginVertical: 16 }}>
            No Products Yet
          </Text>
          <Button
            title="Add Your First Product"
            variant="primary"
            size="lg"
            onPress={handleAddProduct}
          />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item: product }) => (
            <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row' }}>
                {/* Product Image */}
                {product.imageUrl && (
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: colors.surface,
                    }}
                  />
                )}

                {/* Product Info */}
                <View style={{ flex: 1, padding: 12 }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
                    {product.name}
                  </Text>
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
                    ₦{product.price.toLocaleString()}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    Stock: {product.stockQuantity}
                  </Text>
                </View>

                {/* Actions */}
                <View style={{ padding: 12, justifyContent: 'space-around' }}>
                  <TouchableOpacity onPress={() => handleEditProduct(product.id)}>
                    <Ionicons name="pencil" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(product.id, product.name)}>
                    <Ionicons name="trash" size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeArea>
  );
}
```

---

## Example 5: Wallet Operations

**File**: `app/(customer)/wallet.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useWalletStore } from '@/stores/walletStore'; // ← Already updated
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function WalletScreen() {
  const { colors } = useTheme();
  const { wallet, fetchWallet, addFunds, withdraw } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch wallet balance
    fetchWallet();
  }, []);

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await addFunds(Number(amount));
      Alert.alert('Success', `Added ₦${amount} to wallet`);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (wallet && Number(amount) > wallet.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds');
      return;
    }

    setLoading(true);
    try {
      await withdraw(Number(amount));
      Alert.alert('Success', `Withdrawn ₦${amount} from wallet`);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Wallet Balance */}
      {wallet && (
        <Card variant="elevated" style={{ padding: 24, marginBottom: 24, backgroundColor: colors.primary }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>
            Available Balance
          </Text>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '800', marginVertical: 8 }}>
            {wallet.currency}{wallet.balance.toLocaleString()}
          </Text>
        </Card>
      )}

      {/* Amount Input */}
      <Input
        placeholder="Enter amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={{ marginBottom: 16 }}
      />

      {/* Action Buttons */}
      <View style={{ gap: 12 }}>
        <Button
          title="Add Funds"
          variant="primary"
          onPress={handleAddFunds}
          disabled={loading}
        />
        <Button
          title="Withdraw"
          variant="secondary"
          onPress={handleWithdraw}
          disabled={loading}
        />
      </View>
    </View>
  );
}
```

---

## Key Patterns

### Fetch on Mount
```typescript
useEffect(() => {
  fetchData();
}, []);
```

### Handle Loading State
```typescript
if (loading && data.length === 0) {
  return <LoadingSpinner />;
}
```

### Handle Errors
```typescript
try {
  await action();
  Alert.alert('Success', 'Action completed');
} catch (error) {
  Alert.alert('Error', error.message);
}
```

### Use Store Methods
```typescript
const { data, fetchData, createData, deleteData } = useStore();
```

---

These examples cover the most common update patterns. For more details, refer to the store documentation in `INTEGRATION_GUIDE.md`.
