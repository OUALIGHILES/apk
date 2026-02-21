'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();
  const [loading, setLoading] = useState(false);

  const deliveryFee = 10;
  const total = getTotalAmount() + (items.length > 0 ? deliveryFee : 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Navigate to checkout page
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-screenback pb-20">
        <Header title="Cart" />
        
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <div className="text-greyunselect mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Your cart is empty</h2>
            <p className="text-greyunselect mb-6">Add items to get started</p>
            <Link href="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </Card>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-40">
      <Header title="Cart" />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.product_id} padding="none" className="overflow-hidden">
              <div className="flex">
                <img
                  src={`${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-3">
                  <h3 className="font-medium text-primary">{item.product_name}</h3>
                  {item.size_name && (
                    <p className="text-sm text-greyunselect">Size: {item.size_name}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3 flex justify-between items-center">
                <span className="text-sm text-greyunselect">Item Total:</span>
                <span className="font-bold text-button">
                  {item.total_amount.toFixed(2)} SAR
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="mt-6">
          <h3 className="font-bold text-primary mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Subtotal</span>
              <span className="font-medium">{getTotalAmount().toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Delivery Fee</span>
              <span className="font-medium">{deliveryFee.toFixed(2)} SAR</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-primary">Total</span>
              <span className="font-bold text-button">{total.toFixed(2)} SAR</span>
            </div>
          </div>
        </Card>

        {/* Checkout Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t shadow-lg">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-greyunselect">Total Amount</p>
              <p className="text-xl font-bold text-button">{total.toFixed(2)} SAR</p>
            </div>
            <Button onClick={handleCheckout} size="lg" loading={loading}>
              Checkout
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
