/**
 * Premium Header Component
 * Consistent header for all screens
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  style,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left - Back Button */}
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.6}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.lg,
              backgroundColor: colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.sm,
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        {/* Center - Title */}
        <View style={{ flex: 1, marginHorizontal: spacing.md }}>
          {title && (
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginTop: spacing.xs,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right - Action Button */}
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            activeOpacity={0.6}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.lg,
              backgroundColor: colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.sm,
            }}
          >
            <Ionicons name={rightAction.icon} size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Header;
