'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Receipt, User, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/stores', icon: ShoppingBag, label: 'Stores' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/orders', icon: Receipt, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg
                transition-colors relative
                ${isActive ? 'text-primary' : 'text-greyunselect'}
              `}
            >
              <Icon className="w-6 h-6" />
              {item.href === '/' && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
