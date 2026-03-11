/**
 * Premium Button Component
 * Multiple variants with smooth interactions
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  ActivityIndicator, 
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  style,
}: ButtonProps) {
  const { colors, isDark } = useTheme();

  // Variant styles
  const getVariantStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.primary,
          text: colors.background,
        };
      case 'secondary':
        return {
          bg: isDark ? '#2a2a2a' : '#f0f0f0',
          text: colors.text,
        };
      case 'outline':
        return {
          bg: colors.background,
          text: colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.text,
        };
      case 'danger':
        return {
          bg: colors.danger,
          text: colors.background,
        };
      case 'success':
        return {
          bg: colors.success,
          text: colors.background,
        };
      default:
        return { bg: colors.primary, text: colors.background };
    }
  };

  // Size styles
  const getSizeStyles = (): { paddingVertical: number; paddingHorizontal: number; fontSize: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: 13 };
      case 'md':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: 15 };
      case 'lg':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: 16 };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: 15 };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          backgroundColor: variantStyle.bg,
          borderRadius: radius.lg,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor,
          opacity: disabled ? 0.6 : 1,
          ...shadows.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          {(title || children) && (
            <Text
              style={{
                color: variantStyle.text,
                fontSize: sizeStyle.fontSize,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {title || children}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
