/**
 * Premium Search Screen - 2025 Design
 * Features:
 * - Intuitive search with real-time suggestions
 * - Category filters with horizontal scroll
 * - Product grid display
 * - Sorting and filtering options
 * - Empty state handling
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import Input from '@/components/ui/Input';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Header from '@/components/ui/Header';

const { width } = Dimensions.get('window');

// Mock product database
const ALL_PRODUCTS = [
  {
    id: '1',
    title: 'Premium Wireless Earbuds',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 256,
    category: 'Electronics',
  },
  {
    id: '2',
    title: 'Designer Handbag',
    price: 189.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 189,
    category: 'Fashion',
  },
  {
    id: '3',
    title: 'Smart Home Speaker',
    price: 69.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 342,
    category: 'Electronics',
  },
  {
    id: '4',
    title: 'Professional Yoga Mat',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 178,
    category: 'Sports',
  },
  {
    id: '5',
    title: 'Organic Coffee Maker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 234,
    category: 'Home',
  },
  {
    id: '6',
    title: 'Premium Blue Jeans',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
    rating: 4.4,
    reviews: 145,
    category: 'Fashion',
  },
  {
    id: '7',
    title: 'Wireless Charging Pad',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1591290619762-fdf091f9e05f?w=400&h=400&fit=crop',
    rating: 4.3,
    reviews: 298,
    category: 'Electronics',
  },
  {
    id: '8',
    title: 'Stainless Steel Water Bottle',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602526224879-f4e5e74b44d8?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 412,
    category: 'Sports',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    (params?.category as string) || 'All'
  );
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = ALL_PRODUCTS.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        return results.sort((a, b) => a.price - b.price);
      case 'price-high':
        return results.sort((a, b) => b.price - a.price);
      case 'rating':
        return results.sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return results.sort((a, b) => b.reviews - a.reviews);
    }
  }, [searchQuery, selectedCategory, sortBy]);

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
      {/* Header */}
      <Header 
        title="Search Products"
        showBackButton
        rightAction={{
          icon: 'funnel',
          onPress: () => {}, // Handle filter
        }}
      />

      {/* Search and Filters */}
      <SafeAreaScroll
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <Input
            placeholder="Search products..."
            icon="search"
            rightIcon={searchQuery ? 'close-circle' : undefined}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onRightIconPress={() => setSearchQuery('')}
            style={{ marginTop: spacing.md, marginBottom: spacing.lg }}
          />
        </Animated.View>

        {/* Category Filter */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          style={{ marginBottom: spacing.lg }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: '600',
              marginBottom: spacing.md,
            }}
          >
            Categories
          </Text>
          <FlatList
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            contentContainerStyle={{ gap: spacing.md }}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.lg,
                  backgroundColor:
                    selectedCategory === item ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor:
                    selectedCategory === item ? 'transparent' : colors.border,
                  ...shadows.sm,
                }}
              >
                <Text
                  style={{
                    color:
                      selectedCategory === item ? colors.background : colors.text,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>

        {/* Sort Options */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(300)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontWeight: '500',
            }}
          >
            {filteredProducts.length} results
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontWeight: '600',
                marginLeft: spacing.xs,
              }}
            >
              Sort
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Products Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -spacing.sm,
          }}
        >
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={{ width: '50%', marginBottom: spacing.md }}>
                  <ProductCardSkeleton />
                </View>
              ))}
            </>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.delay(300 + index * 50).duration(400)}
                style={{
                  width: '50%',
                  marginBottom: spacing.md,
                }}
              >
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onPress={() => handleProductPress(product.id)}
                  onFavoritePress={() => toggleFavorite(product.id)}
                />
              </Animated.View>
            ))
          ) : (
            <View
              style={{
                width: '100%',
                paddingVertical: spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="search"
                size={48}
                color={colors.textSecondary}
                style={{ marginBottom: spacing.lg, opacity: 0.5 }}
              />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: spacing.sm,
                }}
              >
                No products found
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </SafeAreaScroll>
    </View>
  );
}
