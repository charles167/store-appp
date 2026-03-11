import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');

const METRICS = [
  { label: 'Revenue', value: '$24,580', change: '+18.2%', icon: 'cash-outline', color: '#22c55e' },
  { label: 'Orders', value: '1,234', change: '+12.5%', icon: 'receipt-outline', color: '#3b82f6' },
  { label: 'Customers', value: '456', change: '+8.7%', icon: 'people-outline', color: '#a855f7' },
  { label: 'Avg Order', value: '$89.50', change: '+5.2%', icon: 'trending-up-outline', color: '#f59e0b' },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Headphones', sales: 234, revenue: 46680 },
  { name: 'Smart Watch', sales: 156, revenue: 62244 },
  { name: 'Keyboard RGB', sales: 145, revenue: 21755 },
  { name: 'Portable Charger', sales: 123, revenue: 7377 },
];

const REVENUE_DATA = [
  { month: 'Jan', value: 3000, percentage: 40 },
  { month: 'Feb', value: 4500, percentage: 60 },
  { month: 'Mar', value: 3200, percentage: 42 },
  { month: 'Apr', value: 5000, percentage: 66 },
  { month: 'May', value: 6200, percentage: 82 },
  { month: 'Jun', value: 7500, percentage: 100 },
];

const DAILY_ORDERS = [
  { day: 'Mon', value: 12, percentage: 42 },
  { day: 'Tue', value: 19, percentage: 66 },
  { day: 'Wed', value: 8, percentage: 28 },
  { day: 'Thu', value: 22, percentage: 77 },
  { day: 'Fri', value: 15, percentage: 52 },
  { day: 'Sat', value: 28, percentage: 100 },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 45, color: '#0ea5e9' },
  { name: 'Accessories', value: 32, color: '#22c55e' },
  { name: 'Wearables', value: 23, color: '#f59e0b' },
];

export default function SellerAnalytics() {
  const colors = useColors();

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Analytics" subtitle="Your store performance" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Metrics Grid */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ gap: spacing.md }}>
          {METRICS.map((metric, index) => (
            <Animated.View key={metric.label} entering={FadeInDown.delay(100 + index * 80).springify()}>
              <Card variant="elevated" style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>
                      {metric.label}
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
                      {metric.value}
                    </Text>
                    <View
                      style={{
                        marginTop: spacing.sm,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                        borderRadius: spacing.sm,
                        backgroundColor: metric.color + '15',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: metric.color }}>
                        {metric.change}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: spacing.md,
                      backgroundColor: metric.color + '15',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={metric.icon as any} size={28} color={metric.color} />
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Revenue Trend Chart */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Revenue Trend
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg }}>
            <View style={{ gap: spacing.md }}>
              {REVENUE_DATA.map((item, index) => (
                <Animated.View
                  key={item.month}
                  entering={FadeInDown.delay(650 + index * 50).springify()}
                  style={{ gap: 6 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, width: 40 }}>
                      {item.month}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                      ${item.value.toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ height: 24, backgroundColor: colors.surface, borderRadius: spacing.sm, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Daily Orders Chart */}
        <Animated.View entering={FadeInDown.delay(700).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Daily Orders
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg }}>
            <View style={{ gap: spacing.md }}>
              {DAILY_ORDERS.map((item, index) => (
                <Animated.View
                  key={item.day}
                  entering={FadeInDown.delay(750 + index * 50).springify()}
                  style={{ gap: 6 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, width: 40 }}>
                      {item.day}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.success }}>
                      {item.value} orders
                    </Text>
                  </View>
                  <View style={{ height: 24, backgroundColor: colors.surface, borderRadius: spacing.sm, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        backgroundColor: colors.success,
                      }}
                    />
                  </View>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Category Distribution */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Sales by Category
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg, gap: spacing.md }}>
            {CATEGORY_DATA.map((item, index) => {
              const total = CATEGORY_DATA.reduce((sum, d) => sum + d.value, 0);
              const percentage = (item.value / total) * 100;
              return (
                <Animated.View
                  key={item.name}
                  entering={FadeInDown.delay(850 + index * 50).springify()}
                  style={{ gap: 6 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: spacing.full,
                          backgroundColor: item.color,
                        }}
                      />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={{ height: 20, backgroundColor: colors.surface, borderRadius: spacing.sm, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </View>
                </Animated.View>
              );
            })}
          </Card>
        </Animated.View>

        {/* Top Products */}
        <Animated.View entering={FadeInDown.delay(900).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Top Products
          </Text>
          {TOP_PRODUCTS.map((product, index) => (
            <Animated.View
              key={product.name}
              entering={FadeInDown.delay(950 + index * 80).springify()}
            >
              <Card variant="elevated" style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 }}>
                    {product.name}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 4,
                      borderRadius: spacing.sm,
                      backgroundColor: colors.primary + '15',
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>
                      #{index + 1}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing.lg }}>
                  <View>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                      Sales
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                      {product.sales}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                      Revenue
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.success }}>
                      ${product.revenue.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
