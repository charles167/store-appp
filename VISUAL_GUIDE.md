# 📱 App Navigation & Screen Flow

## 🎯 Application Structure

```
┌─────────────────────────────────────────────────┐
│                  App Entry                      │
│                  (index.tsx)                    │
│                                                 │
│  Checks Authentication & Role                   │
└──────────────┬──────────────────────────────────┘
               │
               ├─── Not Signed In → Authentication
               │
               └─── Signed In → Role-Based Route
                     │
                     ├─── Customer → Customer Tabs
                     ├─── Seller → Seller Tabs
                     └─── Admin → Admin Tabs
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│  App Start   │
└──────┬───────┘
       │
       v
┌──────────────────┐      No      ┌──────────────┐
│ User Signed In?  │─────────────>│  Sign In     │
└──────┬───────────┘               └──────┬───────┘
       │ Yes                               │
       v                                   v
┌──────────────────┐               ┌──────────────┐
│ Check User Role  │               │  Sign Up     │
└──────┬───────────┘               └──────┬───────┘
       │                                   │
       ├─ Customer ──> Home                v
       ├─ Seller ────> Dashboard    ┌──────────────┐
       └─ Admin ─────> Dashboard    │  Verify Code │
                                    └──────┬───────┘
                                           │
                                           v
                                    ┌──────────────┐
                                    │ Redirect Home│
                                    └──────────────┘
```

---

## 👤 Customer App Navigation

```
┌─────────────────────────────────────────────────┐
│             Customer Tab Bar                    │
│  [Home] [Search] [Cart] [Orders] [Profile]     │
└──┬───────┬────────┬───────┬────────┬────────────┘
   │       │        │       │        │
   v       v        v       v        v
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│ Home │ │Search│ │ Cart │ │Orders│ │ Profile  │
└──┬───┘ └──────┘ └──┬───┘ └──┬───┘ └──────────┘
   │                 │        │
   v                 v        v
┌─────────┐      ┌─────────┐ ┌─────────────┐
│ Product │      │Checkout │ │Order Details│
│ Details │      └─────────┘ └─────────────┘
└─────────┘
```

### Home Screen Features
- 🎨 Welcome banner with user name
- 🔍 Search bar
- 📂 Categories (horizontal scroll)
- 🎁 Featured products
- 🌟 Special offers banner

### Cart Screen Features
- 📝 Item list with images
- ➕➖ Quantity controls
- 🎫 Promo code input
- 💰 Price summary
- 🛒 Checkout button

### Orders Screen Features
- 🔖 Order filters (All, Processing, etc.)
- 📦 Order cards with status
- 👁️ Track order button
- 📅 Order date and details

---

## 🏪 Seller Dashboard Navigation

```
┌──────────────────────────────────────────────────────┐
│                Seller Tab Bar                        │
│ [Dashboard] [Products] [Orders] [Analytics] [Profile]│
└──┬──────────┬─────────┬────────┬──────────┬──────────┘
   │          │         │        │          │
   v          v         v        v          v
┌─────────┐ ┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐
│Dashboard│ │Products│ │Orders│ │Analytics│ │Profile │
└─────────┘ └────────┘ └──────┘ └────────┘ └────────┘
```

### Dashboard Features
- 📊 Sales statistics (4 cards)
- ⭐ Store rating display
- 🎯 Quick action buttons
- 📋 Recent orders list
- 🔔 Notifications

### Products Screen Features
- ➕ Add product button
- 📦 Product cards with images
- 📝 Edit/Delete actions
- 📊 Stock and sales info
- 🔴 Out of stock indicator

### Seller Orders Features
- 🔖 Order status filters
- 📦 Order list with customer info
- 💵 Total amount display
- 🔄 Update status button
- 📅 Order date

---

## 👑 Admin Panel Navigation

```
┌───────────────────────────────────────────────────────┐
│                   Admin Tab Bar                       │
│  [Dashboard] [Sellers] [Users] [Analytics] [Settings] │
└──┬──────────┬────────┬───────┬──────────┬─────────────┘
   │          │        │       │          │
   v          v        v       v          v
┌─────────┐ ┌──────┐ ┌─────┐ ┌────────┐ ┌──────────┐
│Dashboard│ │Sellers│ │Users│ │Analytics│ │ Settings │
└─────────┘ └──────┘ └─────┘ └────────┘ └──────────┘
```

