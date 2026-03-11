import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const ORDERS = [
  {
    id: '#ORD-1234',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    items: 3,
    total: 456.97,
    status: 'pending',
    date: '2024-01-15',
    time: '10:30 AM',
    products: ['Wireless Headphones', 'Smart Watch', 'USB Cable'],
  },
  {
    id: '#ORD-1235',
    customer: 'Sarah Smith',
    customerEmail: 'sarah@example.com',
    items: 2,
    total: 189.98,
    status: 'processing',
    date: '2024-01-15',
    time: '11:45 AM',
    products: ['Laptop Bag', 'Mouse Pad'],
  },
  {
    id: '#ORD-1236',
    customer: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    items: 5,
    total: 789.95,
    status: 'shipped',
    date: '2024-01-14',
    time: '2:15 PM',
    products: ['Keyboard', 'Mouse', 'Webcam', 'Microphone', 'Headset'],
  },
  {
    id: '#ORD-1237',
    customer: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    items: 1,
    total: 399.99,
    status: 'delivered',
    date: '2024-01-13',
    time: '9:20 AM',
    products: ['Smart Watch Pro'],
  },
  {
    id: '#ORD-1238',
    customer: 'David Brown',
    customerEmail: 'david@example.com',
    items: 4,
    total: 567.96,
    status: 'cancelled',
    date: '2024-01-12',
    time: '4:50 PM',
    products: ['Tablet', 'Case', 'Screen Protector', 'Stylus'],
  },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all', count: ORDERS.length },
  { label: 'Pending', value: 'pending', count: ORDERS.filter(o => o.status === 'pending').length },
  { label: 'Processing', value: 'processing', count: ORDERS.filter(o => o.status === 'processing').length },
  { label: 'Shipped', value: 'shipped', count: ORDERS.filter(o => o.status === 'shipped').length },
  { label: 'Delivered', value: 'delivered', count: ORDERS.filter(o => o.status === 'delivered').length },
];

export default function SellerOrders() {
  const router = useRouter();
  const colors = useColors();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: 'time-outline', bg: colors.warning + '15', text: colors.warning };
      case 'processing':
        return { icon: 'hourglass-outline', bg: colors.info + '15', text: colors.info };
      case 'shipped':
        return { icon: 'airplane-outline', bg: colors.primary + '15', text: colors.primary };
      case 'delivered':
        return { icon: 'checkmark-circle-outline', bg: colors.success + '15', text: colors.success };
      case 'cancelled':
        return { icon: 'close-circle-outline', bg: colors.danger + '15', text: colors.danger };
      default:
        return { icon: 'help-outline', bg: colors.textSecondary + '15', text: colors.textSecondary };
    }
  };

  const filteredOrders = ORDERS.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Orders" subtitle={`${ORDERS.length} total orders`} />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Input
            placeholder="Search orders or customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
          />
        </Animated.View>

        {/* Status Filter Tabs */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg }}>
              {STATUS_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                    borderRadius: spacing.full,
                    backgroundColor: selectedStatus === filter.value ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedStatus === filter.value ? colors.primary : colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                  onPress={() => setSelectedStatus(filter.value)}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: selectedStatus === filter.value ? '#fff' : colors.text,
                    }}
                  >
                    {filter.label}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: spacing.full,
                      backgroundColor: selectedStatus === filter.value ? 'rgba(255,255,255,0.3)' : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: selectedStatus === filter.value ? '#fff' : colors.textSecondary,
                      }}
                    >
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Orders List */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={{ gap: spacing.md }}>
          {filteredOrders.length === 0 ? (
            <Card variant="flat" style={{ padding: spacing['2xl'], alignItems: 'center' }}>
              <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.md }}>
                No Orders Found
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                {searchQuery ? 'Try a different search term' : 'No orders in this category'}
              </Text>
            </Card>
          ) : (
            filteredOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Animated.View
                  key={order.id}
                  entering={FadeInDown.delay(450 + index * 80).springify()}
                >
                  <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.md }}>
                    {/* Order Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                          {order.id}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                          {order.date} • {order.time}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.xs,
                          borderRadius: spacing.full,
                          backgroundColor: statusConfig.bg,
                          gap: 4,
                        }}
                      >
                        <Ionicons name={statusConfig.icon as any} size={14} color={statusConfig.text} />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: statusConfig.text, textTransform: 'capitalize' }}>
                          {order.status}
                        </Text>
                      </View>
                    </View>

                    {/* Customer Info */}
                    <View style={{ gap: spacing.xs }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                        <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>
                          {order.customer}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: 24 }}>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          {order.customerEmail}
                        </Text>
                      </View>
                    </View>

                    {/* Order Details */}
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        gap: spacing.lg,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                          Items
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                          {order.items}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                          Total Amount
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>
                          ${order.total.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Products Preview */}
                    <View style={{ gap: spacing.xs }}>
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        Products:
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.text }} numberOfLines={2}>
                        {order.products.join(', ')}
                      </Text>
                    </View>

                    {/* Actions */}
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => {}}
                        style={{ flex: 1 }}
                      >
                        View Details
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onPress={() => {}}
                          style={{ flex: 1 }}
                        >
                          Process Order
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          variant="success"
                          size="sm"
                          onPress={() => {}}
                          style={{ flex: 1 }}
                        >
                          Mark Shipped
                        </Button>
                      )}
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
