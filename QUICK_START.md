# Quick Start Guide - Role-Based Onboarding

## Installation & Setup

```bash
# Install dependencies (if not already done)
cd c:\onlinestore
npm install

# or with yarn
yarn install
```

## Running the App

### Development with Expo Go
```bash
# Start Expo development server
npx expo start

# Then scan QR code with:
# - Expo Go app (iOS/Android)
# - iOS Simulator: Press 'i'
# - Android Emulator: Press 'a'
```

### Building for Production
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Testing the Role-Based System

### Quick Test Flow
1. **Start App** → See onboarding screen
2. **Select Role** → Choose Customer/Vendor/Admin
3. **Sign In** → Use Clerk authentication
4. **View Dashboard** → Should match selected role
5. **Change Role** → Click settings to switch roles

### Test Users (Create in Clerk Dashboard)
- Customer account: basic email
- Vendor account: vendor-specific email  
- Admin account: admin-specific email

## Important Notes

### First Time Running
- Onboarding screen will appear before login
- Select any role to proceed
- Role is encrypted and saved locally
- Can be changed anytime from dashboard

### Role Selection Screen
```
Welcome to StoreHub! 👋

Choose your account type:
[🛍️ Customer] [🏪 Vendor] [🛡️ Admin]

Why Join StoreHub?
- 🚀 Fast & Secure Shopping
- 💰 Great Deals Every Day
- ...

[Continue as [ROLE]] →
```

### After Role Selection
- Automatically redirected to Clerk sign-in
- Role badge shows in sign-in screen
- Can change role before signing in
- After login → Specific dashboard

### Role-Specific Dashboards

**Customer Dashboard**
- Home feed with products
- Shopping cart
- Order history
- Profile with role display
- Can change role in profile

**Seller Dashboard**
- Sales statistics
- Order management
- Product management
- Store ratings
- Can change role in settings

**Admin Dashboard**
- Platform analytics
- User management
- Seller approvals
- Dispute handling
- Can change role in settings

## Environment Variables

Create `.env.local` if needed:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
```

## Troubleshooting

### Role Not Showing on Restart
1. Check Expo SecureStore has permissions
2. Verify role was saved: Check device settings → App permissions → Storage
3. Try clearing app cache and rebuild

### Sign-In Not Working
1. Verify Clerk keys in app.json
2. Check Clerk dashboard for any errors
3. Ensure user exists in Clerk

### Animations Laggy
- This is normal on first load
- Can be disabled by removing animation code if needed
- Performance improves after second run

### TypeScript Errors
- All errors should be fixed
- If you see errors, run: `npm run type-check`
- Report any new errors

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/(auth)/onboarding.tsx` | Role selection UI |
| `stores/roleStore.ts` | Role persistence |
| `app/(auth)/_layout.tsx` | Auth flow control |
| `app/(customer)/profile.tsx` | Customer role management |
| `app/(seller)/dashboard.tsx` | Seller role management |
| `app/(admin)/dashboard.tsx` | Admin role management |

## Useful Commands

```bash
# Check for TypeScript errors
npm run type-check

# View app bundle size
npx expo export

# Test specific file
npm test -- roleStore.ts

# Format code
npm run format

# Lint code
npm run lint
```

## Success Indicators ✅

When the app works correctly, you should see:
1. ✅ Onboarding screen on first launch
2. ✅ Role selection with 3 options
3. ✅ Smooth animations
4. ✅ Role persists after restart
5. ✅ Clerk sign-in works
6. ✅ Correct dashboard appears
7. ✅ Role badge shows in header
8. ✅ Can change role from settings
9. ✅ No console errors

## Need Help?

Check these resources:
- `ROLE_BASED_ONBOARDING_GUIDE.md` - Full documentation
- Clerk Docs: https://clerk.com/docs
- Expo Router: https://docs.expo.dev/router
- React Native: https://reactnative.dev

---

**Last Updated**: 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