### Dashboard Features
- 📈 Platform statistics (4 cards)
- ⚠️ Pending actions list
- 📋 Recent activity feed
- 🎯 Quick action buttons
- 🟢 System health status

### Sellers Screen Features
- 🔖 Seller status filters
- 👥 Seller list with ratings
- ✅ Approve/reject buttons
- 🚫 Suspend seller option
- 📊 Revenue and stats

### Users Screen Features
- 🔍 User search bar
- 🔖 Role filters
- 👥 User list with details
- 🏷️ Role badges
- 🚫 Suspend/activate actions

---

## 🎨 UI Component Hierarchy

```
Screen
├── SafeAreaView (Screen Container)
│   ├── Header Section
│   │   ├── Title
│   │   ├── Subtitle
│   │   └── Action Buttons
│   │
│   ├── Content Section (ScrollView)
│   │   ├── Stats Cards
│   │   ├── Lists
│   │   ├── Forms
│   │   └── Custom Components
│   │
│   └── Footer Section (Optional)
│       └── Fixed Action Buttons
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Update (if needed)
    ↓
UI Re-render with New State
    ↓
API Call (Future - Not Implemented Yet)
    ↓
Backend Processing
    ↓
Database Update
    ↓
Response to Frontend
    ↓
Update Zustand Store
    ↓
UI Update
```

---

## 📦 State Management

### Cart Store
```typescript
useCartStore
├── items[]
├── addItem()
├── removeItem()
├── updateQuantity()
├── clearCart()
├── getTotalItems()
└── getTotalPrice()
```

### User Store
```typescript
useUserStore
├── role
├── setRole()
├── clearRole()
├── isAdmin()
├── isSeller()
└── isCustomer()
```

### Theme Store
```typescript
useThemeStore
├── theme ('light' | 'dark' | 'system')
├── setTheme()
└── toggleTheme()
```

---

## 🎯 Screen States

### Loading State
```
┌─────────────────┐
│   [Skeleton]    │
│   Loading...    │
│   [Skeleton]    │
└─────────────────┘
```

### Empty State
```
┌─────────────────┐
│       📦        │
│  No items yet   │
│  [Add Item Btn] │
└─────────────────┘
```

### Error State
```
┌─────────────────┐
│       ⚠️        │
│ Something wrong │
│  [Retry Button] │
└─────────────────┘
```

### Success State
```
┌─────────────────┐
│  [List Items]   │
│  [Cards]        │
│  [Content]      │
└─────────────────┘
```

---

## 🎨 Design Tokens

### Colors
```
Primary:    #0ea5e9  (Blue)
Secondary:  #a855f7  (Purple)
Success:    #22c55e  (Green)
Danger:     #ef4444  (Red)
Warning:    #f59e0b  (Amber)
Dark:       #171717  (Almost Black)
```

### Spacing
```
Small:      4px, 8px
Medium:     12px, 16px
Large:      24px, 32px
XLarge:     48px, 64px
```

### Border Radius
```
Small:      8px
Medium:     16px
Large:      24px
XLarge:     32px
```

### Shadows
```
Soft:    0 2px 8px rgba(0, 0, 0, 0.06)
Medium:  0 4px 16px rgba(0, 0, 0, 0.1)
Strong:  0 8px 32px rgba(0, 0, 0, 0.15)
```

---

## 📱 Responsive Breakpoints

```
Small Phone:   < 375px
Phone:         375px - 414px
Large Phone:   414px - 768px
Tablet:        768px+
```

---

## 🚀 Performance Tips

### Optimizations Used
- ✅ Reanimated for 60fps animations
- ✅ FlatList for long lists
- ✅ Image caching ready
- ✅ Lazy loading ready
- ✅ Memo for expensive components (ready)

---

## 📊 Screen Complexity

```
Simple Screens (Few components):
- Sign In
- Sign Up
- Profile

Medium Screens (Multiple sections):
- Orders
- Products
- Users

Complex Screens (Many components):
- Customer Home
- Seller Dashboard
- Admin Dashboard
```

---

## 🎯 Navigation Patterns

### Stack Navigation
```
Authentication Stack
├── Sign In
└── Sign Up
```

### Tab Navigation
```
Customer Tabs
├── Home
├── Search
├── Cart
├── Orders
└── Profile

Seller Tabs
├── Dashboard
├── Products
├── Orders
├── Analytics
└── Profile

Admin Tabs
├── Dashboard
├── Sellers
├── Users
├── Analytics
└── Settings
```

---

This visual guide helps understand the complete app structure at a glance! 🎨
