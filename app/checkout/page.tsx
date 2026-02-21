'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI } from '@/lib/api/cart';
import { CreditCard, DollarSign, Wallet, MapPin, Loader2, Navigation } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotalAmount, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState({
    address: '',
    lat: '',
    lon: '',
  });
  const [locationError, setLocationError] = useState('');

  const deliveryFee = 10;
  const subtotal = getTotalAmount();
  const total = subtotal + deliveryFee;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Set coordinates
        setAddress(prev => ({
          ...prev,
          lat: latitude.toString(),
          lon: longitude.toString(),
        }));

        // Try to get address from coordinates (reverse geocoding)
        try {
          // Using OpenStreetMap's Nominatim service (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const displayAddress = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setAddress(prev => ({
              ...prev,
              address: displayAddress,
            }));
          } else {
            // Fallback to coordinates
            setAddress(prev => ({
              ...prev,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            }));
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          // Fallback to coordinates
          setAddress(prev => ({
            ...prev,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        }

        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions in your browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('Failed to get location. Please enter address manually.');
        }
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!address.address && orderType === 'delivery') {
      alert('Please enter delivery address');
      return;
    }

    try {
      setLoading(true);

      const response = await ordersAPI.placeOrder({
        user_id: user.id,
        provider_id: items[0]?.provider_id || '',
        cart_id: items[0]?.product_id,
        address_id: '',
        total_amount: total.toString(),
        delivery_fee: deliveryFee.toString(),
        payment_method: paymentMethod,
        order_type: orderType,
        lat: address.lat || '24.7136',
        lon: address.lon || '46.6753',
      });

      if (response.status === 'success') {
        clearCart();
        router.push('/orders');
      } else {
        alert(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Checkout" />
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <h2 className="text-xl font-bold text-primary mb-2">Your cart is empty</h2>
            <p className="text-greyunselect mb-6">Add items before checkout</p>
            <Button onClick={() => router.push('/')}>Start Shopping</Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-40">
      <Header title="Checkout" />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Order Type */}
        <Card className="mt-4">
          <h3 className="font-bold text-primary mb-3">Order Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOrderType('delivery')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                orderType === 'delivery'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Delivery</div>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                orderType === 'pickup'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Pickup</div>
            </button>
          </div>
        </Card>

        {/* Delivery Address */}
        {orderType === 'delivery' && (
          <Card className="mt-4">
            <h3 className="font-bold text-primary mb-3">Delivery Address</h3>
            <Input
              label="Address"
              placeholder="Enter your delivery address"
              value={address.address}
              onChange={(e) => {
                setAddress({ ...address, address: e.target.value });
                setLocationError('');
              }}
              icon={<MapPin className="w-5 h-5" />}
            />
            
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="mt-3 flex items-center space-x-2 text-button font-medium text-sm hover:text-green-700 transition-colors disabled:opacity-50"
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Getting your location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>+ Use Current Location</span>
                </>
              )}
            </button>

            {locationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
            )}

            {address.lat && address.lon && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium">✓ Location captured</p>
                <p className="text-xs text-green-600">Coordinates: {address.lat}, {address.lon}</p>
              </div>
            )}
          </Card>
        )}

        {/* Payment Method */}
        <Card className="mt-4">
          <h3 className="font-bold text-primary mb-3">Payment Method</h3>
          <div className="space-y-2">
            <label
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                paymentMethod === 'cash'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="w-4 h-4 text-primary"
              />
            </label>

            <label
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                paymentMethod === 'card'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Card</span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="w-4 h-4 text-primary"
              />
            </label>

            <label
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                paymentMethod === 'wallet'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Wallet</span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="w-4 h-4 text-primary"
              />
            </label>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="mt-4">
          <h3 className="font-bold text-primary mb-3">Order Summary</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-greyunselect">
                  {item.product_name} x {item.quantity}
                </span>
                <span className="font-medium">{item.total_amount.toFixed(2)} SAR</span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-greyunselect">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-greyunselect">Delivery Fee</span>
                <span className="font-medium">{deliveryFee.toFixed(2)} SAR</span>
              </div>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-primary">Total</span>
              <span className="font-bold text-button">{total.toFixed(2)} SAR</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-greyunselect">Total Amount</p>
            <p className="text-xl font-bold text-button">{total.toFixed(2)} SAR</p>
          </div>
          <Button 
            onClick={handlePlaceOrder} 
            size="lg" 
            loading={loading}
            disabled={orderType === 'delivery' && !address.address}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
