import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');

const STATS = [
  {
    id: '1',
    label: 'Total Revenue',
    value: '$24,580',
    change: '+18.2%',
    isPositive: true,
    icon: 'cash-outline',
    gradient: ['#22c55e', '#16a34a'],
  },
  {
    id: '2',
    label: 'Orders',
    value: '156',
    change: '+12.5%',
    isPositive: true,
    icon: 'receipt-outline',
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: '3',
    label: 'Products',
    value: '42',
    change: '+3 new',
    isPositive: true,
    icon: 'cube-outline',
    gradient: ['#a855f7', '#9333ea'],
  },
  {
    id: '4',
    label: 'Customers',
    value: '89',
    change: '+5.4%',
    isPositive: true,
    icon: 'people-outline',
    gradient: ['#f59e0b', '#d97706'],
  },
];

const RECENT_ORDERS = [
  { id: '1', customer: 'John Doe', items: 3, total: '$156.00', status: 'pending', time: '5 min ago' },
  { id: '2', customer: 'Sarah Smith', items: 2, total: '$89.50', status: 'processing', time: '15 min ago' },
  { id: '3', customer: 'Mike Johnson', items: 5, total: '$234.00', status: 'shipped', time: '1 hour ago' },
  { id: '4', customer: 'Emma Wilson', items: 1, total: '$45.00', status: 'delivered', time: '2 hours ago' },
];

const QUICK_ACTIONS = [
  { id: '1', title: 'Add Product', icon: 'add-circle-outline', route: '/seller/products' },
  { id: '2', title: 'View Orders', icon: 'receipt-outline', route: '/seller/orders' },
  { id: '3', title: 'Analytics', icon: 'bar-chart-outline', route: '/seller/analytics' },
  { id: '4', title: 'Settings', icon: 'settings-outline', route: '/seller/profile' },
];

export default function SellerDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const colors = useColors();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: colors.warning + '15', text: colors.warning };
      case 'processing': return { bg: colors.info + '15', text: colors.info };
      case 'shipped': return { bg: colors.success + '15', text: colors.success };
      case 'delivered': return { bg: colors.success + '20', text: colors.success };
      default: return { bg: colors.textSecondary + '15', text: colors.textSecondary };
    }
  };

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      {/* Header Section */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing['2xl'],
          borderBottomLeftRadius: spacing['2xl'],
          borderBottomRightRadius: spacing['2xl'],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
              Welcome back,
            </Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>
              {user?.firstName || 'Seller'} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: spacing.lg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => router.push('/seller/profile')}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Store Rating Card */}
        <Card variant="flat" style={{ backgroundColor: '#fff', padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>
                Store Rating
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="star" size={24} color={colors.warning} />
                <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text }}>4.8</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>(234 reviews)</Text>
              </View>
            </View>
            <Button
              variant="outline"
              size="sm"
              onPress={() => {}}
            >
              View Store
            </Button>
          </View>
        </Card>
      </Animated.View>

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ gap: spacing.md }}>
          {STATS.map((stat, index) => (
            <Animated.View
              key={stat.id}
              entering={FadeInDown.delay(250 + index * 100).springify()}
            >
              <Card variant="elevated" style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: spacing.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stat.gradient[0] + '15',
                      marginRight: spacing.md,
                    }}
                  >
                    <Ionicons name={stat.icon as any} size={28} color={stat.gradient[0]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                      {stat.label}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>
                        {stat.value}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: spacing.sm,
                          backgroundColor: stat.gradient[0] + '15',
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: stat.gradient[0] }}>
                          {stat.change}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.delay(650 + index * 80).springify()}
                style={{ flex: 1 }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    padding: spacing.lg,
                    borderRadius: spacing.xl,
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                  onPress={() => router.push(action.route as any)}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: spacing.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <Ionicons name={action.icon as any} size={24} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff', textAlign: 'center' }}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
              Recent Orders
            </Text>
            <TouchableOpacity onPress={() => router.push('/seller/orders')}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
                See All →
              </Text>
            </TouchableOpacity>
          </View>

          {RECENT_ORDERS.map((order, index) => {
            const statusColor = getStatusColor(order.status);
            return (
              <Animated.View
                key={order.id}
                entering={FadeInDown.delay(850 + index * 80).springify()}
              >
                <Card variant="elevated" style={{ padding: spacing.lg }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                        {order.customer}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                        {order.total}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderRadius: spacing.full,
                        backgroundColor: statusColor.bg,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor.text, textTransform: 'capitalize' }}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        {order.items} items
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                        {order.time}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
