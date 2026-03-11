/**
 * Premium Shopping Cart Screen - 2025 Design
 * Features:
 * - Cart items with swipe to delete
 * - Quantity adjusters
 * - Order summary with breakdown
 * - Promo code input
 * - Smooth animations
 * - Empty cart state
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/stores/cartStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';
import { SafeAreaScroll, SafeArea } from '@/components/ui/SafeArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Header from '@/components/ui/Header';

// Mock cart items (used to seed store if empty so UI is testable)
const INITIAL_CART_ITEMS = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    seller: 'TechStore',
  },
  {
    id: '2',
    name: 'Smartwatch Pro',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    seller: 'GadgetHub',
  },
];

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const items = useCartStore((s) => s.items);
  const setStoreItems = useCartStore((s) => s.setItems);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [promoCode, setPromoCode] = useState('');

  // Seed demo items if store is empty so checkout flow is testable
  useEffect(() => {
    if (items.length === 0) {
      setStoreItems(INITIAL_CART_ITEMS);
    }
  }, [items.length, setStoreItems]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const handleQuantityChange = (itemId: string, change: number) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;
    const nextQty = Math.max(1, target.quantity + change);
    updateQuantity(itemId, nextQty);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    setStoreItems(items);
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeArea>
        <Header title="Shopping Cart" showBackButton />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="bag-handle-outline"
            size={64}
            color={colors.textSecondary}
            style={{ marginBottom: spacing.lg, opacity: 0.5 }}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: '700',
              marginBottom: spacing.sm,
            }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: 'center',
              marginBottom: spacing.xl,
            }}
          >
            Add items to get started
          </Text>
          <Button
            title="Continue Shopping"
            variant="primary"
            size="lg"
            onPress={() => router.push('/search')}
          />
        </View>
      </SafeArea>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Shopping Cart"
        subtitle={`${items.length} item${items.length !== 1 ? 's' : ''}`}
        showBackButton
      />

      <SafeAreaScroll
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          {items.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <Card
                variant="elevated"
                padding={0}
                style={{
                  flexDirection: 'row',
                  marginBottom: spacing.md,
                  overflow: 'hidden',
                }}
              >
                {/* Product Image */}
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: radius.lg,
                    margin: spacing.md,
                  }}
                  resizeMode="cover"
                />

                {/* Product Info */}
                <View style={{ flex: 1, paddingRight: spacing.md, paddingVertical: spacing.md, justifyContent: 'space-between' }}>
                  <View>
                    <Text
                      numberOfLines={2}
                      style={{
                        color: colors.text,
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: spacing.xs,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      {item.seller}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 16,
                        fontWeight: '700',
                      }}
                    >
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </Text>

                    {/* Quantity Control */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.surface,
                        borderRadius: radius.md,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, -1)}
                        activeOpacity={0.6}
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                        }}
                      >
                        <Ionicons name="remove" size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: '600',
                          paddingHorizontal: spacing.sm,
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, 1)}
                        activeOpacity={0.6}
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                        }}
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  activeOpacity={0.6}
                  style={{
                    padding: spacing.md,
                    justifyContent: 'flex-start',
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </Card>
            </Animated.View>
          ))}
        </View>

        {/* Promo Code Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="elevated" padding={spacing.lg} style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: spacing.md,
              }}
            >
              Apply Promo Code
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.md,
                alignItems: 'flex-end',
              }}
            >
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Enter code"
                  icon="ticket"
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
              </View>
              <Button
                title="Apply"
                variant="secondary"
                size="md"
                onPress={() => {}}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Card variant="elevated" padding={spacing.lg} style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '700',
                marginBottom: spacing.lg,
              }}
            >
              Order Summary
            </Text>

            {/* Summary Rows */}
            <View style={{ gap: spacing.md }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  Subtotal
                </Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  ₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  Shipping
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  {shippingCost === 0 && (
                    <Text
                      style={{
                        color: colors.success,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      Free
                    </Text>
                  )}
                  {shippingCost > 0 && (
                    <>
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 12,
                          textDecorationLine: 'line-through',
                        }}
                      >
                        ₦15.99
                      </Text>
                      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                        ₦{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Tax</Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  ₦{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.divider,
                  marginVertical: spacing.md,
                }}
              />

              {/* Total */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
                  Total
                </Text>
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700' }}>
                  ₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </SafeAreaScroll>

      {/* Checkout Button */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          gap: spacing.md,
        }}
      >
        <Button
          title="Proceed to Checkout"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleCheckout}
        />
        <Button
          title="Continue Shopping"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => router.push('/search')}
        />
      </View>
    </View>
  );
}
