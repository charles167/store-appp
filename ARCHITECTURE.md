# Role-Based Onboarding Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Entry                         │
│                     app/_layout.tsx                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Initialize role on app start                      │   │
│  │ 2. Call getRole() from roleStore                    │   │
│  │ 3. Wait for role to load before routing             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │   User Signed  │
         │      In?       │
         └───┬────────┬───┘
             │        │
      YES   │        │   NO
         ┌──▼──┐  ┌──▼──────────────┐
         │Auth │  │ App/(auth)/     │
         │Group│  │ _layout.tsx     │
         └──┬──┘  └─────┬───────────┘
            │           │
      ┌─────▼──────┐    │
      │ Has Role?  │    │
      └────┬───┬───┘    │
           │   │        │
        YES│   │NO      │
      ┌────▼┐ │    ┌────▼──────────────────────┐
      │Route│ │    │  Show Onboarding         │
      │to   │ │    │  (app/(auth)/onboarding) │
      │Role │ │    │                          │
      │Dash │ │    │  Components:             │
      │board│ │    │  - Three role cards      │
      └─────┘ │    │  - Selection UI          │
              │    │  - Animations            │
              │    │  - Role selection logic  │
              │    └─────────┬────────────────┘
              │              │
              │         ┌─────▼──────────────┐
              │         │ Role Selected      │
              │         │ setRole() called   │
              │         │ Stored in          │
              │         │ SecureStore        │
              │         └─────────┬──────────┘
              │                   │
              │              ┌────▼──────────┐
              │              │  Redirect to  │
              │              │  Sign-In      │
              │              │  (with role   │
              │              │  badge)       │
              │              └─────┬─────────┘
              │                    │
              │         ┌──────────▼──────────┐
              │         │ Clerk Auth Flow    │
              │         │ (Sign-in/Sign-up)  │
              │         │                    │
              │         │ Role badge shows:  │
              │         │ - Customer         │
              │         │ - Vendor/Seller    │
              │         │ - Admin            │
              │         │                    │
              │         │ Can change role if │
              │         │ not yet logged in  │
              │         └──────────┬─────────┘
              │                    │
              └────────┬───────────┘
                       │
              ┌────────▼────────────┐
              │ Authenticated       │
              │ + Has Role          │
              └────────┬────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼──┐   ┌─────▼──┐  ┌────▼────┐
    │Customer│   │ Vendor │  │  Admin  │
    │Home    │   │ Seller │  │Dashboard│
    │        │   │        │  │         │
    │role:   │   │role:   │  │role:    │
    │customer│   │vendor  │  │admin    │
    └────┬───┘   └────┬───┘  └────┬────┘
         │             │           │
         │             │           │
    ┌────▼──────────────┼─────────┬┴─────────────┐
    │   Profile Page    │         │              │
    │   (Shared)        │         │              │
    │                   │         │              │
    │   Can:            │         │              │
    │   - View role     │         │              │
    │   - Change role   │         │              │
    │   - Sign out      │         │              │
    │                   │         │              │
    │   Role Modal:     │         │              │
    │   - Select new    │         │              │
    │     role          │         │              │
    │   - Confirms      │         │              │
    │     change        │         │              │
    └───────────────────┼─────────┼──────────────┘
                        │         │
            ┌───────────▼────┬────▼────────────┐
            │                │                 │
       ┌────▼────┐   ┌──────▼────┐   ┌───────▼──┐
       │Sign Out │   │Switch Role│   │ Continue │
       │Returns  │   │Re-auth    │   │ Current  │
       │to Auth  │   │New Role   │   │ Session  │
       │Layout   │   │Stored     │   │          │
       └────┬────┘   └──────┬────┘   └──────────┘
            │               │
       ┌────▼───────────────▼──────┐
       │   roleStore.ts            │
       │   (Zustand + SecureStore) │
       │                           │
       │   State:                  │
       │   - role (UserRole|null)  │
       │   - isLoading (boolean)   │
       │                           │
       │   Methods:                │
       │   - setRole(role)         │
       │   - getRole()             │
       │   - clearRole()           │
       │                           │
       │   Storage:                │
       │   - Expo SecureStore      │
       │   - Encrypted persistence │
       └───────────────────────────┘
