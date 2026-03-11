import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👤', status: 'active', joined: '2024-01-15', orders: 12 },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', avatar: '👩', status: 'active', joined: '2024-01-14', orders: 8 },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨', status: 'inactive', joined: '2024-01-10', orders: 5 },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', avatar: '👩‍🔬', status: 'active', joined: '2024-01-12', orders: 15 },
  { id: '5', name: 'David Brown', email: 'david@example.com', avatar: '👨‍💼', status: 'suspended', joined: '2024-01-08', orders: 3 },
];

const STATUS_FILTER = [
  { label: 'All', value: 'all', count: USERS.length },
  { label: 'Active', value: 'active', count: USERS.filter(u => u.status === 'active').length },
  { label: 'Inactive', value: 'inactive', count: USERS.filter(u => u.status === 'inactive').length },
  { label: 'Suspended', value: 'suspended', count: USERS.filter(u => u.status === 'suspended').length },
];

export default function AdminUsers() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: colors.success + '15', text: colors.success };
      case 'inactive':
        return { label: 'Inactive', bg: colors.textSecondary + '15', text: colors.textSecondary };
      case 'suspended':
        return { label: 'Suspended', bg: colors.danger + '15', text: colors.danger };
      default:
        return { label: 'Unknown', bg: colors.textSecondary + '15', text: colors.textSecondary };
    }
  };

  const filteredUsers = USERS.filter((user) => {
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Users Management" subtitle={`${USERS.length} total users`} />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Input
            placeholder="Search users..."
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

        {/* Users List */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={{ gap: spacing.md }}>
          {filteredUsers.map((user, index) => {
            const statusConfig = getStatusConfig(user.status);
            return (
              <Animated.View
                key={user.id}
                entering={FadeInDown.delay(450 + index * 80).springify()}
              >
                <Card variant="elevated" style={{ padding: spacing.lg }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md }}>
                    {/* Avatar */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: spacing.full,
                        backgroundColor: colors.primary + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
                    </View>

                    {/* User Info */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                          {user.name}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: 4,
                            borderRadius: spacing.sm,
                            backgroundColor: statusConfig.bg,
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: '700', color: statusConfig.text, textTransform: 'capitalize' }}>
                            {statusConfig.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                        {user.email}
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
                        Joined
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                        {user.joined}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                        Orders
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                        {user.orders}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: spacing.md,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                      gap: spacing.sm,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: spacing.sm,
                        borderRadius: spacing.md,
                        backgroundColor: colors.surface,
                        alignItems: 'center',
                      }}
                      onPress={() => {}}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                        View Details
                      </Text>
                    </TouchableOpacity>
                    {user.status === 'active' && (
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          paddingVertical: spacing.sm,
                          borderRadius: spacing.md,
                          backgroundColor: colors.danger + '15',
                          alignItems: 'center',
                        }}
                        onPress={() => {}}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.danger }}>
                          Suspend
                        </Text>
                      </TouchableOpacity>
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
