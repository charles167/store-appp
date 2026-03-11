import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  seller?: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  index?: number;
}

export function ProductCard({ product, onPress, onAddToCart, index = 0 }: ProductCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-3xl overflow-hidden shadow-soft"
        style={{ width: 200 }}
      >
        <View className="relative">
          <Image
            source={{ uri: product.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="absolute top-3 right-3 bg-white/90 backdrop-blur-xl rounded-full p-2">
            <Ionicons name="heart-outline" size={20} color="#ef4444" />
          </View>
        </View>
        
        <View className="p-4">
          <Text className="text-dark-900 font-bold text-base mb-1" numberOfLines={2}>
            {product.name}
          </Text>
          
          {product.seller && (
            <Text className="text-dark-500 text-xs mb-2">
              by {product.seller}
            </Text>
          )}
          
          {product.rating && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="text-dark-700 text-sm ml-1">
                {product.rating}
              </Text>
            </View>
          )}
          
          <View className="flex-row items-center justify-between">
            <Text className="text-primary-600 font-bold text-lg">
              ${product.price}
            </Text>
            
            {onAddToCart && (
              <TouchableOpacity
                onPress={onAddToCart}
                className="bg-primary-500 rounded-xl p-2"
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
