# Comprehensive Testing Checklist

## Pre-Testing Setup

### Prerequisites
- [ ] Node.js installed
- [ ] Expo CLI installed: `npm install -g expo-cli`
- [ ] Clerk account setup and keys configured
- [ ] iOS Simulator or Android Emulator ready
- [ ] Or: Expo Go app installed on physical device

### Installation
```bash
cd c:\onlinestore
npm install
npx expo start
```

---

## Phase 1: Onboarding Screen Testing

### Visual Elements
- [ ] Onboarding screen displays on app launch
- [ ] "Welcome to StoreHub! 👋" header visible
- [ ] Three role cards render correctly:
  - [ ] Customer card (blue, bag icon)
  - [ ] Vendor card (purple, storefront icon)
  - [ ] Admin card (amber, shield icon)
- [ ] Each card shows:
  - [ ] Role icon
  - [ ] Role title
  - [ ] Description text
  - [ ] Color-coded background

### Interaction
- [ ] Can tap on Customer card
  - [ ] Card highlights with checkmark
  - [ ] Continue button text changes: "Continue as Customer"
- [ ] Can tap on Vendor card
  - [ ] Previous selection deselected
  - [ ] Vendor card shows checkmark
  - [ ] Button text: "Continue as Vendor"
- [ ] Can tap on Admin card
  - [ ] Selection changes to Admin
  - [ ] Checkmark appears on Admin card
  - [ ] Button text: "Continue as Admin"

### Button States
- [ ] Continue button disabled initially (grayed out)
- [ ] Button enabled after role selection
- [ ] Button shows: "Continue as [ROLE]" when enabled
- [ ] Button loading state works (optional spinner)

### Animations
- [ ] Cards animate in smoothly (FadeInDown)
- [ ] Staggered animation delays visible
- [ ] Selection transition smooth (no lag)
- [ ] Button animations responsive

### Footer Section
- [ ] "Why Join StoreHub?" section visible
- [ ] Benefits listed:
  - [ ] 🚀 Fast & Secure Shopping
  - [ ] 💰 Great Deals Every Day
  - [ ] ⚡ Lightning Quick Delivery
  - [ ] 🎁 Exclusive Rewards
- [ ] Terms of Service link clickable
- [ ] Can scroll to see all content

---

## Phase 2: Role Persistence Testing

### Immediate Persistence
- [ ] Select Customer role
- [ ] Continue to sign-in
- [ ] Go back (if possible)
- [ ] Customer role still selected ✓

### App Restart Persistence
- [ ] Select Vendor role on onboarding
- [ ] Close app completely
- [ ] Kill app from recent apps
- [ ] Reopen app
- [ ] Vendor role still persists ✓
- [ ] Can verify: Role badge shows "Vendor Account"

### Multiple Selection Cycles
- [ ] Select Customer → Continue
- [ ] Back to onboarding
- [ ] Change to Admin → Continue
- [ ] Verify Admin role in sign-in badge
- [ ] Close and restart app
- [ ] Admin role persists ✓

### SecureStore Verification
- [ ] Roles survive app uninstall/reinstall (depends on OS)
- [ ] Cleared on app data clear
- [ ] Can't access role from other apps
- [ ] Encryption working (data unreadable if accessed directly)

---

## Phase 3: Sign-In Integration Testing

### Sign-In Screen Display
- [ ] Reach sign-in screen after role selection
- [ ] Page loads without errors
- [ ] No white/blank screens

### Role Badge
- [ ] Role badge displays at top of screen
- [ ] Shows selected role (Customer/Vendor/Admin)
- [ ] Correct color for role:
  - [ ] Customer: blue background
  - [ ] Vendor: purple background
  - [ ] Admin: amber background

### Change Role Option
- [ ] "Change" button/link visible next to role badge
- [ ] Clicking "Change" returns to onboarding
- [ ] Previous role deselected
- [ ] Can select new role
- [ ] New role shows in sign-in badge

### Greeting Text
- [ ] Greeting text includes role context
- [ ] Example: "Welcome back, Customer"
- [ ] Updates when role changes

### Sign-In Form
- [ ] Email/password input fields visible
- [ ] Clerk sign-in form renders
- [ ] No conflicts with role system

### Demo Mode
- [ ] Demo button visible
- [ ] Clicking demo respects role selection
- [ ] Logs in with demo account
- [ ] Routes to role dashboard

