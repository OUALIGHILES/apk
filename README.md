# Kafek Web Application

A full-stack Next.js web application for Kafek - a multi-service delivery & booking platform. This web app mirrors the functionality of the Kafek Android APK with the same styling and shared backend data.

## 🚀 Features

### Core Features
- **User Authentication**: Login, Signup, Social Login (Google, Facebook)
- **Product Browsing**: View products by category, store, or search
- **Store Discovery**: Browse stores/restaurants with filters
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, track order status, view order history
- **User Profile**: Manage profile, addresses, wallet, notifications
- **Favorites**: Save favorite products and stores
- **Multi-language Support**: English, Arabic (العربية), Urdu (اردو)
- **Responsive Design**: Works on desktop, tablet, and mobile

### Shared Backend
- **Same API**: Uses the same REST API as the Android app (`https://kaffak.company/kaffak/webservice/`)
- **Shared Database**: All data (users, products, orders, cart) is shared between the APK and web app
- **Firebase Integration**: Uses Firebase for authentication and push notifications
- **Real-time Sync**: Sign up on APK → Login on web (and vice versa)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Forms**: React Hook Form
- **Authentication**: Firebase Auth
- **UI Components**: Custom components matching APK design

## 📁 Project Structure

```
web/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── cart/                # Shopping cart
│   ├── orders/              # Orders list
│   ├── profile/             # User profile
│   ├── stores/              # Stores listing
│   └── favorites/           # Favorites page
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── Header.tsx
│   └── BottomNavigation.tsx
├── lib/                     # Utilities and API
│   ├── api.ts               # Axios instance
│   └── api/
│       ├── auth.ts          # Authentication APIs
│       ├── products.ts      # Product APIs
│       └── cart.ts          # Cart & Order APIs
├── store/                   # Zustand stores
│   ├── authStore.ts         # Authentication state
│   ├── cartStore.ts         # Cart state
│   └── languageStore.ts     # Language/Translations
├── config/
│   └── index.ts             # App configuration
├── .env.local               # Environment variables
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A code editor (VS Code recommended)

### Installation

1. Navigate to the web folder:
```bash
cd C:\Users\XPRISTO\Downloads\Kafak\KafekApp\web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- The `.env.local` file is already configured with the API endpoints
- Update if needed with your backend URLs

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design System

### Colors (Matching APK)
- **Primary**: `#263254` (Dark Blue)
- **Secondary**: `#D1F6F3` (Light Cyan)
- **Accent**: `#F2994A` (Orange)
- **Button**: `#04a431` (Green)
- **Background**: `#EEEEEE` (Light Grey)

### Typography
- Font: System fonts (matching mobile app feel)
- Sizes: Responsive scaling from mobile to desktop

## 📡 API Integration

### Base URLs
- **API**: `https://kaffak.company/kaffak/webservice/`
- **Images**: `https://kaffak.company/kaffak/uploads/images/`

### Key Endpoints
- `login` - User authentication
- `signup` - User registration
- `get_product_list_by_filter` - Get products
- `get_all_store_list` - Get stores
- `get_cart` / `add_to_cart_product` - Cart management
- `place_order` - Create order
- `get_user_order_by_status` - Order history

## 🔐 Authentication Flow

1. User signs up/logs in via web or APK
2. Backend returns user data + token
3. Token stored in localStorage
4. Token sent with every API request
5. Same user account accessible from both platforms

## 🛒 Cart & Orders

- Cart persisted in localStorage
- Sync with backend when user is authenticated
- Same cart visible on APK and web
- Orders stored in shared database
- Real-time order status updates

## 🌍 Multi-language Support

Supported languages:
- **English** (en)
- **Arabic** (ar) - RTL support
- **Urdu** (ur) - RTL support

Language preference persisted across sessions.

## 📱 Responsive Design

- Mobile-first approach
- Bottom navigation (matching APK)
- Tablet and desktop layouts
- Touch-friendly interactions

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Data Models

Key data structures (matching Android app):
- **User**: Profile, authentication, wallet
- **Product**: Items with prices, images, sizes
- **Category**: Product categorization
- **Provider/Store**: Restaurants/shops
- **Order**: Customer orders with status
- **Cart**: Shopping cart items

## 🚧 Future Enhancements

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Real-time chat with providers
- [ ] Payment gateway integration
- [ ] Order tracking with maps
- [ ] Reviews and ratings
- [ ] Promo codes and offers
- [ ] Dark mode
- [ ] PWA support

## 🐛 Known Limitations

- Some APK features may require additional backend endpoints
- Firebase social login needs web-specific implementation
- Some image URLs may need CORS configuration

## 📝 Notes

- This web app uses the **same backend** as the Android APK
- All user data is shared between platforms
- Design and styling match the Android app
- API responses follow the same structure

## 🤝 Support

For issues or questions:
1. Check the API documentation in the main project
2. Review the Android app code for reference
3. Check the database schema in `database-schema.sql`

## 📄 License

This project is part of the Kafek application.

---

**Built with ❤️ using Next.js and TypeScript**
# apk
