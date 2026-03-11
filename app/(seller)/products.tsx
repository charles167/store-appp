import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    price: 199.99,
    stock: 45,
    sold: 234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    price: 399.99,
    stock: 12,
    sold: 156,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    status: 'low_stock',
    category: 'Wearables',
  },
  {
    id: '3',
    name: 'Premium Laptop Bag',
    price: 89.99,
    stock: 0,
    sold: 89,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'out_of_stock',
    category: 'Accessories',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard RGB',
    price: 149.99,
    stock: 67,
    sold: 445,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '5',
    name: 'Portable Charger 20K',
    price: 59.99,
    stock: 23,
    sold: 678,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    status: 'active',
    category: 'Accessories',
  },
  {
    id: '6',
    name: 'Wireless Mouse Pro',
    price: 79.99,
    stock: 5,
    sold: 234,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    status: 'low_stock',
    category: 'Electronics',
  },
];

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
];

export default function SellerProducts() {
  const router = useRouter();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: colors.success + '15', text: colors.success };
      case 'low_stock':
        return { label: 'Low Stock', bg: colors.warning + '15', text: colors.warning };
      case 'out_of_stock':
        return { label: 'Out of Stock', bg: colors.danger + '15', text: colors.danger };
      default:
        return { label: 'Unknown', bg: colors.textSecondary + '15', text: colors.textSecondary };
    }
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || product.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="My Products" subtitle={`${PRODUCTS.length} products`} />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Search and Add Button */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ gap: spacing.md }}>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
          />

          <Button
            variant="primary"
            onPress={() => {}}
            leftIcon="add-circle-outline"
          >
            Add New Product
          </Button>
        </Animated.View>

        {/* Filter Chips */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg }}>
              {FILTER_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                    borderRadius: spacing.full,
                    backgroundColor: selectedFilter === option.value ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedFilter === option.value ? colors.primary : colors.border,
                  }}
                  onPress={() => setSelectedFilter(option.value)}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: selectedFilter === option.value ? '#fff' : colors.text,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Products Grid */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={{ gap: spacing.md }}>
          {filteredProducts.length === 0 ? (
            <Card variant="flat" style={{ padding: spacing['2xl'], alignItems: 'center' }}>
              <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.md }}>
                No Products Found
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
              </Text>
            </Card>
          ) : (
            filteredProducts.map((product, index) => {
              const statusConfig = getStatusConfig(product.status);
              return (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(450 + index * 80).springify()}
                >
                  <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row' }}>
                      {/* Product Image */}
                      <Image
                        source={{ uri: product.image }}
                        style={{
                          width: 100,
                          height: 100,
                          backgroundColor: colors.surface,
                        }}
                        resizeMode="cover"
                      />

                      {/* Product Info */}
                      <View style={{ flex: 1, padding: spacing.md, gap: spacing.xs }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 }} numberOfLines={2}>
                            {product.name}
                          </Text>
                          <TouchableOpacity
                            style={{ marginLeft: spacing.sm }}
                            onPress={() => {}}
                          >
                            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          {product.category}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs }}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
                            ${product.price.toFixed(2)}
                          </Text>
                          <View
                            style={{
                              paddingHorizontal: spacing.sm,
                              paddingVertical: spacing.xs,
                              borderRadius: spacing.sm,
                              backgroundColor: statusConfig.bg,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: '700', color: statusConfig.text }}>
                              {statusConfig.label}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                              Stock: {product.stock}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="trending-up-outline" size={14} color={colors.success} />
                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                              Sold: {product.sold}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: spacing.md,
                          gap: spacing.xs,
                          borderRightWidth: 1,
                          borderRightColor: colors.border,
                        }}
                        onPress={() => {}}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: spacing.md,
                          gap: spacing.xs,
                        }}
                        onPress={() => {}}
                      >
                        <Ionicons name="eye-outline" size={18} color={colors.textSecondary} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
                          View
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