---

## Phase 4: Clerk Authentication Testing

### Sign-In Flow
- [ ] Can enter valid email
- [ ] Can enter valid password
- [ ] Sign-in button works
- [ ] Loading state shown during sign-in
- [ ] Success: User authenticated

### Sign-Up Flow
- [ ] Sign-up link/button accessible
- [ ] Can create new account
- [ ] Email verification works
- [ ] Successfully signs in after signup

### Demo Login
- [ ] Demo button available
- [ ] Clicking loads demo user
- [ ] No errors during demo login

### Error Handling
- [ ] Invalid credentials show error
- [ ] Network error shows error
- [ ] Error messages clear
- [ ] Can retry after error

---

## Phase 5: Role-Based Routing Testing

### Post-Login Routing
- [ ] Sign in as Customer role
- [ ] Routes to `/(customer)/home` ✓
- [ ] Customer home screen displays
- [ ] Not routed to other dashboards

- [ ] Sign in as Vendor role
- [ ] Routes to `/(seller)/dashboard` ✓
- [ ] Seller dashboard displays
- [ ] Stats and orders show

- [ ] Sign in as Admin role
- [ ] Routes to `/(admin)/dashboard` ✓
- [ ] Admin dashboard displays
- [ ] Platform stats and activities show

### Deep Linking (if applicable)
- [ ] Can deep link to `/admin/dashboard`
- [ ] Redirects if wrong role
- [ ] Protects unauthorized access

---

## Phase 6: Customer Profile Testing

### Profile Screen Access
- [ ] Customer can navigate to profile
- [ ] Profile loads without errors
- [ ] All sections visible

### Role Display Card
- [ ] "Account Type" section visible
- [ ] Role card displays:
  - [ ] Current role icon
  - [ ] "Customer Account" text
  - [ ] "You are signed in as a customer"
  - [ ] Background color matches role

### Change Role Button
- [ ] "Change Role" button visible on card
- [ ] Button color matches role color
- [ ] Clicking opens modal

### Role Selection Modal
- [ ] Modal overlays screen
- [ ] Shows three role options:
  - [ ] Customer (blue)
  - [ ] Vendor/Seller (purple)
  - [ ] Admin (amber)
- [ ] Each option shows:
  - [ ] Icon
  - [ ] Title
  - [ ] Description

### Role Change Process
- [ ] Click Customer (if not already)
  - [ ] Modal closes
  - [ ] User signed out
  - [ ] Redirected to onboarding
  - [ ] Can see role already selected
  - [ ] Sign in to return to dashboard
  - [ ] Customer account shown ✓

- [ ] Repeat with Vendor role
  - [ ] Vendor role persists
  - [ ] Sign in to verify vendor dashboard

- [ ] Repeat with Admin role
  - [ ] Admin role persists
  - [ ] Sign in to verify admin dashboard

### Profile Settings
- [ ] Dark mode toggle works
- [ ] Notifications toggle works
- [ ] Account menu items clickable
- [ ] Sign out button works
  - [ ] Signs out of Clerk
  - [ ] Clears role
  - [ ] Returns to onboarding

---

## Phase 7: Seller Dashboard Testing

### Dashboard Access
- [ ] Seller can access dashboard after login
- [ ] Dashboard loads quickly
- [ ] All stats visible
- [ ] Recent orders displayed

### Header Role Badge
- [ ] Header shows "Welcome back, [Name] 👋"
- [ ] Role badge shows below:
  - [ ] Storefront icon
  - [ ] "Vendor Account" text
  - [ ] Purple/secondary color
  - [ ] Rounded badge style

### Settings Button
- [ ] Settings icon button visible in header
- [ ] Clicking opens role management modal
- [ ] Modal shows current role with details

### Role Management Modal
- [ ] Shows "Account Settings" title
- [ ] Current role card displayed:
  - [ ] Role icon
  - [ ] "Current: Vendor Account"
  - [ ] Description

- [ ] "Switch Account Type" section shows:
  - [ ] Customer option (can click)
  - [ ] Admin option (can click)
  - [ ] Sign Out option (can click)

### Role Switching
- [ ] Click Customer:
  - [ ] User signed out
  - [ ] Redirected to onboarding
  - [ ] Customer role selected
  - [ ] Can sign in as customer
  