```

## Data Flow

### 1. Role Selection Flow
```
User Opens App
    ↓
[Root Layout: getRole() from SecureStore]
    ↓
    ├─ Role Found & Signed In
    │  └─→ Redirect to Role Dashboard
    │
    └─ No Role Found
       └─→ Show Onboarding Screen
          ├─ User selects role
          ├─ setRole() called
          ├─ SecureStore.setItem('role', role)
          └─→ Redirect to Sign-In

[Auth Layout: Check role on entry]
    ├─ Has role & signed in
    │  └─→ Redirect to Role Dashboard
    └─ No role
       └─→ Show Onboarding
```

### 2. Authentication Flow
```
User at Sign-In Screen
    ├─ Role badge shows: Customer/Vendor/Admin
    ├─ Option to Change Role (returns to onboarding)
    ├─ Option to Continue (Clerk sign-in)
    │
    └─ After Successful Clerk Sign-In
       ├─ getRoleBasedRoute(role) returns:
       │  ├─ 'customer' → /(customer)/home
       │  ├─ 'vendor' → /(seller)/dashboard
       │  └─ 'admin' → /(admin)/dashboard
       │
       └─→ Redirect to Role Dashboard
```

### 3. Role Management Flow
```
User in Dashboard/Profile
    ├─ Click "Change Role" or Settings
    │  └─→ Show Role Modal
    │
    ├─ Modal Shows Current Role
    ├─ User Selects New Role
    │  └─→ changeRole(newRole) called
    │     ├─ signOut() from Clerk
    │     ├─ setRole(newRole) in SecureStore
    │     └─→ Redirect to Sign-In
    │
    └─ User Signs In Again
       └─→ New Role Dashboard Appears
```

## Component Hierarchy

```
SafeAreaView (Top Level)
├── StatusBar
└── Layout Provider
    ├── Auth Group (_layout.tsx)
    │  ├── Onboarding Screen
    │  │  ├── Header (Role Selection Title)
    │  │  ├── Role Cards Container
    │  │  │  ├── Role Option Card (Customer)
    │  │  │  │  ├── Icon
    │  │  │  │  ├── Title
    │  │  │  │  ├── Description
    │  │  │  │  └── Selection Indicator
    │  │  │  ├── Role Option Card (Vendor)
    │  │  │  └── Role Option Card (Admin)
    │  │  ├── Continue Button
    │  │  └── Footer (Why Join)
    │  │
    │  ├── Sign-In Screen (Enhanced)
    │  │  ├── Role Badge (top)
    │  │  ├── Clerk Sign-In Form
    │  │  └── Demo Mode
    │  │
    │  └── Sign-Up Screen
    │
    ├── Customer Group
    │  ├── Home Screen
    │  ├── Product Detail
    │  └── Profile Screen
    │     ├── User Info
    │     ├── Stats Cards
    │     ├── Role Display Card
    │     │  ├── Current Role Badge
    │     │  └── Change Role Button
    │     ├── Settings
    │     └── Role Management Modal
    │
    ├── Seller Group
    │  └── Dashboard
    │     ├── Header with Role Badge
    │     ├── Store Rating
    │     ├── Stats
    │     ├── Recent Orders
    │     └── Settings Modal (Role Management)
    │
    └── Admin Group
       └── Dashboard
          ├── Header with Role Badge
          ├── Platform Health
          ├── Stats
          ├── Recent Activities
          └── Settings Modal (Role Management)
```

## State Management

### Zustand Store: roleStore.ts
```typescript
interface RoleStore {
  // State
  role: UserRole | null;
  isLoading: boolean;
  
  // Actions
  setRole: (role: UserRole) => Promise<void>;
  getRole: () => Promise<UserRole | null>;
  clearRole: () => Promise<void>;
}

