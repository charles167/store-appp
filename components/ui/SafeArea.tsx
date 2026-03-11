/**
 * Premium Safe Area Wrapper
 * Handles safe areas consistently across all screens
 */

import React from 'react';
import { View, ViewStyle, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

interface SafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export function SafeArea({
  children,
  style,
  padding = spacing.lg,
  paddingHorizontal = padding,
  paddingVertical = padding,
}: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top + paddingVertical,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + paddingHorizontal,
          paddingRight: insets.right + paddingHorizontal,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Safe Area Scroll View - For scrollable content
 */
interface SafeAreaScrollProps extends ScrollViewProps {
  children: React.ReactNode;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export function SafeAreaScroll({
  children,
  padding = spacing.lg,
  paddingHorizontal = padding,
  paddingVertical = padding,
  contentContainerStyle,
  ...scrollProps
}: SafeAreaScrollProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <ScrollView
      {...scrollProps}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingTop: insets.top + paddingVertical,
          paddingBottom: insets.bottom + paddingVertical,
          paddingLeft: insets.left + paddingHorizontal,
          paddingRight: insets.right + paddingHorizontal,
        },
        contentContainerStyle,
      ]}
      style={{
        backgroundColor: colors.background,
      }}
    >
      {children}
    </ScrollView>
  );
}

export default SafeArea;
