/**
 * Premium Home Screen - 2025 Design
 * Features:
 * - Modern welcome header with greeting
 * - Intuitive search bar with filters
 * - Category carousel
 * - Featured products with animations
 * - Promotional banner
 * - Personalized recommendations
 * 
 * Design System:
 * - Apple HIG + Material You inspired
 * - Soft shadows and gradients
 * - Smooth animations with Reanimated
 * - Dark mode support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { useWalletStore } from '@/stores/walletStore';
import { spacing, radius, shadows } from '@/theme/spacing';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

const { width } = Dimensions.get('window');

// Mock data - replace with API calls
const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: '📱' },
  { id: '2', name: 'Fashion', icon: '👗' },
  { id: '3', name: 'Home', icon: '🏠' },
  { id: '4', name: 'Beauty', icon: '💄' },
  { id: '5', name: 'Sports', icon: '⚽' },
  { id: '6', name: 'Books', icon: '📚' },
];

const FEATURED_PRODUCTS = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 324,
  },
  {
    id: '2',
    title: 'Smartwatch Pro',
    price: 249.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 456,
  },
  {
    id: '3',
    title: 'Premium Backpack',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 178,
  },
  {
    id: '4',
    title: 'Camera Lens Pro',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 234,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useTheme();
  const { wallet, fetchWallet } = useWalletStore();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    fetchWallet('customer-001');
  }, [fetchWallet]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId },
    });
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const categoryItemWidth = (width - spacing.lg * 2 - spacing.md * 4) / 3;

  return (
    <SafeAreaScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
    >
      {/* Welcome Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500',
          }}
        >
          Welcome back,
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            fontWeight: '700',
            marginTop: spacing.xs,
            letterSpacing: -0.5,
          }}
        >
          {user?.firstName || 'Guest'} 👋
        </Text>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={{ marginBottom: spacing.xl }}
      >
        <TouchableOpacity
          onPress={handleSearchPress}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            ...shadows.md,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={{ marginRight: spacing.md }}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 15,
              flex: 1,
            }}
          >
            Search products...
          </Text>
          <Ionicons name="tune" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Wallet Snapshot */}
      {wallet && (
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={{ marginBottom: spacing.xl }}>
          <Card
            variant="elevated"
            style={{
              backgroundColor: colors.primary,
              padding: spacing.lg,
              borderRadius: radius.lg,
              overflow: 'hidden',
            }}
          >
            <View style={{ position: 'absolute', right: -60, top: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <View style={{ position: 'absolute', left: -30, bottom: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.06)' }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, gap: spacing.sm }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>
                  Available Balance
                </Text>
                <Text style={{ color: 'white', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 }}>
                  {wallet.currency}
                  {wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' }}>
                  Updated {new Date(wallet.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/wallet')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderRadius: radius.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  ...shadows.md,
                }}
              >
                <Ionicons name="add-circle" size={18} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Categories Section */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={{ marginBottom: spacing.xl }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '700',
            }}
          >
            Categories
          </Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {CATEGORIES.map((category, index) => (
            <Animated.View
              key={category.id}
              entering={FadeInUp.delay(300 + index * 50).duration(400)}
              style={{
                width: categoryItemWidth,
                marginBottom: spacing.md,
              }}
            >
              <TouchableOpacity
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <Card
                  variant="elevated"
                  padding={spacing.md}
                  style={{
                    alignItems: 'center',
                    borderRadius: radius.xl,
                  }}
                >
                  <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>
                    {category.icon}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {category.name}
                  </Text>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Premium Promotional Banner */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={{ marginBottom: spacing.xl }}
      >
        <Card
          variant="elevated"
          padding={spacing.lg}
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, marginRight: spacing.lg }}>
              <Text
                style={{
                  color: colors.background,
                  fontSize: 20,
                  fontWeight: '700',
                  marginBottom: spacing.sm,
                }}
              >
                New Year Sale
              </Text>
              <Text
                style={{
                  color: colors.background,
                  fontSize: 13,
                  opacity: 0.9,
                  marginBottom: spacing.md,
                }}
              >
                Get up to 50% off + Free shipping
              </Text>
              <Button
                title="Explore Now"
                size="sm"
                variant="secondary"
                onPress={() => router.push('/search')}
                style={{ alignSelf: 'flex-start' }}
              />
            </View>
            <Text style={{ fontSize: 48 }}>🎉</Text>
          </View>
        </Card>
      </Animated.View>

      {/* Featured Products Section */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400)}
        style={{ marginBottom: spacing.xl }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '700',
            }}
          >
            Trending Now
          </Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              See All
            </Text>
          </TouchableOpacity>
        </View>

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
              {[...Array(2)].map((_, i) => (
                <View key={i} style={{ width: '50%', marginBottom: spacing.md }}>
                  <ProductCardSkeleton />
                </View>
              ))}
            </>
          ) : (
            FEATURED_PRODUCTS.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInUp.delay(600 + index * 50).duration(400)}
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
          )}
        </View>
      </Animated.View>
    </SafeAreaScroll>
  );
}
