import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRoleStore } from '@/stores/roleStore';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const role = useRoleStore((state) => state.role);
  const getRole = useRoleStore((state) => state.getRole);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has selected a role
        const storedRole = await getRole();

        // If user is signed in, redirect to dashboard based on role
        if (isSignedIn && storedRole) {
          if (storedRole === 'customer') {
            router.replace('/(customer)/home');
          } else if (storedRole === 'vendor') {
            router.replace('/(seller)/dashboard');
          } else if (storedRole === 'admin') {
            router.replace('/(admin)/dashboard');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isSignedIn]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
