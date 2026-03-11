import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8 }: SkeletonProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      ),
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? width : 100,
          height,
          borderRadius,
          backgroundColor: '#e5e5e5',
        },
        animatedStyle,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View className="bg-white rounded-3xl overflow-hidden shadow-soft" style={{ width: 200 }}>
      <Skeleton width={200} height={192} borderRadius={0} />
      <View className="p-4">
        <Skeleton width="80%" height={16} />
        <View className="mt-2">
          <Skeleton width="60%" height={12} />
        </View>
        <View className="mt-3 flex-row items-center justify-between">
          <Skeleton width={60} height={20} />
          <Skeleton width={40} height={40} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

export function ListItemSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 flex-row shadow-soft">
      <Skeleton width={80} height={80} borderRadius={16} />
      <View className="flex-1 ml-4">
        <Skeleton width="70%" height={16} />
        <View className="mt-2">
          <Skeleton width="50%" height={12} />
        </View>
        <View className="mt-3">
          <Skeleton width="40%" height={20} />
        </View>
      </View>
    </View>
  );
}
