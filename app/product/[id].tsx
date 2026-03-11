import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { spacing, radius, shadows } from '@/theme/spacing';
import { useTheme } from '@/theme/ThemeProvider';
import { useCartStore } from '@/stores/cartStore';

const PRODUCTS = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    rating: 4.8,
    reviews: 324,
    seller: 'SoundWave Official',
    description:
      'Experience studio-quality sound with adaptive noise cancellation, 40-hour battery life, and ultra-soft memory foam cushions.',
    highlights: ['40h battery', 'Adaptive ANC', 'Bluetooth 5.3', 'Fast charge'],
    specs: {
      color: 'Midnight Black',
      weight: '260g',
      warranty: '12 months',
      connectivity: 'Bluetooth 5.3 + AUX',
    },
  },
  {
    id: '2',
    title: 'Smartwatch Pro',
    price: 249.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    rating: 4.9,
    reviews: 456,
    seller: 'FitLife Store',
    description:
      'Track health metrics with AMOLED display, ECG, SpO2, GPS, and 5ATM water resistance. Up to 10 days battery life.',
    highlights: ['AMOLED', 'ECG + SpO2', 'GPS', '5ATM'],
    specs: {
      color: 'Graphite',
      weight: '45g',
      warranty: '18 months',
      connectivity: 'Bluetooth 5.2 + NFC',
    },
  },
  {
    id: '3',
    title: 'Premium Backpack',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    rating: 4.6,
    reviews: 178,
    seller: 'UrbanCarry',
    description:
      'Water-resistant laptop backpack with 20L capacity, quick-access pockets, and ergonomic support for daily commutes.',
    highlights: ['20L capacity', 'Water-resistant', 'Laptop sleeve', 'Ergo straps'],
    specs: {
      color: 'Charcoal Gray',
      weight: '920g',
      warranty: '24 months',
      connectivity: 'USB passthrough',
    },
  },
  {
    id: '4',
    title: 'Camera Lens Pro',
    price: 599.99,
    originalPrice: 749.99,
    image: 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=800&h=800&fit=crop',
    rating: 4.9,
    reviews: 234,
    seller: 'PhotoHub',
    description:
      'Fast prime lens with F1.4 aperture, silent autofocus, weather sealing, and edge-to-edge sharpness for professionals.',
    highlights: ['F1.4 aperture', 'Weather sealed', 'Silent AF', 'Edge-to-edge sharpness'],
    specs: {
      color: 'Matte Black',
      weight: '680g',
      warranty: '24 months',
      connectivity: 'AF/MF switch',
    },
  },
];

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }
    Alert.alert('Cart', message);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const existing = items.find((i) => i.id === product.id);

    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      seller: product.seller,
    });

    showToast(existing ? 'Increased quantity in cart' : 'Added to cart');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product) {
    return (
      <SafeAreaScroll style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.md }}>
            Product not found
          </Text>
          <Button variant="primary" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </SafeAreaScroll>
    );
  }

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Hero */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', height: 340, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: 'absolute', top: spacing.lg, left: spacing.lg, backgroundColor: 'rgba(0,0,0,0.5)', padding: spacing.sm, borderRadius: radius.md }}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md, marginTop: spacing.lg }}>
          {/* Title and Price */}
          <Animated.View entering={FadeInDown.duration(400)} style={{ gap: spacing.sm }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>
              {product.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '800' }}>
                ₦{product.price.toLocaleString()}
              </Text>
              <Text style={{ color: colors.textSecondary, textDecorationLine: 'line-through', fontSize: 13 }}>
                ₦{product.originalPrice.toLocaleString()}
              </Text>
              <View style={{ paddingHorizontal: spacing.sm, paddingVertical: 4, backgroundColor: colors.success + '20', borderRadius: radius.sm }}>
                <Text style={{ color: colors.success, fontSize: 11, fontWeight: '700' }}>
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                {product.rating} ({product.reviews} reviews)
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>• Sold by {product.seller}</Text>
            </View>
          </Animated.View>

          {/* Highlights */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
              {product.highlights.map((item) => (
                <View
                  key={item}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    backgroundColor: colors.surface,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>{item}</Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <Card variant="flat" style={{ padding: spacing.lg }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: spacing.sm }}>
                Description
              </Text>
              <Text style={{ color: colors.textSecondary, lineHeight: 22, fontSize: 14 }}>
                {product.description}
              </Text>
            </Card>
          </Animated.View>

          {/* Specs */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Card variant="flat" style={{ padding: spacing.lg, gap: spacing.sm }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }}>Specifications</Text>
              {Object.entries(product.specs).map(([key, value]) => (
                <View
                  key={key}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs }}
                >
                  <Text style={{ color: colors.textSecondary, textTransform: 'capitalize' }}>{key}</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{value}</Text>
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInUp.delay(150).duration(400)} style={{ gap: spacing.sm, marginVertical: spacing.md }}>
            <Button variant="primary" onPress={handleAddToCart}>
              {added ? 'Added!' : 'Add to Cart'}
            </Button>
            <Button variant="secondary" onPress={() => Alert.alert('Saved', 'Added to wishlist (demo)')}>
              Save to Wishlist
            </Button>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaScroll>
  );
}
