# Developer Reference Guide

## Quick Reference

### Using the Role System in Your Code

#### 1. Get Current Role
```typescript
import { useRoleStore } from '@/stores/roleStore';

export default function MyComponent() {
  const role = useRoleStore((state) => state.role);
  const isLoading = useRoleStore((state) => state.isLoading);
  
  if (isLoading) return <ActivityIndicator />;
  if (!role) return <Text>No role selected</Text>;
  
  return <Text>Your role: {role}</Text>;
}
```

#### 2. Change Role
```typescript
import { useRoleManager } from '@/utils/useRoleManager';

export default function ChangeRoleButton() {
  const { changeRole } = useRoleManager();
  
  return (
    <TouchableOpacity onPress={() => changeRole('vendor')}>
      <Text>Switch to Vendor</Text>
    </TouchableOpacity>
  );
}
```

#### 3. Get Role Display Info
```typescript
import { useRoleManager } from '@/utils/useRoleManager';

export default function RoleDisplay() {
  const { getRoleDisplayName, getRoleIcon, getRoleColor } = useRoleManager();
  
  return (
    <View style={{ backgroundColor: getRoleColor() + '15' }}>
      <Ionicons name={getRoleIcon() as any} color={getRoleColor()} />
      <Text>{getRoleDisplayName()} Account</Text>
    </View>
  );
}
```

#### 4. Protect Routes
```typescript
import { useRoleBasedRouting } from '@/utils/roleProtection';

export default function ProtectedAdminScreen() {
  const { hasAccess } = useRoleBasedRouting();
  
  if (!hasAccess('admin')) {
    return <Text>Access Denied</Text>;
  }
  
  return <AdminContent />;
}
```

---

## API Reference

### roleStore.ts

#### State
```typescript
interface RoleState {
  role: UserRole | null;           // Current role
  isLoading: boolean;              // Loading state
}

type UserRole = 'customer' | 'vendor' | 'admin';
```

#### Methods

**setRole(role: UserRole)**
```typescript
// Saves role to SecureStore
await roleStore.setState({ role });
await SecureStore.setItem('storeHub_userRole', role);
```

**getRole()**
```typescript
// Retrieves role from SecureStore
const role = await SecureStore.getItem('storeHub_userRole');
return role as UserRole | null;
```

**clearRole()**
```typescript
// Removes role from SecureStore
await SecureStore.deleteItem('storeHub_userRole');
```

---

### useRoleManager.ts

#### Hooks

**getRoleDisplayName()**
```typescript
const name = getRoleDisplayName();
// Returns: "Customer" | "Vendor/Seller" | "Administrator"
```

**getRoleIcon()**
```typescript
const icon = getRoleIcon();
// Returns: "bag-outline" | "storefront-outline" | "shield-checkmark-outline"
```

**getRoleColor()**
```typescript
const color = getRoleColor();
// Returns: "#0ea5e9" | "#a855f7" | "#ef4444"
```

**changeRole(newRole: UserRole)**
```typescript
// Signs out, changes role, redirects to sign-in
await changeRole('vendor');
```

**resetRole()**
```typescript
// Clears role completely, returns to onboarding
await resetRole();
```

---

### roleProtection.ts

#### Hooks

**useRoleBasedRouting()**
```typescript
const {
  hasAccess,           // (role: UserRole) => boolean
  getDashboardRoute,   // (role: UserRole) => string
  getAccessibleRoutes  // (role: UserRole) => string[]
} = useRoleBasedRouting();
```

#### Functions

**hasRoleAccess(userRole, requiredRole)**
```typescript
const canAccess = hasRoleAccess('customer', 'admin');
// Returns false - customer cannot access admin features
```

**getDashboardRoute(role)**
```typescript
const route = getDashboardRoute('vendor');
// Returns: "/(seller)/dashboard"
```

**getAccessibleRoutes(role)**
```typescript
const routes = getAccessibleRoutes('customer');
// Returns: ["/(customer)/home", "/(customer)/profile", ...]
```

---

## Common Patterns

### Pattern 1: Conditional Rendering by Role
```typescript
import { useRoleStore } from '@/stores/roleStore';

export default function Feature() {
  const role = useRoleStore((state) => state.role);
  
  return (
    <View>
      {role === 'admin' && <AdminFeature />}
      {role === 'vendor' && <VendorFeature />}
      {role === 'customer' && <CustomerFeature />}
    </View>
  );
}
```

