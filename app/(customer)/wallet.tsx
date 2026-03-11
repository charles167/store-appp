import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaScroll } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { BalanceCard, AmountChips, TransactionItem, LoadingOverlay } from '@/components/WalletComponents';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useWalletStore } from '@/stores/walletStore';

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 500000;

export default function CustomerWallet() {
  const colors = useColors();
  const { wallet, transactions, fetchWallet, addTransaction, updateBalance } = useWalletStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchWallet('customer-001');
  }, []);

  const topupAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const isValidAmount = topupAmount >= MIN_AMOUNT && topupAmount <= MAX_AMOUNT;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numValue);
    setSelectedAmount(null);
  };

  const handleTopUp = async () => {
    if (!isValidAmount) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateBalance(topupAmount);
      addTransaction({
        id: `txn-${Date.now()}`,
        type: 'credit',
        amount: topupAmount,
        description: 'Wallet Top-Up',
        timestamp: new Date().toISOString(),
        status: 'completed',
      });

      setLoading(false);
      setSuccess(true);
      setSelectedAmount(null);
      setCustomAmount('');

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
        <Header title="My Wallet" subtitle="Manage your funds" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Loading wallet...</Text>
        </View>
      </SafeAreaScroll>
    );
  }

  return (
    <SafeAreaScroll style={{ backgroundColor: colors.background }}>
      <Header title="My Wallet" subtitle="Manage your funds" />

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Wallet Balance */}
        <BalanceCard
          balance={wallet.balance}
          currency={wallet.currency}
          label="Available Balance"
        />

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ gap: spacing.md }}>
          <Button
            variant="primary"
            onPress={() => setModalVisible(true)}
            icon={<Ionicons name="add-circle-outline" size={20} color="white" />}
          >
            Add Money
          </Button>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
              Recent Transactions
            </Text>
            {transactions.length > 0 && (
              <TouchableOpacity>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {transactions.length > 0 ? (
            <Card variant="flat">
              {transactions.slice(0, 5).map((txn) => (
                <TransactionItem
                  key={txn.id}
                  type={txn.type}
                  description={txn.description}
                  amount={txn.amount}
                  timestamp={txn.timestamp}
                  currency={wallet.currency}
                />
              ))}
            </Card>
          ) : (
            <Card variant="flat" style={{ padding: spacing.lg, alignItems: 'center' }}>
              <Ionicons name="wallet-outline" size={40} color={colors.textSecondary} />
              <Text style={{ marginTop: spacing.md, fontSize: 14, color: colors.textSecondary }}>
                No transactions yet
              </Text>
            </Card>
          )}
        </Animated.View>
      </View>

      {/* Add Money Modal */}
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
                maxHeight: '90%',
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
                    Add Money
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
                      Top-Up Successful!
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
                      {wallet.currency}
                      {topupAmount.toLocaleString()} has been added to your wallet
                    </Text>
                  </Animated.View>
                ) : (
                  <>
                    {/* Preset Amounts */}
                    <View style={{ marginBottom: spacing.lg, gap: spacing.sm }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.md }}>
                        Quick Select
                      </Text>
                      <AmountChips
                        amounts={PRESET_AMOUNTS}
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
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        Min: {wallet.currency}
                        {MIN_AMOUNT.toLocaleString()} • Max: {wallet.currency}
                        {MAX_AMOUNT.toLocaleString()}
                      </Text>
                    </View>

                    {/* Amount Summary */}
                    {topupAmount > 0 && (
                      <Card variant="elevated" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            You will receive
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
                            {wallet.currency}
                            {topupAmount.toLocaleString()}
                          </Text>
                        </View>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <View style={{ gap: spacing.md }}>
                      <Button
                        variant="primary"
                        disabled={!isValidAmount || loading}
                        onPress={handleTopUp}
                        loading={loading}
                      >
                        {loading ? 'Processing...' : 'Confirm Top-Up'}
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

        <LoadingOverlay visible={loading && !success} message="Processing payment..." />
      </Modal>
    </SafeAreaScroll>
  );
}
