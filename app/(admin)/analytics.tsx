import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const PLATFORM_METRICS = [
  { label: 'Platform Revenue', value: '$458,230', change: '+22.5%', icon: 'cash-outline', color: '#22c55e' },
  { label: 'Total Orders', value: '12,456', change: '+18.3%', icon: 'receipt-outline', color: '#3b82f6' },
  { label: 'Active Users', value: '8,942', change: '+14.2%', icon: 'people-outline', color: '#a855f7' },
  { label: 'Active Sellers', value: '234', change: '+6.8%', icon: 'storefront-outline', color: '#f59e0b' },
];

const REVENUE_TREND = [
  { month: 'Jan', value: 45000, percentage: 35 },
  { month: 'Feb', value: 62000, percentage: 48 },
  { month: 'Mar', value: 58000, percentage: 45 },
  { month: 'Apr', value: 78000, percentage: 61 },
  { month: 'May', value: 92000, percentage: 72 },
  { month: 'Jun', value: 128000, percentage: 100 },
];

const USER_GROWTH = [
  { month: 'Jan', customers: 1200, sellers: 45, percentage: 30 },
  { month: 'Feb', customers: 1456, sellers: 52, percentage: 35 },
  { month: 'Mar', customers: 1890, sellers: 64, percentage: 45 },
  { month: 'Apr', customers: 2340, sellers: 78, percentage: 55 },
  { month: 'May', customers: 3120, sellers: 98, percentage: 75 },
  { month: 'Jun', customers: 4200, sellers: 124, percentage: 100 },
];

const CATEGORY_SALES = [
  { name: 'Electronics', value: 285000, percentage: 62 },
  { name: 'Fashion', value: 128000, percentage: 28 },
  { name: 'Home & Living', value: 45230, percentage: 10 },
];

const TOP_SELLERS = [
  { name: 'TechHub Store', revenue: 45680, orders: 234, rating: 4.8 },
  { name: 'Fashion Forward', revenue: 38950, orders: 187, rating: 4.6 },
  { name: 'Home Essentials', revenue: 32120, orders: 156, rating: 4.5 },
  { name: 'Gadget Galaxy', revenue: 28450, orders: 128, rating: 4.7 },
];

export default function AdminAnalytics() {
  const colors = useColors();
  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Platform Analytics" subtitle="System-wide performance metrics" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Platform Metrics */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ gap: spacing.md }}>
          {PLATFORM_METRICS.map((metric, index) => (
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

        {/* Revenue Trend */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Revenue Trend
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg }}>
            <View style={{ gap: spacing.md }}>
              {REVENUE_TREND.map((item, index) => (
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

        {/* User Growth */}
        <Animated.View entering={FadeInDown.delay(700).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            User Growth
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg }}>
            <View style={{ gap: spacing.lg }}>
              {USER_GROWTH.map((item, index) => (
                <Animated.View
                  key={item.month}
                  entering={FadeInDown.delay(750 + index * 50).springify()}
                  style={{ gap: 6 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, width: 40 }}>
                      {item.month}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: spacing.md }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#a855f7' }}>
                        {item.customers}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#f59e0b' }}>
                        {item.sellers}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', height: 24, gap: 4, borderRadius: spacing.sm, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        flex: 0.75,
                        backgroundColor: '#a855f7',
                      }}
                    />
                    <View
                      style={{
                        height: '100%',
                        flex: 0.25,
                        backgroundColor: '#f59e0b',
                      }}
                    />
                  </View>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Category Sales */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Sales by Category
          </Text>
          <Card variant="flat" style={{ padding: spacing.lg, gap: spacing.md }}>
            {CATEGORY_SALES.map((item, index) => (
              <Animated.View
                key={item.name}
                entering={FadeInDown.delay(850 + index * 50).springify()}
                style={{ gap: 6 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                    ${item.value.toLocaleString()}
                  </Text>
                </View>
                <View style={{ height: 20, backgroundColor: colors.surface, borderRadius: spacing.sm, overflow: 'hidden' }}>
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
          </Card>
        </Animated.View>

        {/* Top Sellers */}
        <Animated.View entering={FadeInDown.delay(900).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Top Performing Sellers
          </Text>
          {TOP_SELLERS.map((seller, index) => (
            <Animated.View
              key={seller.name}
              entering={FadeInDown.delay(950 + index * 80).springify()}
            >
              <Card variant="elevated" style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                      {seller.name}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: 4 }}>
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        {seller.orders} orders
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        ★ {seller.rating}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 4,
                      borderRadius: spacing.sm,
                      backgroundColor: colors.success + '15',
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.success }}>
                      #{index + 1}
                    </Text>
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                      Revenue
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.success }}>
                      ${seller.revenue.toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ height: 16, backgroundColor: colors.surface, borderRadius: spacing.sm, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${((seller.revenue / TOP_SELLERS[0].revenue) * 100).toFixed(0)}%`,
                        backgroundColor: colors.success,
                      }}
                    />
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