### Pattern 2: Role-Based Navigation
```typescript
import { useRouter } from 'expo-router';
import { useRoleStore } from '@/stores/roleStore';

export default function NavigateToProfile() {
  const router = useRouter();
  const role = useRoleStore((state) => state.role);
  
  const handleNavigate = () => {
    if (role === 'customer') {
      router.push('/(customer)/profile');
    } else if (role === 'vendor') {
      router.push('/(seller)/profile');
    }
  };
  
  return (
    <TouchableOpacity onPress={handleNavigate}>
      <Text>Go to Profile</Text>
    </TouchableOpacity>
  );
}
```

### Pattern 3: Role-Based Styling
```typescript
import { useRoleManager } from '@/utils/useRoleManager';

export default function RoleCard() {
  const { getRoleColor, getRoleIcon } = useRoleManager();
  const color = getRoleColor();
  
  return (
    <View
      style={{
        backgroundColor: color + '15',
        borderColor: color + '30',
        borderWidth: 1,
      }}
    >
      <Ionicons name={getRoleIcon() as any} color={color} />
    </View>
  );
}
```

### Pattern 4: Loading During Role Operations
```typescript
import { useRoleStore } from '@/stores/roleStore';

export default function MyComponent() {
  const role = useRoleStore((state) => state.role);
  const isLoading = useRoleStore((state) => state.isLoading);
  
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading your role...</Text>
      </View>
    );
  }
  
  return <YourContent />;
}
```

### Pattern 5: Protected Screen
```typescript
import { useRoleStore } from '@/stores/roleStore';
import { useRouter } from 'expo-router';

export default function AdminOnly() {
  const role = useRoleStore((state) => state.role);
  const router = useRouter();
  
  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace('/(customer)/home');
    }
  }, [role]);
  
  if (role !== 'admin') {
    return null; // Show nothing while redirecting
  }
  
  return <AdminDashboard />;
}
```

---

## Environment Setup

### Required Environment Variables
```env
# .env.local
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Clerk Setup
1. Create Clerk account at https://clerk.com
2. Create application
3. Get Publishable Key
4. Add to app.json under Clerk config
5. Enable sign-in methods needed

### Testing with Clerk
- Use provided test accounts
- Or create new test accounts in dashboard
- Test with different email domains for different roles
- Verify sign-out clears Clerk session

---

## Debugging

### Common Issues & Solutions

#### "No role found on startup"
```typescript
// Problem: Role not loading from SecureStore
// Solution: Check that getRole() is called in root layout

// In app/_layout.tsx
useEffect(() => {
  roleStore.getRole(); // Make sure this is called
}, []);
```

#### "Role persists after logout"
```typescript
// Problem: Role not cleared on sign-out
// Solution: Call clearRole() in sign-out handler

// In your sign-out handler
await signOut();
await roleStore.clearRole();
```

#### "Wrong dashboard displayed"
```typescript
// Problem: Role-based routing not working
// Solution: Check getRoleBasedRoute() function

// Verify mapping:
// 'customer' → '/(customer)/home'
// 'vendor' → '/(seller)/dashboard'
// 'admin' → '/(admin)/dashboard'
```

#### "TypeScript errors with role type"
```typescript
// Problem: UserRole type not recognized
// Solution: Import from roleStore

import { UserRole } from '@/stores/roleStore';

const handleRole = (role: UserRole) => {
  // Now TypeScript knows the valid values
};
```

### Debug Logging

```typescript
// Enable detailed logging during development
const debugRole = () => {
  const role = useRoleStore((state) => state.role);
  console.log('Current role:', role);
  
  const { getRoleDisplayName, getRoleColor } = useRoleManager();
  console.log('Display name:', getRoleDisplayName());
  console.log('Color:', getRoleColor());
};
```

### Check SecureStore
```typescript
// Debug: Check what's stored
import * as SecureStore from 'expo-secure-store';

const checkSecureStore = async () => {
  const role = await SecureStore.getItem('storeHub_userRole');
  console.log('Stored role:', role);
};
```

---

## Testing

### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useRoleStore } from '@/stores/roleStore';

describe('roleStore', () => {
  it('should set and get role', async () => {
    const { result } = renderHook(() => useRoleStore());
    
    await act(async () => {
      await result.current.setRole('customer');
    });
    
    expect(result.current.role).toBe('customer');
  });
});
```

