import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColors } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

interface AmountChipsProps {
  amounts: number[];
  selectedAmount?: number;
  onSelect: (amount: number) => void;
  disabled?: boolean;
  currency?: string;
}

export const AmountChips: React.FC<AmountChipsProps> = ({
  amounts,
  selectedAmount,
  onSelect,
  disabled = false,
  currency = '₦',
}) => {
  const colors = useColors();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' }}>
      {amounts.map((amount, index) => {
        const isSelected = selectedAmount === amount;
        return (
          <Animated.View
            key={amount}
            entering={FadeInDown.delay(100 + index * 50).springify()}
            style={{ flex: 0.48 }}
          >
            <TouchableOpacity
              onPress={() => !disabled && onSelect(amount)}
              activeOpacity={0.7}
              disabled={disabled}
              style={{
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                borderRadius: spacing.md,
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderWidth: isSelected ? 0 : 1,
                borderColor: colors.border,
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: isSelected ? 'white' : colors.text,
                }}
              >
                {currency}
                {amount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

interface BalanceCardProps {
  balance: number;
  currency?: string;
  label?: string;
  disabled?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency = '₦',
  label = 'Available Balance',
  disabled = false,
}) => {
  const colors = useColors();

  return (
    <Animated.View entering={FadeInDown.duration(600)}>
      <View
        style={{
          borderRadius: spacing.lg,
          overflow: 'hidden',
          backgroundColor: colors.primary,
          padding: spacing.xl,
          marginBottom: spacing.lg,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Gradient background effect with overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: spacing.sm,
          }}
        >
          {label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
            {currency}
          </Text>
          <Text style={{ fontSize: 42, fontWeight: '800', color: 'white' }}>
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const colors = useColors();

  const statusConfig = {
    pending: { bg: '#fbbf24', text: '#92400e' },
    approved: { bg: '#86efac', text: '#166534' },
    rejected: { bg: '#fca5a5', text: '#7f1d1d' },
    completed: { bg: '#a7f3d0', text: '#065f46' },
  };

  const config = statusConfig[status];
  const sizeConfig = {
    sm: { padding: spacing.xs, fontSize: 10 },
    md: { padding: spacing.sm, fontSize: 11 },
    lg: { padding: spacing.md, fontSize: 12 },
  };

  const currentSize = sizeConfig[size];

  return (
    <View
      style={{
        paddingHorizontal: currentSize.padding,
        paddingVertical: currentSize.padding * 0.5,
        borderRadius: spacing.sm,
        backgroundColor: config.bg,
      }}
    >
      <Text style={{ fontSize: currentSize.fontSize, fontWeight: '600', color: config.text, textTransform: 'capitalize' }}>
        {status}
      </Text>
    </View>
  );
};

interface TransactionItemProps {
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  timestamp: string;
  currency?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  description,
  amount,
  timestamp,
  currency = '₦',
}) => {
  const colors = useColors();
  const isCredit = type === 'credit';

  const date = new Date(timestamp);
  const formattedTime = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
          {description}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {formattedTime}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: isCredit ? colors.success : colors.text,
        }}
      >
        {isCredit ? '+' : '-'}
        {currency}
        {amount.toLocaleString()}
      </Text>
    </View>
  );
};

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Processing...' }) => {
  const colors = useColors();

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: spacing.lg,
          padding: spacing.xl,
          alignItems: 'center',
          gap: spacing.lg,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
          {message}
        </Text>
      </View>
    </View>
  );
};
