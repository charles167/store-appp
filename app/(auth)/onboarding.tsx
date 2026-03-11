import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useRoleStore, UserRole } from '@/stores/roleStore';

const ROLES = [
  {
    id: 'customer',
    icon: 'bag-handle-outline',
    title: 'Customer',
    description: 'Shop & discover products from amazing sellers',
    color: '#0ea5e9',
  },
  {
    id: 'vendor',
    icon: 'storefront-outline',
    title: 'Vendor/Seller',
    description: 'Grow your business & reach millions of buyers',
    color: '#a855f7',
  },
  {
    id: 'admin',
    icon: 'shield-checkmark-outline',
    title: 'Admin',
    description: 'Manage platform, users & content',
    color: '#f59e0b',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setRole = useRoleStore((state) => state.setRole);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      console.log('No role selected');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Setting role:', selectedRole);
      await setRole(selectedRole as UserRole);
      console.log('Role set successfully, navigating to sign-in');
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        router.push('/(auth)/sign-in');
      }, 100);
    } catch (error) {
      console.error('Error setting role:', error);
      alert('Failed to save role. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="dark" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32, marginTop: 24 }}>
          <Text style={{ fontSize: 44, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            Welcome to
          </Text>
          <Text style={{ fontSize: 44, fontWeight: 'bold', color: '#0ea5e9' }}>
            StoreHub
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#6b7280', marginTop: 16 }}>
            Choose your role to get started
          </Text>
        </View>

        {/* Role Cards */}
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => setSelectedRole(role.id)}
            disabled={isLoading}
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 20,
              marginBottom: 16,
              borderWidth: selectedRole === role.id ? 2 : 1,
              borderColor: selectedRole === role.id ? role.color : '#e5e7eb',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                backgroundColor: role.color + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name={role.icon as any} size={32} color={role.color} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
                {role.title}
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                {role.description}
              </Text>
            </View>

            {selectedRole === role.id && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: role.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          style={{
            backgroundColor: selectedRole ? '#0ea5e9' : '#d1d5db',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginTop: 32,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {selectedRole ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Select a role'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
