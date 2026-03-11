/**
 * Premium Profile Screen - 2025 Design
 * Features:
 * - User profile header with avatar
 * - Account statistics
 * - Settings and preferences
 * - Account management options
 * - Theme toggle
 * - Sign out functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { colors, mode, setMode } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/onboarding');
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      onPress: () => router.push('/edit-profile'),
    },
    {
      icon: 'location-outline',
      label: 'Addresses',
      onPress: () => router.push('/addresses'),
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      onPress: () => router.push('/payment-methods'),
    },
    {
      icon: 'heart-outline',
      label: 'Wishlist',
      onPress: () => router.push('/wishlist'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Support',
      onPress: () => router.push('/support'),
    },
    {
      icon: 'document-text-outline',
      label: 'Terms & Conditions',
      onPress: () => {},
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacy Policy',
      onPress: () => {},
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaScroll showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{ marginBottom: spacing.xl }}
        >
          <Card
            variant="elevated"
            padding={spacing.lg}
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.lg,
              backgroundColor: colors.primary,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
              {/* Avatar */}
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: radius.xl,
                  backgroundColor: colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...shadows.lg,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: colors.primary,
                  }}
                >
                  {user?.firstName?.[0] || '?'}
                </Text>
              </View>

              {/* User Info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 20,
                    fontWeight: '700',
                    marginBottom: spacing.xs,
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 13,
                    opacity: 0.9,
                  }}
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Statistics */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={{
            marginBottom: spacing.xl,
            marginHorizontal: spacing.lg,
            flexDirection: 'row',
            gap: spacing.md,
          }}
        >
          {[
            { icon: 'bag-outline', label: 'Orders', value: '12', color: colors.primary },
            { icon: 'heart-outline', label: 'Saved', value: '8', color: colors.danger },
            { icon: 'star-outline', label: 'Reviews', value: '5', color: colors.warning },
          ].map((stat, index) => (
            <View
              key={index}
              style={{
                flex: 1,
              }}
            >
              <Card
                variant="elevated"
                padding={spacing.md}
                style={{
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.lg,
                    backgroundColor: stat.color + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing.sm,
                  }}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={20}
                    color={stat.color}
                  />
                </View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '700',
                    marginBottom: spacing.xs,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '500',
                  }}
                >
                  {stat.label}
                </Text>
              </Card>
            </View>
          ))}
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '700',
              marginHorizontal: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            Settings
          </Text>

          {/* Dark Mode */}
          <Card
            variant="elevated"
            padding={spacing.md}
            style={{
              marginHorizontal: spacing.lg,
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  backgroundColor: colors.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="moon-outline" size={20} color={colors.textSecondary} />
              </View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={(value) => setMode(value ? 'dark' : 'light')}
              trackColor={{
                false: colors.border,
                true: colors.primary + '40',
              }}
              thumbColor={mode === 'dark' ? colors.primary : colors.surface}
            />
          </Card>

          {/* Notifications */}
          <Card
            variant="elevated"
            padding={spacing.md}
            style={{
              marginHorizontal: spacing.lg,
              marginBottom: spacing.xl,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  backgroundColor: colors.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: colors.border,
                true: colors.primary + '40',
              }}
              thumbColor={notifications ? colors.primary : colors.surface}
            />
          </Card>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '700',
              marginHorizontal: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            Account
          </Text>

          {menuItems.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(400 + index * 50).duration(400)}
              style={{
                marginHorizontal: spacing.lg,
                marginBottom: spacing.md,
              }}
            >
              <TouchableOpacity
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Card
                  variant="elevated"
                  padding={spacing.md}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radius.lg,
                        backgroundColor: colors.surface,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
                    </View>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                      {item.label}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Sign Out Button */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.xl,
            marginBottom: spacing.xl,
          }}
        >
          <Button
            title="Sign Out"
            variant="danger"
            size="lg"
            fullWidth
            onPress={handleSignOut}
            icon={<Ionicons name="log-out" size={20} color={colors.background} />}
          />
        </Animated.View>
      </SafeAreaScroll>
    </View>
  );
}