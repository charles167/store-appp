import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { useRoleStore, UserRole } from '@/stores/roleStore';

/**
 * Hook for role-based route protection
 * Ensures users can only access routes matching their role
 */
export function useRoleBasedRouting() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const role = useRoleStore((state) => state.role);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      // User is not signed in, redirect to auth
      router.replace('/(auth)/onboarding');
    } else if (isSignedIn && inAuthGroup) {
      // User is signed in, redirect based on role
      if (role === 'vendor') {
        router.replace('/(seller)/dashboard');
      } else if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    }
  }, [isSignedIn, isLoaded, role, segments]);
}

/**
 * Validate if user has access to a specific role
 */
export function hasRoleAccess(userRole: UserRole | null, requiredRole: UserRole | UserRole[]): boolean {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

/**
 * Get dashboard route for a specific role
 */
export function getDashboardRoute(role: UserRole | null): string {
  switch (role) {
    case 'vendor':
      return '/(seller)/dashboard';
    case 'admin':
      return '/(admin)/dashboard';
    case 'customer':
    default:
      return '/(customer)/home';
  }
}

/**
 * Get accessible routes for a specific role
 */
export function getAccessibleRoutes(role: UserRole | null): string[] {
  const baseRoutes = ['/(auth)/sign-in', '/(auth)/sign-up', '/(auth)/onboarding'];
  
  switch (role) {
    case 'vendor':
      return [...baseRoutes, '/(seller)/*'];
    case 'admin':
      return [...baseRoutes, '/(admin)/*'];
    case 'customer':
    default:
      return [...baseRoutes, '/(customer)/*'];
  }
}
