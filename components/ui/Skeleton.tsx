/**
 * Premium Skeleton Loader Component
 * Elegant loading state with shimmer animation
 */

import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/spacing';

interface SkeletonProps {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height,
  borderRadius = radius.md,
  style,
}: SkeletonProps) {
  const { colors, isDark } = useTheme();
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseColor = isDark ? '#2a2a2a' : '#e5e5e5';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: baseColor,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Skeleton Product Card - Loading state for product cards
 */
export function ProductCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton width="100%" height={200} borderRadius={0} />

      {/* Info Skeleton */}
      <View style={{ padding: spacing.md }}>
        <Skeleton width="80%" height={16} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="40%" height={14} style={{ marginBottom: spacing.md }} />
        <Skeleton width="60%" height={18} />
      </View>
    </View>
  );
}

export default Skeleton;