// Internal: Uses Expo SecureStore
const roleKey = 'storeHub_userRole';
// Encrypted at rest on device
```

### Clerk Integration
```typescript
// Sign-In Flow
useAuth() → Get signOut() method
useUser() → Get user info (firstName, email, etc.)
useRouter() → Navigate based on role

// Role-Aware Navigation
const getRoleBasedRoute = (role: UserRole) => {
  if (role === 'customer') return '/(customer)/home';
  if (role === 'vendor') return '/(seller)/dashboard';
  if (role === 'admin') return '/(admin)/dashboard';
}
```

## Security Model

```
Device Storage
    │
    ├─ Non-Encrypted (Shared Preferences)
    │  └─ User preferences, UI state
    │
    └─ Encrypted (SecureStore)
       └─ Role (roleStore)
          ├─ Only accessible to app
          ├─ Survives uninstall (on some devices)
          └─ Cleared on app data clear

Clerk Authentication
    ├─ JWT Token (secure)
    ├─ Session management
    └─ Sign-in/sign-up flow

App State (Zustand)
    ├─ Runtime role state
    ├─ Synced with SecureStore
    ├─ Cleared on sign-out
    └─ Reloaded on app start
```

## Key Integration Points

### 1. Onboarding → Auth
```
onboarding.tsx
├─ handleRoleSelection()
├─ useRoleStore().setRole()
├─ Stores in SecureStore
└─→ router.push('/(auth)/sign-in')
```

### 2. Auth Layout → Dashboard
```
auth/_layout.tsx
├─ Check isSignedIn + role
├─ If both true: getRoleBasedRoute()
├─ Otherwise: show onboarding
└─→ router.replace(route)
```

### 3. Dashboard → Role Change
```
profile.tsx / dashboard.tsx
├─ useRoleManager().changeRole()
├─ signOut() from Clerk
├─ setRole() in SecureStore
├─ Clear session
└─→ router.replace('/(auth)/sign-in')
```

## Performance Considerations

1. **Async Operations**
   - SecureStore operations are async
   - Wrapped in try-catch blocks
   - Loading states prevent race conditions

2. **Animations**
   - Reanimated for 60fps smoothness
   - SpringConfig for natural motion
   - Staggered delays for visual hierarchy

3. **Route Navigation**
   - Immediate route changes after role selection
   - No unnecessary re-renders
   - Efficient state updates with Zustand

4. **Type Safety**
   - TypeScript prevents runtime errors
   - Role type enum prevents invalid values
   - No implicit any types

## Testing Strategy

```
Unit Tests (roleStore.ts)
├─ setRole() persists correctly
├─ getRole() retrieves correctly
└─ clearRole() removes data

Integration Tests
├─ Onboarding → Sign-In flow
├─ Sign-In → Dashboard flow
├─ Role change → Re-auth flow
└─ App restart → Role persistence

E2E Tests
├─ Full user journey: Onboarding → Dashboard
├─ Role changes and persistence
├─ Multi-session behavior
└─ Edge cases and error handling
```

## Error Handling

```
Layer 1: SecureStore
├─ Try-catch around storage operations
└─ Graceful fallback if encryption fails

Layer 2: State Management
├─ Try-catch in actions
├─ Loading state prevents crashes
└─ Fallback to null role if error

Layer 3: Navigation
├─ Check auth before routing
├─ Validate role before redirect
└─ Fallback routes on error

Layer 4: UI
├─ Show error messages
├─ Allow retry operations
└─ Graceful degradation
```

## Future Scalability

```
Current Architecture
├─ 3 fixed roles
├─ Single-role per user
└─ Local storage

Scalable to:
├─ N roles via role registry
├─ Multi-role support (bitflags/array)
├─ Cloud-synced roles
├─ Permission-based access
├─ Team/organization roles
├─ Role expiration/scheduling
└─ Audit logging of role changes
```

---

**Architecture Version**: 1.0
**Last Updated**: 2026
**Status**: Production Ready
