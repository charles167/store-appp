/**
 * Premium Orders Screen - 2025 Design
 * Features:
 * - Order list with status badges
 * - Order details preview
 * - Tracking information
 * - Filter by status
 * - Order history
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';

interface OrderItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

const ORDERS: Order[] = [
  {
    id: '#ORD-2026-001',
    date: '2026-01-01',
    status: 'delivered',
    total: 449.98,
    items: [
      {
        id: '1',
        title: 'Premium Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        quantity: 1,
        price: 199.99,
      },
      {
        id: '2',
        title: 'Smartwatch Pro',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        quantity: 1,
        price: 249.99,
      },
    ],
  },
  {
    id: '#ORD-2025-042',
    date: '2025-12-28',
    status: 'in_transit',
    total: 129.99,
    items: [
      {
        id: '3',
        title: 'Premium Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
        quantity: 1,
        price: 129.99,
      },
    ],
  },
  {
    id: '#ORD-2025-041',
    date: '2025-12-25',
    status: 'processing',
    total: 69.99,
    items: [
      {
        id: '4',
        title: 'Smart Home Speaker',
        image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop',
        quantity: 1,
        price: 69.99,
      },
    ],
  },
];

const STATUS_CONFIG = {
  processing: {
    label: 'Processing',
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    icon: 'time' as const,
  },
  in_transit: {
    label: 'In Transit',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    icon: 'airplane' as const,
  },
  delivered: {
    label: 'Delivered',
    color: '#10b981',
    backgroundColor: '#f0fdf4',
    icon: 'checkmark-circle' as const,
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    icon: 'close-circle' as const,
  },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = selectedStatus === 'all' 
    ? ORDERS 
    : ORDERS.filter(order => order.status === selectedStatus);

  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="My Orders" showBackButton />

      {/* Status Filter */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
          flexDirection: 'row',
          gap: spacing.md,
          overflow: 'hidden',
        }}
      >
        {(['all', 'processing', 'in_transit', 'delivered'] as const).map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.lg,
              backgroundColor: selectedStatus === status ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: selectedStatus === status ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                color: selectedStatus === status ? colors.background : colors.text,
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {status.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SafeAreaScroll
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
            {filteredOrders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status];
              
              return (
                <Animated.View
                  key={order.id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                >
                  <TouchableOpacity
                    onPress={() => handleOrderPress(order.id)}
                    activeOpacity={0.7}
                  >
                    <Card
                      variant="elevated"
                      padding={spacing.lg}
                      style={{ marginBottom: spacing.md }}
                    >
                      {/* Order Header */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: spacing.md,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: colors.text,
                              fontSize: 16,
                              fontWeight: '700',
                              marginBottom: spacing.xs,
                            }}
                          >
                            {order.id}
                          </Text>
                          <Text
                            style={{
                              color: colors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: radius.lg,
                            backgroundColor: statusConfig.backgroundColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: spacing.sm,
                          }}
                        >
                          <Ionicons
                            name={statusConfig.icon}
                            size={14}
                            color={statusConfig.color}
                          />
                          <Text
                            style={{
                              color: statusConfig.color,
                              fontSize: 12,
                              fontWeight: '600',
                            }}
                          >
                            {statusConfig.label}
                          </Text>
                        </View>
                      </View>

                      {/* Items Preview */}
                      <View
                        style={{
                          marginBottom: spacing.md,
                          paddingBottom: spacing.md,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.divider,
                        }}
                      >
                        {order.items.slice(0, 2).map((item, idx) => (
                          <View
                            key={item.id}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: spacing.md,
                              marginBottom: idx < Math.min(2, order.items.length) - 1 ? spacing.md : 0,
                            }}
                          >
                            <Image
                              source={{ uri: item.image }}
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: radius.md,
                              }}
                              resizeMode="cover"
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  color: colors.text,
                                  fontSize: 13,
                                  fontWeight: '600',
                                  marginBottom: spacing.xs,
                                }}
                              >
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  color: colors.textSecondary,
                                  fontSize: 12,
                                }}
                              >
                                Qty: {item.quantity}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: colors.primary,
                                fontSize: 13,
                                fontWeight: '700',
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                        {order.items.length > 2 && (
                          <Text
                            style={{
                              color: colors.textSecondary,
                              fontSize: 12,
                              fontWeight: '500',
                              marginTop: spacing.md,
                            }}
                          >
                            +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                          </Text>
                        )}
                      </View>

                      {/* Order Footer */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: colors.textSecondary,
                              fontSize: 12,
                              marginBottom: spacing.xs,
                            }}
                          >
                            Total
                          </Text>
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 18,
                              fontWeight: '700',
                            }}
                          >
                            ${order.total.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: spacing.sm,
                            paddingHorizontal: spacing.lg,
                            paddingVertical: spacing.md,
                            borderRadius: radius.lg,
                            backgroundColor: colors.primaryLight,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 13,
                              fontWeight: '600',
                            }}
                          >
                            Track
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color={colors.primary}
                          />
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: spacing.xl,
            }}
          >
            <Ionicons
              name="bag-outline"
              size={56}
              color={colors.textSecondary}
              style={{ marginBottom: spacing.lg, opacity: 0.5 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
                marginBottom: spacing.sm,
              }}
            >
              No Orders
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              You haven't placed any orders yet
            </Text>
          </View>
        )}
      </SafeAreaScroll>
    </View>
  );
}

