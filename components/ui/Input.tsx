/**
 * Premium Input Component
 * Text input with focus states and validation feedback
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radius } from '@/theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'minimal';
  disabled?: boolean;
}

export function Input({
  label,
  placeholder,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  disabled = false,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : isFocused
    ? colors.primary
    : colors.border;

  const backgroundColor = variant === 'minimal' 
    ? colors.background 
    : colors.surface;

  return (
    <View style={{ marginVertical: spacing.sm }}>
      {label && (
        <Text
          style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: spacing.sm,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: spacing.md,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={{ marginRight: spacing.sm }}
          />
        )}

        <TextInput
          {...textInputProps}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 16,
            paddingVertical: spacing.md,
          }}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={disabled}
            activeOpacity={0.6}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.textSecondary}
              style={{ marginLeft: spacing.sm }}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={{
            color: colors.danger,
            fontSize: 12,
            marginTop: spacing.xs,
            fontWeight: '500',
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export default Input;
