import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeArea } from '@/components/ui/SafeArea';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { spacing, radius } from '@/theme/spacing';
import { useTheme } from '@/theme/ThemeProvider';
import { useCartStore } from '@/stores/cartStore';

const FALLBACK_ITEMS = [
  {
    id: 'fallback-1',
    name: 'Demo Product A',
    price: 89.99,
    quantity: 1,
    image: '',
    seller: 'Demo Seller',
  },
  {
    id: 'fallback-2',
    name: 'Demo Product B',
    price: 45.0,
    quantity: 2,
    image: '',
    seller: 'Demo Seller',
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const items = cartItems.length > 0 ? cartItems : FALLBACK_ITEMS;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      Alert.alert('Success', 'Your order has been placed!', [
        { text: 'OK', onPress: () => router.replace('/(customer)/orders') },
      ]);
    }, 1200);
  };

  return (
    <SafeArea style={{ backgroundColor: colors.background }}>
      <Header title="Checkout" showBackButton />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Shipping */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Ionicons name="location" size={18} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Shipping Address</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Change Address', 'Address change flow (demo)')}>
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.textSecondary, lineHeight: 20 }}>
              21A Admiralty Way, Lekki Phase 1, Lagos
            </Text>
          </Card>
        </Animated.View>

        {/* Payment */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Ionicons name="card" size={18} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Payment</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Change Payment', 'Payment method flow (demo)')}>
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.textSecondary }}>Visa •••• 4242 (Default)</Text>
          </Card>
        </Animated.View>

        {/* Order Items */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="flat" style={{ padding: spacing.lg, gap: spacing.md }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Items</Text>
            {items.map((item) => (
              <View
                key={item.id}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{item.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Qty {item.quantity}</Text>
                </View>
                <Text style={{ color: colors.text, fontWeight: '700' }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Order Note */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Card variant="flat" style={{ padding: spacing.lg, gap: spacing.sm }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Order Note (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add delivery note"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.md,
                color: colors.text,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          </Card>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.delay(150).duration(400)}>
          <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.sm }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Order Summary</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
              <Text style={{ color: colors.text }}>₦{subtotal.toLocaleString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.textSecondary }}>Shipping</Text>
              <Text style={{ color: colors.text }}>{shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString()}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.textSecondary }}>Tax (8%)</Text>
              <Text style={{ color: colors.text }}>₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800' }}>Total</Text>
              <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '800' }}>
                ₦{total.toLocaleString()}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Place Order */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handlePlaceOrder}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Animated.View>
      </ScrollView>
    </SafeArea>
  );
}