- [ ] Click Admin:
  - [ ] User signed out
  - [ ] Role changed to admin
  - [ ] Sign in shows admin account
  - [ ] Routes to admin dashboard

### Sign Out from Settings
- [ ] Click Sign Out button:
  - [ ] User logged out of Clerk
  - [ ] Redirected to onboarding
  - [ ] Role cleared
  - [ ] Must start fresh

---

## Phase 8: Admin Dashboard Testing

### Dashboard Access
- [ ] Admin can access dashboard after login
- [ ] Dashboard renders without errors
- [ ] Platform stats visible
- [ ] Recent activities displayed

### Header Role Badge
- [ ] Header shows "Welcome, [Name] 👑"
- [ ] Role badge shows:
  - [ ] Shield icon (shield-checkmark)
  - [ ] "Administrator Account" text
  - [ ] Red/danger color scheme
  - [ ] Rounded badge

### Platform Health Card
- [ ] Health status shows: "All Systems Operational"
- [ ] Green checkmark icon visible
- [ ] Status updates correctly

### Settings Button
- [ ] Settings icon visible
- [ ] Clicking opens role management modal
- [ ] Modal properly styled

### Role Management Modal
- [ ] Current role shown: "Administrator Account"
- [ ] Switch options for Customer and Vendor
- [ ] Sign Out option available

### Admin-Specific Features
- [ ] Platform stats cards display:
  - [ ] Total Revenue
  - [ ] Active Sellers
  - [ ] Total Users
  - [ ] Total Orders
- [ ] Recent activities section shows activity log
- [ ] Pending actions visible

### Role Switching from Admin
- [ ] Switch to Customer:
  - [ ] Successfully signs out
  - [ ] Customer role set
  - [ ] Can sign in as customer
  - [ ] Customer dashboard shown

- [ ] Switch to Vendor:
  - [ ] Successfully signs out
  - [ ] Vendor role set
  - [ ] Can sign in as vendor
  - [ ] Seller dashboard shown

---

## Phase 9: Cross-Role Navigation Testing

### Customer → Vendor
- [ ] Signed in as Customer
- [ ] Go to profile → Change Role
- [ ] Select Vendor
- [ ] Sign in as Vendor
- [ ] Verify at seller dashboard
- [ ] No data conflicts

### Vendor → Admin
- [ ] Signed in as Vendor
- [ ] Settings → Change Role
- [ ] Select Admin
- [ ] Sign in as Admin
- [ ] Verify at admin dashboard

### Admin → Customer
- [ ] Signed in as Admin
- [ ] Settings → Change Role
- [ ] Select Customer
- [ ] Sign in as Customer
- [ ] Verify at customer home
- [ ] Profile shows Customer account

### Multi-Cycle Navigation
- [ ] Customer → Vendor → Admin → Customer
- [ ] Each transition works correctly
- [ ] Role properly persisted
- [ ] No crashes or errors

---

## Phase 10: Persistence & Restart Testing

### Data Persistence Across Restarts
- [ ] Signed in as Customer
- [ ] Close app completely
- [ ] Open app → Goes to customer dashboard (no onboarding)
- [ ] Customer data preserved

- [ ] Change to Vendor role
- [ ] Close app
- [ ] Open app → Vendor role selected in onboarding
- [ ] Sign in → Seller dashboard shown

- [ ] Change to Admin role
- [ ] Force close app
- [ ] Reopen → Admin role ready
- [ ] Sign in → Admin dashboard shown

### Session Management
- [ ] Session persists across app restarts
- [ ] Clerk auth state restored
- [ ] Role state restored
- [ ] No duplicate logins required

### Long Session Testing
- [ ] Keep app open for 5+ minutes
- [ ] Navigate between screens
- [ ] Change roles
- [ ] All operations work smoothly

---

## Phase 11: Error & Edge Cases Testing

### Network Errors
- [ ] Disconnect internet during sign-in
- [ ] Error message shows
- [ ] Can retry after reconnect

### Invalid Role
- [ ] Try to manually set invalid role
- [ ] App handles gracefully
- [ ] Defaults to first role or onboarding

### Missing Clerk Config
- [ ] Verify app handles missing Clerk keys
- [ ] Error message informative
- [ ] App doesn't crash

### SecureStore Unavailable
- [ ] Role not persisted if SecureStore fails
- [ ] Fallback behavior works
- [ ] Can still use app

