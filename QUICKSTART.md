# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for testing)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Clerk Authentication

1. Visit [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to "API Keys" in your Clerk dashboard
4. Copy your **Publishable Key**
5. Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Start the Development Server
```bash
npm start
```

### 4. Run the App

**Option A: Use Expo Go (Recommended for testing)**
1. Install Expo Go on your phone (iOS/Android)
2. Scan the QR code from the terminal
3. App will load on your device

**Option B: Use Simulator/Emulator**
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android
```

## 📱 Testing the App

### Default User Roles
Since this is frontend-only for now, you can test by signing up with different emails:

- **Customer**: Any new registration defaults to customer role
- **Seller**: Modify code in `app/index.tsx` to redirect to `/(seller)/dashboard`
- **Admin**: Modify code in `app/index.tsx` to redirect to `/(admin)/dashboard`

### Testing Flow
1. **Sign Up** → Create a new account
2. **Verify Email** → Enter 6-digit code sent to email
3. **Explore** → Navigate through the app

## 🎨 UI Features to Test

✅ Smooth page transitions
✅ Beautiful authentication screens  
✅ Tab navigation (Customer, Seller, Admin)
✅ Shopping cart functionality
✅ Product browsing
✅ Order management
✅ Profile settings

## 🔧 Troubleshooting

### "Network error" when signing in
- Check your internet connection
- Verify Clerk publishable key is correct
- Make sure `.env` file exists in project root

### App won't load
```bash
# Clear cache and restart
npx expo start --clear
```

### TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Project Structure

```
app/
├── (auth)/          → Sign in/Sign up
├── (customer)/      → Customer app (Home, Cart, Orders)
├── (seller)/        → Seller dashboard
├── (admin)/         → Admin panel
```

## 🎯 Next Steps

1. ✅ Frontend is complete
2. ⏳ Backend API integration needed
3. ⏳ Connect to PostgreSQL database
4. ⏳ Implement real product data
5. ⏳ Add payment processing

## 💡 Tips

- Use **Expo Go** app for fastest development
- Hot reload works automatically
- Check terminal for errors
- Use Chrome DevTools for debugging

---

Happy coding! 🚀
