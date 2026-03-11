import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const PLATFORM_STATS = [
  {
    id: '1',
    label: 'Total Revenue',
    value: '$245,820',
    change: '+23.5%',
    icon: 'cash-outline',
    gradient: ['#22c55e', '#16a34a'],
  },
  {
    id: '2',
    label: 'Total Orders',
    value: '12,456',
    change: '+18.2%',
    icon: 'receipt-outline',
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: '3',
    label: 'Active Users',
    value: '8,234',
    change: '+12.7%',
    icon: 'people-outline',
    gradient: ['#a855f7', '#9333ea'],
  },
  {
    id: '4',
    label: 'Active Sellers',
    value: '456',
    change: '+8.5%',
    icon: 'storefront-outline',
    gradient: ['#f59e0b', '#d97706'],
  },
];

const ADMIN_ACTIONS = [
  { id: '1', title: 'Users', icon: 'people-outline', route: '/admin/users', color: '#3b82f6' },
  { id: '2', title: 'Sellers', icon: 'storefront-outline', route: '/admin/sellers', color: '#a855f7' },
  { id: '3', title: 'Analytics', icon: 'bar-chart-outline', route: '/admin/analytics', color: '#f59e0b' },
  { id: '4', title: 'Settings', icon: 'settings-outline', route: '/admin/settings', color: '#ef4444' },
];

const RECENT_ACTIVITY = [
  { id: '1', type: 'user', action: 'New user registration', user: 'Sarah Anderson', time: '5 min ago' },
  { id: '2', type: 'seller', action: 'New seller application', user: 'Tech Store Co.', time: '23 min ago' },
  { id: '3', type: 'order', action: 'High-value order placed', user: '$2,450 transaction', time: '1 hour ago' },
  { id: '4', type: 'user', action: 'Payment verified', user: 'John Davis', time: '2 hours ago' },
];

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const colors = useColors();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return 'person-outline';
      case 'seller': return 'storefront-outline';
      case 'order': return 'receipt-outline';
      default: return 'information-outline';
    }
  };

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      {/* Header Section */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{
          backgroundColor: colors.danger,
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
              {user?.firstName || 'Admin'} 👋
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
            onPress={() => router.push('/admin/settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Platform Health Card */}
        <Card variant="flat" style={{ backgroundColor: '#fff', padding: spacing.lg }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>
            Platform Health
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm }}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
              99.9% Uptime
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            System operating normally
          </Text>
        </Card>
      </Animated.View>

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Platform Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ gap: spacing.md }}>
          {PLATFORM_STATS.map((stat, index) => (
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
            Management
          </Text>
          <View style={{ gap: spacing.sm }}>
            {ADMIN_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.delay(650 + index * 80).springify()}
              >
                <Card variant="flat">
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing.lg,
                      gap: spacing.md,
                    }}
                    onPress={() => router.push(action.route as any)}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: spacing.md,
                        backgroundColor: action.color + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name={action.icon as any} size={24} color={action.color} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: colors.text }}>
                      {action.title}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(900).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Recent Activity
          </Text>
          {RECENT_ACTIVITY.map((activity, index) => (
            <Animated.View
              key={activity.id}
              entering={FadeInDown.delay(950 + index * 80).springify()}
            >
              <Card variant="flat">
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: spacing.full,
                      backgroundColor: colors.primary + '15',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={getActivityIcon(activity.type) as any} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                      {activity.action}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                      {activity.user} • {activity.time}
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
