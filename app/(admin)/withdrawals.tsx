import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { StatusBadge, LoadingOverlay } from '@/components/WalletComponents';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useWalletStore, WithdrawalRequest } from '@/stores/walletStore';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminWithdrawalManagement() {
  const colors = useColors();
  const { withdrawalRequests, updateWithdrawalStatus } = useWalletStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return withdrawalRequests.filter((req) => {
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      const matchesSearch = req.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [withdrawalRequests, filterStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: withdrawalRequests.length,
      pending: withdrawalRequests.filter((r) => r.status === 'pending').length,
      approved: withdrawalRequests.filter((r) => r.status === 'approved').length,
      rejected: withdrawalRequests.filter((r) => r.status === 'rejected').length,
      totalPending: withdrawalRequests
        .filter((r) => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0),
    }),
    [withdrawalRequests]
  );

  const handleRequestAction = (request: WithdrawalRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    if (action === 'approve') {
      handleApproveRequest(request);
    } else {
      setModalVisible(true);
    }
  };

  const handleApproveRequest = async (request: WithdrawalRequest) => {
    setLoading(true);
    setTimeout(() => {
      updateWithdrawalStatus(request.id, 'approved');
      setLoading(false);
      Alert.alert('Success', `Withdrawal request of ₦${request.amount.toLocaleString()} approved`);
    }, 1000);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      Alert.alert('Required', 'Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updateWithdrawalStatus(selectedRequest.id, 'rejected', rejectionReason);
      setLoading(false);
      setModalVisible(false);
      setRejectionReason('');
      setSelectedRequest(null);
      setActionType(null);
      Alert.alert('Success', 'Withdrawal request rejected');
    }, 1000);
  };

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Withdrawal Requests" subtitle="Manage vendor payouts" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Stats Overview */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Card variant="elevated" style={{ flex: 1, padding: spacing.md }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                Pending
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.warning }}>
                {stats.pending}
              </Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>
                ₦{stats.totalPending.toLocaleString()}
              </Text>
            </Card>

            <Card variant="elevated" style={{ flex: 1, padding: spacing.md }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                Approved
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.success }}>
                {stats.approved}
              </Text>
            </Card>

            <Card variant="elevated" style={{ flex: 1, padding: spacing.md }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                Rejected
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#ef4444' }}>
                {stats.rejected}
              </Text>
            </Card>
          </View>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: spacing.md,
              paddingHorizontal: spacing.md,
              backgroundColor: colors.surface,
            }}
          >
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              placeholder="Search vendor name..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                color: colors.text,
                fontSize: 14,
              }}
            />
          </View>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ flexDirection: 'row', gap: spacing.sm }}>
          {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((status, index) => (
            <Animated.View
              key={status}
              entering={FadeInDown.delay(250 + index * 50).springify()}
            >
              <TouchableOpacity
                onPress={() => setFilterStatus(status)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: spacing.md,
                  backgroundColor: filterStatus === status ? colors.primary : colors.surface,
                  borderWidth: filterStatus === status ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: filterStatus === status ? 'white' : colors.text,
                    textTransform: 'capitalize',
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Requests List */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ gap: spacing.md }}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <Animated.View key={request.id} entering={FadeInDown.delay(350 + index * 80).springify()}>
                <Card variant="elevated">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedRequest(request);
                      setModalVisible(true);
                    }}
                    style={{ padding: spacing.lg }}
                  >
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                          {request.vendorName}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          {new Date(request.requestDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <StatusBadge status={request.status} size="md" />
                    </View>

                    {/* Amount */}
                    <View style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.md }}>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                        Withdrawal Amount
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
                        ₦{request.amount.toLocaleString()}
                      </Text>
                    </View>

                    {/* Bank Details */}
                    {request.bankName && (
                      <View style={{ marginBottom: spacing.md }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm }}>
                          Bank Details
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: spacing.sm,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            backgroundColor: colors.surface,
                            borderRadius: spacing.sm,
                          }}
                        >
                          <Ionicons name="card-outline" size={16} color={colors.primary} />
                          <View>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                              {request.bankName}
                            </Text>
                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                              {request.accountNumber}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Rejection Reason */}
                    {request.status === 'rejected' && request.rejectionReason && (
                      <View
                        style={{
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.sm,
                          borderRadius: spacing.sm,
                          backgroundColor: '#fca5a5' + '20',
                          marginBottom: spacing.md,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#7f1d1d', marginBottom: 2 }}>
                          Rejection Reason
                        </Text>
                        <Text style={{ fontSize: 12, color: '#7f1d1d' }}>
                          {request.rejectionReason}
                        </Text>
                      </View>
                    )}

                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                        <TouchableOpacity
                          onPress={() => handleRequestAction(request, 'approve')}
                          style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            borderRadius: spacing.md,
                            backgroundColor: colors.success,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: spacing.sm,
                          }}
                        >
                          <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                          <Text style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>
                            Approve
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleRequestAction(request, 'reject')}
                          style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            borderRadius: spacing.md,
                            backgroundColor: '#ef4444',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: spacing.sm,
                          }}
                        >
                          <Ionicons name="close-circle-outline" size={18} color="white" />
                          <Text style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>
                            Reject
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                </Card>
              </Animated.View>
            ))
          ) : (
            <Card variant="flat" style={{ padding: spacing.lg, alignItems: 'center' }}>
              <Ionicons name="wallet-outline" size={40} color={colors.textSecondary} />
              <Text style={{ marginTop: spacing.md, fontSize: 14, color: colors.textSecondary }}>
                No withdrawal requests
              </Text>
            </Card>
          )}
        </Animated.View>
      </View>

      {/* Request Details Modal */}
      <Modal
        visible={modalVisible && actionType === 'reject'}
        transparent
        animationType="fade"
        onRequestClose={() => !loading && setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
          <Animated.View entering={FadeInUp.duration(300)}>
            <Card variant="elevated" style={{ padding: spacing.lg, gap: spacing.lg }}>
              {/* Header */}
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm }}>
                  Reject Request
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                  Provide a reason for rejecting this withdrawal request
                </Text>
              </View>

              {/* Reason Input */}
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                  Rejection Reason
                </Text>
                <TextInput
                  placeholder="e.g., Account verification pending"
                  placeholderTextColor={colors.textSecondary}
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  editable={!loading}
                  multiline
                  numberOfLines={4}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: spacing.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                    color: colors.text,
                    fontSize: 14,
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <Button
                  variant="secondary"
                  style={{ flex: 1 }}
                  disabled={loading}
                  onPress={() => setModalVisible(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 1 }}
                  disabled={!rejectionReason.trim() || loading}
                  loading={loading}
                  onPress={handleRejectRequest}
                >
                  Reject
                </Button>
              </View>
            </Card>
          </Animated.View>
        </View>

        <LoadingOverlay visible={loading} message="Processing..." />
      </Modal>
    </SafeAreaScroll>
  );
}