### Integration Test Example
```typescript
// Test onboarding → sign-in → dashboard flow
it('should complete full auth flow', async () => {
  // 1. Render onboarding
  const { getByText } = render(<Onboarding />);
  
  // 2. Select role
  fireEvent.press(getByText('Continue as Customer'));
  
  // 3. Verify sign-in shown
  expect(getByText('Customer Account')).toBeTruthy();
  
  // 4. Sign in
  await signInWithClerk(testUser);
  
  // 5. Verify dashboard shown
  expect(router.replace).toBeCalledWith('/(customer)/home');
});
```

---

## Performance Optimization Tips

### Avoid Unnecessary Re-renders
```typescript
// ❌ Bad: Re-renders on every role change
const role = useRoleStore(); // Gets entire store

// ✅ Good: Only subscribes to role
const role = useRoleStore((state) => state.role);
```

### Memoize Role-Based Components
```typescript
import { memo } from 'react';

const RoleDisplay = memo(({ role }) => {
  return <Text>{role}</Text>;
});
```

### Use useMemo for Role Calculations
```typescript
import { useMemo } from 'react';

export default function MyComponent() {
  const role = useRoleStore((state) => state.role);
  
  const roleInfo = useMemo(() => ({
    displayName: getRoleDisplayName(),
    color: getRoleColor(),
    icon: getRoleIcon(),
  }), [role]);
  
  return <RoleCard info={roleInfo} />;
}
```

---

## Code Examples Repository

### Complete Sign-Out with Role Clear
```typescript
const handleSignOut = async () => {
  try {
    // Sign out from Clerk
    await signOut();
    
    // Clear role from store and SecureStore
    await roleStore.clearRole();
    
    // Navigate to auth
    router.replace('/(auth)/sign-in');
  } catch (error) {
    console.error('Sign out error:', error);
  }
};
```

### Complete Role Change
```typescript
const handleRoleChange = async (newRole: UserRole) => {
  try {
    // Sign out current user
    await signOut();
    
    // Update role
    await roleStore.setRole(newRole);
    
    // Navigate to sign-in with new role
    router.replace('/(auth)/sign-in');
  } catch (error) {
    console.error('Role change error:', error);
    // Show error to user
  }
};
```

### Protected Component Wrapper
```typescript
export function WithRoleProtection({
  requiredRole,
  children,
  fallback = null,
}: {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const role = useRoleStore((state) => state.role);
  
  if (role === requiredRole) {
    return children;
  }
  
  return fallback;
}

// Usage:
<WithRoleProtection requiredRole="admin">
  <AdminFeatures />
</WithRoleProtection>
```

---

## File Navigation

### Quick File Finder
```
Role-Based Files:
- stores/roleStore.ts          ← Main role state
- utils/useRoleManager.ts      ← Role utilities
- utils/roleProtection.ts      ← Route protection
- app/(auth)/onboarding.tsx    ← Role selection UI
- app/(auth)/_layout.tsx       ← Auth routing
- app/(auth)/sign-in.tsx       ← Sign-in with role
- app/_layout.tsx              ← Role initialization

Modified Dashboards:
- app/(customer)/profile.tsx   ← Customer role mgmt
- app/(seller)/dashboard.tsx   ← Vendor role mgmt
- app/(admin)/dashboard.tsx    ← Admin role mgmt
```

---

## Support Resources

### Documentation Files
- `ROLE_BASED_ONBOARDING_GUIDE.md` - Full documentation
- `QUICK_START.md` - Setup and running
- `ARCHITECTURE.md` - System design
- `TESTING_CHECKLIST.md` - Testing guide
- `IMPLEMENTATION_SUMMARY.md` - What was built

### External Resources
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Clerk Documentation](https://clerk.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

### Support Channels
- Check error logs: `Ctrl + Shift + K` in VS Code terminal
- Debug Clerk: https://dashboard.clerk.com/logs
- Expo errors: Clear cache with `expo start --clear`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026 | Initial role-based onboarding implementation |
| - | - | Production ready |

---

**Guide Version**: 1.0
**Last Updated**: 2026
**Status**: Complete and Verified ✅
