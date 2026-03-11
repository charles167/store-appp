import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useColors, useDarkMode } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const MENU_ITEMS = [
  { id: '1', icon: 'storefront-outline', label: 'Store Settings', route: '/seller/store-settings' },
  { id: '2', icon: 'card-outline', label: 'Payment Methods', route: '/seller/payments' },
  { id: '3', icon: 'notifications-outline', label: 'Notifications', route: '/seller/notifications' },
  { id: '4', icon: 'help-circle-outline', label: 'Help & Support', route: '/seller/support' },
  { id: '5', icon: 'document-text-outline', label: 'Terms & Privacy', route: '/seller/terms' },
];

export default function SellerProfile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      {/* Profile Header */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing['2xl'],
          paddingBottom: spacing.xl,
          borderBottomLeftRadius: spacing['2xl'],
          borderBottomRightRadius: spacing['2xl'],
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: spacing.full,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.md,
          }}
        >
          <Text style={{ fontSize: 40, color: '#fff' }}>
            {user?.firstName?.charAt(0) || 'S'}
          </Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </Animated.View>

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Store Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Card variant="elevated" style={{ padding: spacing.lg }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md }}>
              Store Overview
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.lg }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                  42
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                  Products
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                  156
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                  Orders
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                  4.8
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                  Rating
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Settings
          </Text>

          {/* Dark Mode */}
          <Card variant="flat" style={{ padding: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: spacing.md,
                    backgroundColor: colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="moon-outline" size={20} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                    Dark Mode
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                    Toggle dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Account
          </Text>

          {MENU_ITEMS.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(650 + index * 60).springify()}
            >
              <Card variant="flat">
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.lg,
                  }}
                  onPress={() => {}}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: spacing.md,
                      backgroundColor: colors.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: spacing.md,
                    }}
                  >
                    <Ionicons name={item.icon as any} size={20} color={colors.text} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.text }}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.delay(900).springify()}>
          <Button
            variant="danger"
            onPress={async () => {
              await signOut();
              router.replace('/(auth)/onboarding');
            }}
            leftIcon="log-out-outline"
          >
            Sign Out
          </Button>
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
