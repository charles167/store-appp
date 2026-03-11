import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useRoleStore, UserRole } from '@/stores/roleStore';

/**
 * Hook for managing role-related actions
 */
export function useRoleManager() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { role, setRole, clearRole, getRole } = useRoleStore();

  /**
   * Change user role and redirect to onboarding
   */
  const changeRole = async (newRole: UserRole) => {
    try {
      await setRole(newRole);
      // Sign out current user
      await signOut();
      // Redirect to sign-in with new role
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error changing role:', error);
      throw error;
    }
  };

  /**
   * Reset role selection
   */
  const resetRole = async () => {
    try {
      await clearRole();
      await signOut();
      router.replace('/(auth)/onboarding');
    } catch (error) {
      console.error('Error resetting role:', error);
      throw error;
    }
  };

  /**
   * Get role display name
   */
  const getRoleDisplayName = () => {
    switch (role) {
      case 'vendor':
        return 'Vendor/Seller';
      case 'admin':
        return 'Administrator';
      case 'customer':
      default:
        return 'Customer';
    }
  };

  /**
   * Get role icon name
   */
  const getRoleIcon = () => {
    switch (role) {
      case 'vendor':
        return 'storefront-outline';
      case 'admin':
        return 'shield-checkmark-outline';
      case 'customer':
      default:
        return 'bag-handle-outline';
    }
  };

  /**
   * Get role color
   */
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

  return {
    role,
    changeRole,
    resetRole,
    getRoleDisplayName,
    getRoleIcon,
    getRoleColor,
    getRole,
  };
}
