# 🧪 Testing with Mock Data

## Overview

Since the backend API is currently down (Database Error), you can use **mock data** to test the web app functionality.

---

## How to Enable Mock API

### Option 1: Environment Variable (Recommended)

1. **Open `.env.local`:**
   ```
   C:\Users\XPRISTO\Downloads\Kafak\KafekApp\web\.env.local
   ```

2. **Change this line:**
   ```env
   USE_MOCK_API=false
   ```
   
   **To:**
   ```env
   USE_MOCK_API=true
   ```

3. **Restart the dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Option 2: Temporary Test

Just restart the server with the environment variable:
```bash
set USE_MOCK_API=true&&npm run dev
```

---

## What Mock Data Provides

### ✅ Working Endpoints with Mock Data:

| Endpoint | Mock Data | Description |
|----------|-----------|-------------|
| `get_product_list_by_filter` | ✅ 2 Products | Chicken Burger, Pizza |
| `get_all_store_list` | ✅ 1 Store | Test Restaurant |
| `get_product_details` | ✅ Product Info | First product details |
| `login` | ✅ Mock User | test@test.com |
| `signup` | ✅ Mock User | Creates mock account |

---

## Testing Checklist

### 1. Home Page
- [ ] Products load (Chicken Burger, Pizza)
- [ ] Stores load (Test Restaurant)
- [ ] No error banner
- [ ] Slider shows

### 2. Login
- [ ] Go to `/login`
- [ ] Enter any email/password
- [ ] Should login successfully
- [ ] Redirects to home

### 3. Signup
- [ ] Go to `/signup`
- [ ] Fill in form
- [ ] Should create account
- [ ] Redirects to home

### 4. Product Details
- [ ] Click on a product
- [ ] Shows details page
- [ ] Can add to cart

### 5. Cart
- [ ] Add items to cart
- [ ] Cart count updates
- [ ] Can view cart
- [ ] Can checkout

### 6. Profile
- [ ] Shows user info
- [ ] Shows wallet balance
- [ ] Menu items work

---

## Mock Data Details

### Mock Products:
1. **Chicken Burger** - 20 SAR (was 25 SAR)
   - Rating: 4/5 (50 reviews)
   - Provider: Test Restaurant
   
2. **Pizza Margherita** - 30 SAR (was 35 SAR)
   - Rating: 5/5 (30 reviews)
   - Provider: Test Restaurant

### Mock Store:
- **Test Restaurant**
  - Category: Restaurant
  - Rating: 4/5 (100 reviews)
  - Hours: 09:00 - 23:00
  - Status: Open

### Mock User (Login):
- Email: `test@test.com`
- Password: (any)
- Name: Test User
- Wallet: 100.00 SAR
- Token: mock_token_12345

---

## Console Output

When mock API is enabled, you'll see:
```
🟡 Mock API - Endpoint: get_product_list_by_filter
🟡 Mock API - Endpoint: get_all_store_list
```

Instead of:
```
Proxy GET: https://kaffak.company/...
🔴 Database Error from backend
```

---

## Switching Back to Real API

When the backend is fixed:

1. **Open `.env.local`:**
   ```env
   USE_MOCK_API=false
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Test real API:**
   - Products should load from real backend
   - Login/signup work with actual database

---

## Benefits of Mock API

✅ **Test UI/UX** - All pages work without backend
✅ **Development** - Continue building features
✅ **Demo** - Show app to stakeholders
✅ **Testing** - Verify all flows work
✅ **No Errors** - Clean console, no database errors

---

## Limitations

⚠️ **Data Not Persistent** - Mock data resets on refresh
⚠️ **Limited Records** - Only 2 products, 1 store
⚠️ **Fake Auth** - Login works but doesn't save to database
⚠️ **No Real Orders** - Orders aren't stored

---

## Current Status

**Mock API:** 🟡 Available for testing
**Real API:** 🔴 Database Error (waiting for backend fix)

---

## Next Steps

1. **Enable Mock API** - Set `USE_MOCK_API=true`
2. **Test the App** - Verify all features work
3. **Wait for Backend Fix** - Contact backend team
4. **Switch to Real API** - When database is fixed

---

**Quick Start:**
```bash
# Enable mock and start
set USE_MOCK_API=true&&npm run dev

# Open browser
http://localhost:3000
```

**Enjoy testing! 🎉**
