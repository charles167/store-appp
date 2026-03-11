import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { useColors, useDarkMode } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const SYSTEM_SETTINGS = [
  { id: '1', icon: 'lock-closed-outline', label: 'Maintenance Mode', description: 'Temporarily disable platform' },
  { id: '2', icon: 'shield-checkmark-outline', label: 'Security Settings', description: 'Manage security policies' },
  { id: '3', icon: 'mail-outline', label: 'Email Settings', description: 'Configure notifications' },
  { id: '4', icon: 'document-text-outline', label: 'Commission Settings', description: 'Set seller commission rates' },
  { id: '5', icon: 'cash-outline', label: 'Payment Gateway', description: 'Configure payment methods' },
];

const ADMIN_MENU = [
  { id: '1', icon: 'people-outline', label: 'Users Management', route: '/admin/users' },
  { id: '2', icon: 'storefront-outline', label: 'Sellers Management', route: '/admin/sellers' },
  { id: '3', icon: 'bar-chart-outline', label: 'Analytics', route: '/admin/analytics' },
  { id: '4', icon: 'document-outline', label: 'Reports', route: '/admin/reports' },
  { id: '5', icon: 'bell-outline', label: 'Notifications Log', route: '/admin/notifications' },
];

export default function AdminSettings() {
  const { signOut } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Settings" subtitle="Platform configuration" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Theme Settings */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
            Display
          </Text>
          <Card variant="flat">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing.lg,
                gap: spacing.md,
              }}
            >
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
                  Enable dark theme
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Card>
        </Animated.View>

        {/* System Settings */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
            System
          </Text>

          {/* Maintenance Mode */}
          <Card variant="flat">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing.lg,
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: spacing.md,
                  backgroundColor: colors.danger + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="construct-outline" size={20} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  Maintenance Mode
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                  Temporarily disable platform
                </Text>
              </View>
              <Switch
                value={maintenanceMode}
                onValueChange={setMaintenanceMode}
                trackColor={{ false: colors.border, true: colors.danger }}
              />
            </View>
          </Card>

          {/* Other Settings */}
          {SYSTEM_SETTINGS.map((setting, index) => (
            <Animated.View
              key={setting.id}
              entering={FadeInDown.delay(250 + index * 80).springify()}
            >
              <Card variant="flat">
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.lg,
                    gap: spacing.md,
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
                    }}
                  >
                    <Ionicons name={setting.icon as any} size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                      {setting.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                      {setting.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Admin Tools */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
            Admin Tools
          </Text>

          {ADMIN_MENU.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(750 + index * 80).springify()}
            >
              <Card variant="flat">
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.lg,
                    gap: spacing.md,
                  }}
                  onPress={() => router.push(item.route as any)}
                >
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

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(1200).duration(600)}>
          <Card variant="flat" style={{ padding: spacing.lg, backgroundColor: colors.danger + '05' }}>
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Ionicons name="warning-outline" size={20} color={colors.danger} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.danger }}>
                  Danger Zone
                </Text>
              </View>
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
            </View>
          </Card>
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
