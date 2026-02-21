'use client';

import Link from 'next/link';
import { Search, Bell, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
}

export default function Header({
  title = 'Kafek',
  showSearch = false,
  showCart = false,
  showNotifications = false,
}: HeaderProps) {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 bg-primary text-white z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-xl font-bold">
              {title}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <Link href="/search" className="p-2 hover:bg-white/10 rounded-full">
                <Search className="w-5 h-5" />
              </Link>
            )}
            
            {showNotifications && (
              <Link href="/notifications" className="p-2 hover:bg-white/10 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            )}
            
            {showCart && (
              <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}
            
            {!user && (
              <Link
                href="/login"
                className="px-4 py-2 bg-button rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
