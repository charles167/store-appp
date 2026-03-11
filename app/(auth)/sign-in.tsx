import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoleStore } from '@/stores/roleStore';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const role = useRoleStore((state) => state.role);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRoleBasedRoute = () => {
    switch (role) {
      case 'vendor':
        return '/(seller)/dashboard';
      case 'admin':
        return '/(admin)/dashboard';
      case 'customer':
      default:
        return '/(customer)/home';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'vendor':
        return '#a855f7';
      case 'admin':
        return '#f59e0b';
      case 'customer':
      default:
        return '#0ea5e9';
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace(getRoleBasedRoute() as any);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const onDemoPress = () => {
    router.replace(getRoleBasedRoute() as any);
  };

  const handleRoleChange = () => {
    router.replace('/(auth)/onboarding');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        >
          {/* Role Badge */}
          {role && (
            <View
              style={{
                backgroundColor: getRoleColor(),
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignSelf: 'flex-start',
                marginBottom: 32,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                {role.charAt(0).toUpperCase() + role.slice(1)} Account
              </Text>
              <TouchableOpacity onPress={handleRoleChange}>
                <Text style={{ color: '#fff', fontSize: 12, textDecorationLine: 'underline' }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
              Welcome Back
            </Text>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>
              Sign in to your {role || 'customer'} account
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View
              style={{
                backgroundColor: '#fee2e2',
                borderRadius: 16,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#fca5a5',
              }}
            >
              <Text style={{ color: '#991b1b', fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Email Address
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: '#111827',
                }}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Password
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: '#111827',
                }}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading}
              style={{
                backgroundColor: getRoleColor(),
                borderRadius: 12,
                paddingVertical: 18,
                alignItems: 'center',
                marginBottom: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDemoPress}
              disabled={loading}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                paddingVertical: 18,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#e5e7eb',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>
                Demo Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#6b7280', fontSize: 14 }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={{ color: getRoleColor(), fontSize: 14, fontWeight: 'bold' }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Social Login */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              <Text style={{ color: '#9ca3af', marginHorizontal: 16, fontSize: 14 }}>
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={{ color: '#374151', fontSize: 14, fontWeight: '600' }}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text style={{ color: '#374151', fontSize: 14, fontWeight: '600' }}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
