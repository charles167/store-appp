/**
 * Premium Card Component
 * Elevated surface with subtle shadow and rounded corners
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outlined';
  padding?: number;
  margin?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({
  children,
  variant = 'elevated',
  padding = spacing.lg,
  margin = 0,
  style,
  onPress,
}: CardProps) {
  const { colors } = useTheme();

  const shadowStyle = variant === 'elevated' ? shadows.md : variant === 'outlined' ? shadows.sm : shadows.none;

  const containerStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding,
    marginHorizontal: margin,
    marginVertical: margin,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: variant === 'outlined' ? colors.border : 'transparent',
    ...shadowStyle,
  };

  const Component = onPress ? View : View;

  return (
    <Component style={[containerStyle, style]}>
      {children}
    </Component>
  );
}

export default Card;
