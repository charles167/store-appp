import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const SELLERS = [
  { id: '1', name: 'TechStore Co.', email: 'info@techstore.com', status: 'approved', rating: 4.8, products: 45, joined: '2024-01-15' },
  { id: '2', name: 'Fashion Hub', email: 'hello@fashionhub.com', status: 'pending', rating: 0, products: 0, joined: '2024-01-18' },
  { id: '3', name: 'Electronics Plus', email: 'contact@eplus.com', status: 'approved', rating: 4.5, products: 78, joined: '2024-01-10' },
  { id: '4', name: 'Home Essentials', email: 'support@homeessentials.com', status: 'suspended', rating: 3.2, products: 32, joined: '2024-01-05' },
  { id: '5', name: 'Sports Gear', email: 'info@sportsgear.com', status: 'approved', rating: 4.9, products: 56, joined: '2024-01-12' },
];

const STATUS_FILTER = [
  { label: 'All', value: 'all', count: SELLERS.length },
  { label: 'Pending', value: 'pending', count: SELLERS.filter(s => s.status === 'pending').length },
  { label: 'Approved', value: 'approved', count: SELLERS.filter(s => s.status === 'approved').length },
  { label: 'Suspended', value: 'suspended', count: SELLERS.filter(s => s.status === 'suspended').length },
];

export default function AdminSellers() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', icon: 'checkmark-circle', bg: colors.success + '15', text: colors.success };
      case 'pending':
        return { label: 'Pending', icon: 'time-outline', bg: colors.warning + '15', text: colors.warning };
      case 'suspended':
        return { label: 'Suspended', icon: 'close-circle', bg: colors.danger + '15', text: colors.danger };
      default:
        return { label: 'Unknown', icon: 'help-outline', bg: colors.textSecondary + '15', text: colors.textSecondary };
    }
  };

  const filteredSellers = SELLERS.filter((seller) => {
    const matchesStatus = selectedStatus === 'all' || seller.status === selectedStatus;
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Sellers Management" subtitle={`${SELLERS.length} total sellers`} />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Input
            placeholder="Search sellers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
          />
        </Animated.View>

        {/* Status Filter */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            {STATUS_FILTER.map((filter) => (
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
                    backgroundColor: selectedStatus === filter.value ? 'rgba(255,255,255,0.3)' : colors.border,
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
        </Animated.View>

        {/* Sellers List */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={{ gap: spacing.md }}>
          {filteredSellers.map((seller, index) => {
            const statusConfig = getStatusConfig(seller.status);
            return (
              <Animated.View
                key={seller.id}
                entering={FadeInDown.delay(450 + index * 80).springify()}
              >
                <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.md }}>
                  {/* Store Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                        {seller.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                        {seller.email}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                        borderRadius: spacing.sm,
                        backgroundColor: statusConfig.bg,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Ionicons name={statusConfig.icon as any} size={12} color={statusConfig.text} />
                      <Text style={{ fontSize: 10, fontWeight: '700', color: statusConfig.text }}>
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Stats */}
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                      gap: spacing.lg,
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                        Rating
                      </Text>
                      {seller.rating > 0 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="star" size={14} color={colors.warning} />
                          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                            {seller.rating}
                          </Text>
                        </View>
                      ) : (
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary }}>
                          N/A
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                        Products
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                        {seller.products}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                        Joined
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                        {seller.joined}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: spacing.sm,
                      gap: spacing.sm,
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => {}}
                      style={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    {seller.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onPress={() => {}}
                          style={{ flex: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onPress={() => {}}
                          style={{ flex: 1 }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {seller.status === 'approved' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onPress={() => {}}
                        style={{ flex: 1 }}
                      >
                        Suspend
                      </Button>
                    )}
                  </View>
                </Card>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
    </SafeAreaScroll>
  );
}