### Rapid Role Changes
- [ ] Quickly change role multiple times
- [ ] No race conditions
- [ ] Final role correct

### Concurrent Operations
- [ ] Change role while signing in
- [ ] Close app while changing role
- [ ] State stays consistent

---

## Phase 12: UI/UX Testing

### Visual Consistency
- [ ] All screens follow design system
- [ ] Colors consistent with roles
- [ ] Typography consistent
- [ ] Spacing proper

### Animations
- [ ] Onboarding entrance smooth
- [ ] Card selections animated
- [ ] Role changes transition smoothly
- [ ] No jumpy animations

### Responsiveness
- [ ] Works on small screens (iPhone SE)
- [ ] Works on large screens (iPhone 14 Pro Max)
- [ ] Works on tablets
- [ ] Layouts adapt properly

### Dark Mode (if applicable)
- [ ] Colors visible in dark mode
- [ ] Text contrast sufficient
- [ ] Badges readable

### Accessibility
- [ ] Text sizes readable
- [ ] Colors distinguishable (colorblind friendly)
- [ ] Buttons large enough to tap
- [ ] Touch targets adequate (44px minimum)

---

## Phase 13: Performance Testing

### Load Times
- [ ] Onboarding loads in < 2 seconds
- [ ] Sign-in loads in < 2 seconds
- [ ] Dashboards load in < 3 seconds
- [ ] Role changes complete in < 5 seconds

### Memory Usage
- [ ] No memory leaks during navigation
- [ ] App doesn't crash with rapid role changes
- [ ] Long sessions don't cause slowdowns

### Battery Impact
- [ ] App doesn't drain battery excessively
- [ ] Animations are efficient
- [ ] Background processes minimal

---

## Phase 14: Security Testing

### SecureStore Encryption
- [ ] Role data encrypted (verify in device storage)
- [ ] Can't access role from other apps
- [ ] Can't read raw role data

### Session Security
- [ ] Can't bypass sign-in
- [ ] Can't access admin dashboard as customer
- [ ] Auth state validated properly

### Token Management
- [ ] Clerk tokens managed securely
- [ ] Sessions expire properly
- [ ] Sign-out clears all data

### Data Privacy
- [ ] No sensitive data in logs
- [ ] No role exposed in URLs unnecessarily
- [ ] SignOut clears role data

---

## Phase 15: Regression Testing

### Previous Features Not Broken
- [ ] Customer home still works
- [ ] Product browsing unaffected
- [ ] Cart functionality intact
- [ ] Orders screen works
- [ ] Seller dashboard features work
- [ ] Admin dashboard features work

### Integration with Existing UI
- [ ] No conflicts with existing components
- [ ] Navigation drawer works
- [ ] Bottom tabs work (if applicable)
- [ ] Modals display properly

---

## Success Criteria

### Critical (Must Pass)
- ✅ Onboarding screen displays
- ✅ Can select role and proceed
- ✅ Role persists across restart
- ✅ Clerk auth integration works
- ✅ Role-based routing to correct dashboard
- ✅ No TypeScript errors
- ✅ No console errors during critical flows

### Important (Should Pass)
- ✅ Role management in all dashboards
- ✅ Animations smooth and performant
- ✅ All three roles fully functional
- ✅ Role changes work correctly
- ✅ Sign-out works from all screens

### Nice to Have
- ✅ Smooth animations with spring physics
- ✅ Color-coded role theming
- ✅ Responsive design on all devices
- ✅ Fast loading times

---

## Test Results

### Run Tests
- [ ] npm run type-check → Pass ✅
- [ ] npm run lint → Pass
- [ ] Manual QA → Pass
- [ ] Cross-device testing → Pass
- [ ] Performance testing → Pass

### Sign Off
- [ ] All critical tests pass
- [ ] All important tests pass
- [ ] Documentation complete
- [ ] Ready for production

---

## Notes & Issues Found

### Issues During Testing
(Record any issues found and resolution)

1. Issue: [Description]
   - Status: [Open/Resolved]
   - Severity: [Critical/High/Medium/Low]
   - Resolution: [How fixed]

### Recommendations
- [Any improvements found during testing]

---

**Test Plan Version**: 1.0
**Last Updated**: 2026
**Status**: Ready for Testing
**Estimated Time**: 3-4 hours for complete testing
