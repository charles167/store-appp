import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { tokenCache } from '@/utils/tokenCache';
import { useRoleStore } from '@/stores/roleStore';
import { ThemeProvider } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

export default function RootLayout() {
  const initializeRole = useRoleStore((state) => state.getRole);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load stored role on app start
        await initializeRole();
      } catch (error) {
        console.error('Error initializing role:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    initialize();
  }, []);

  return (
    <ClerkProvider 
      tokenCache={tokenCache}
      publishableKey={CLERK_PUBLISHABLE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
