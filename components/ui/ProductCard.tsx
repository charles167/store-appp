/**
 * Premium Product Card Component
 * Showcases products with image, price, and rating
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius, shadows } from '@/theme/spacing';
import Card from './Card';

const { width } = Dimensions.get('window');

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress?: () => void;
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  rating = 4.5,
  reviews = 128,
  isFavorite = false,
  onPress,
  onFavoritePress,
}: ProductCardProps) {
  const { colors } = useTheme();

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        marginHorizontal: spacing.sm,
      }}
    >
      <Card
        variant="elevated"
        padding={0}
        style={{
          overflow: 'hidden',
        }}
      >
        {/* Image Container */}
        <View
          style={{
            width: '100%',
            aspectRatio: 1,
            backgroundColor: colors.surface,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />

          {/* Discount Badge */}
          {discount && (
            <View
              style={{
                position: 'absolute',
                top: spacing.md,
                right: spacing.md,
                backgroundColor: colors.danger,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: radius.md,
                ...shadows.lg,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                -{discount}%
              </Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={onFavoritePress}
            activeOpacity={0.6}
            style={{
              position: 'absolute',
              bottom: spacing.md,
              right: spacing.md,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.md,
            }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.danger : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={{ padding: spacing.md }}>
          {/* Title */}
          <Text
            numberOfLines={2}
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: '600',
              marginBottom: spacing.xs,
              lineHeight: 20,
            }}
          >
            {title}
          </Text>

          {/* Rating */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.sm,
              gap: spacing.xs,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(rating) ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.warning}
                />
              ))}
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
              }}
            >
              ({reviews})
            </Text>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              ${price.toFixed(2)}
            </Text>
            {originalPrice && (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  textDecorationLine: 'line-through',
                }}
              >
                ${originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default ProductCard;
