import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { BalanceCard, AmountChips, StatusBadge, LoadingOverlay } from '@/components/WalletComponents';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useWalletStore, WithdrawalRequest } from '@/stores/walletStore';

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000];

export default function VendorWithdrawal() {
  const colors = useColors();
  const { wallet, withdrawalRequests, fetchWallet, addWithdrawalRequest, getWithdrawalRequests } = useWalletStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [addBankDetails, setAddBankDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchWallet('vendor-001');
  }, []);

  const vendorWithdrawals = getWithdrawalRequests('vendor-001');
  const withdrawalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const isValidAmount = withdrawalAmount > 0 && withdrawalAmount <= (wallet?.balance || 0);

  const handleSelectPreset = (amount: number) => {
    if (amount <= (wallet?.balance || 0)) {
      setSelectedAmount(amount);
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numValue);
    setSelectedAmount(null);
  };

  const handleWithdrawalRequest = async () => {
    if (!isValidAmount) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount');
      return;
    }

    if (addBankDetails && (!bankName || !accountNumber)) {
      Alert.alert('Missing Details', 'Please provide bank details for this withdrawal');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const request: WithdrawalRequest = {
        id: `wd-${Date.now()}`,
        vendorId: 'vendor-001',
        vendorName: 'Your Store',
        amount: withdrawalAmount,
        status: 'pending',
        requestDate: new Date().toISOString(),
        bankName: bankName || undefined,
        accountNumber: accountNumber || undefined,
      };

      addWithdrawalRequest(request);

      setLoading(false);
      setSuccess(true);
      setSelectedAmount(null);
      setCustomAmount('');
      setBankName('');
      setAccountNumber('');
      setAddBankDetails(false);

      // Close modal after success
      setTimeout(() => {
        setModalVisible(false);
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  if (!wallet) {
    return (
      <SafeAreaScroll style={{ backgroundColor: colors.background }}>
        <Header title="Withdrawals" subtitle="Request your earnings" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Loading wallet...</Text>
        </View>
      </SafeAreaScroll>
    );
  }

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="Withdrawals" subtitle="Request your earnings" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Wallet Balance */}
        <BalanceCard
          balance={wallet.balance}
          currency={wallet.currency}
          label="Available Balance"
        />

        {/* Withdrawal Info Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card variant="elevated" style={{ padding: spacing.lg, backgroundColor: colors.primary + '10' }}>
            <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                  Withdrawal Processing
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
                  Requests typically process within 2-3 business days. Admin approval is required.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Request Withdrawal Button */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Button
            variant="primary"
            onPress={() => setModalVisible(true)}
            icon={<Ionicons name="cash-outline" size={20} color="white" />}
          >
            Request Withdrawal
          </Button>
        </Animated.View>

        {/* Withdrawal History */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Withdrawal Requests
          </Text>

          {vendorWithdrawals.length > 0 ? (
            <View style={{ gap: spacing.md }}>
              {vendorWithdrawals.map((request) => (
                <Card key={request.id} variant="elevated" style={{ padding: spacing.lg }}>
                  <View style={{ gap: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                          {wallet.currency}
                          {request.amount.toLocaleString()}
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

                    {request.status === 'rejected' && request.rejectionReason && (
                      <View
                        style={{
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.sm,
                          borderRadius: spacing.sm,
                          backgroundColor: '#fca5a5' + '20',
                        }}
                      >
                        <Text style={{ fontSize: 12, color: '#7f1d1d' }}>
                          Reason: {request.rejectionReason}
                        </Text>
                      </View>
                    )}

                    {request.bankName && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm }}>
                        <Ionicons name="card-outline" size={16} color={colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          {request.bankName} • {request.accountNumber}
                        </Text>
                      </View>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card variant="flat" style={{ padding: spacing.lg, alignItems: 'center' }}>
              <Ionicons name="wallet-outline" size={40} color={colors.textSecondary} />
              <Text style={{ marginTop: spacing.md, fontSize: 14, color: colors.textSecondary }}>
                No withdrawal requests yet
              </Text>
            </Card>
          )}
        </Animated.View>
      </View>

      {/* Withdrawal Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !loading && setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeInUp.duration(400)} style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: spacing.xl,
                borderTopRightRadius: spacing.xl,
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.lg,
                paddingBottom: spacing.xl,
                maxHeight: '95%',
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
                    Request Withdrawal
                  </Text>
                  <TouchableOpacity onPress={() => !loading && setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {success ? (
                  // Success State
                  <Animated.View
                    entering={FadeInUp.duration(300)}
                    style={{
                      alignItems: 'center',
                      paddingVertical: spacing.xl,
                      gap: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.success + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="checkmark" size={40} color={colors.success} />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                      Request Submitted!
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
                      Your withdrawal request for {wallet.currency}
                      {withdrawalAmount.toLocaleString()} is pending admin approval
                    </Text>
                  </Animated.View>
                ) : (
                  <>
                    {/* Available Balance */}
                    <Card variant="flat" style={{ padding: spacing.md, marginBottom: spacing.lg }}>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                        Available Balance
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                        {wallet.currency}
                        {wallet.balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </Card>

                    {/* Preset Amounts */}
                    <View style={{ marginBottom: spacing.lg, gap: spacing.sm }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.md }}>
                        Quick Select
                      </Text>
                      <AmountChips
                        amounts={PRESET_AMOUNTS.filter((a) => a <= wallet.balance)}
                        selectedAmount={selectedAmount || undefined}
                        onSelect={handleSelectPreset}
                        currency={wallet.currency}
                        disabled={loading}
                      />
                    </View>

                    {/* Divider */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg, gap: spacing.md }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>OR</Text>
                      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                    </View>

                    {/* Custom Amount */}
                    <View style={{ marginBottom: spacing.lg, gap: spacing.sm }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                        Custom Amount
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: spacing.md,
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.md,
                          gap: spacing.sm,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                          {wallet.currency}
                        </Text>
                        <TextInput
                          placeholder="Enter amount"
                          placeholderTextColor={colors.textSecondary}
                          keyboardType="numeric"
                          value={customAmount}
                          onChangeText={handleCustomAmountChange}
                          editable={!loading}
                          style={{
                            flex: 1,
                            fontSize: 16,
                            fontWeight: '600',
                            color: colors.text,
                          }}
                        />
                      </View>
                      {customAmount && (
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                          Max available: {wallet.currency}
                          {wallet.balance.toLocaleString()}
                        </Text>
                      )}
                    </View>

                    {/* Bank Details Toggle */}
                    <Card variant="flat" style={{ padding: spacing.lg, marginBottom: spacing.lg, gap: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                            Add Bank Details
                          </Text>
                          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                            Save bank account for future transfers
                          </Text>
                        </View>
                        <Switch
                          value={addBankDetails}
                          onValueChange={setAddBankDetails}
                          disabled={loading}
                          trackColor={{ false: colors.border, true: colors.primary + '40' }}
                          thumbColor={addBankDetails ? colors.primary : colors.textSecondary}
                        />
                      </View>

                      {addBankDetails && (
                        <View style={{ gap: spacing.md, marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }}>
                          <View style={{ gap: spacing.sm }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                              Bank Name
                            </Text>
                            <TextInput
                              placeholder="e.g., First Bank"
                              placeholderTextColor={colors.textSecondary}
                              value={bankName}
                              onChangeText={setBankName}
                              editable={!loading}
                              style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: spacing.md,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.md,
                                color: colors.text,
                                fontSize: 14,
                              }}
                            />
                          </View>

                          <View style={{ gap: spacing.sm }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                              Account Number
                            </Text>
                            <TextInput
                              placeholder="Enter your account number"
                              placeholderTextColor={colors.textSecondary}
                              value={accountNumber}
                              onChangeText={setAccountNumber}
                              editable={!loading}
                              keyboardType="numeric"
                              style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: spacing.md,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.md,
                                color: colors.text,
                                fontSize: 14,
                              }}
                            />
                          </View>
                        </View>
                      )}
                    </Card>

                    {/* Amount Summary */}
                    {withdrawalAmount > 0 && (
                      <Card variant="elevated" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            Withdrawal Amount
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
                            {wallet.currency}
                            {withdrawalAmount.toLocaleString()}
                          </Text>
                        </View>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <View style={{ gap: spacing.md }}>
                      <Button
                        variant="primary"
                        disabled={!isValidAmount || loading}
                        onPress={handleWithdrawalRequest}
                        loading={loading}
                      >
                        {loading ? 'Submitting...' : 'Request Withdrawal'}
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={loading}
                        onPress={() => setModalVisible(false)}
                      >
                        Cancel
                      </Button>
                    </View>
                  </>
                )}

                <View style={{ height: spacing.lg }} />
              </ScrollView>
            </View>
          </Animated.View>
        </View>

        <LoadingOverlay visible={loading && !success} message="Submitting request..." />
      </Modal>
    </SafeAreaScroll>
  );
}
