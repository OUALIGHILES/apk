'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { ordersAPIExtended, OrderDetails } from '@/lib/api/extended';
import { 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Chef,
  User
} from 'lucide-react';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      loadOrderDetails();
    }
  }, [user, params.id]);

  const loadOrderDetails = async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      const data = await ordersAPIExtended.getOrderDetails(params.id as string);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      await ordersAPIExtended.cancelOrder(params.id as string, cancelReason);
      alert('Order cancelled successfully');
      setShowCancelForm(false);
      loadOrderDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'accepted':
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'preparing':
        return <Chef className="w-6 h-6 text-blue-600" />;
      case 'on_way':
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-primary" />;
      case 'delivered':
        return <Package className="w-6 h-6 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-greyunselect" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'accepted':
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'preparing':
        return 'text-blue-600 bg-blue-50';
      case 'on_way':
      case 'out_for_delivery':
        return 'text-primary bg-primary/10';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-greyunselect bg-gray-100';
    }
  };

  const canCancel = order && 
    ['pending', 'accepted', 'confirmed'].includes(order.order_status.toLowerCase());

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Order Details" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Order Details" />
        <Card className="mx-4 mt-8 text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Order Not Found</h3>
          <p className="text-greyunselect mb-6">This order doesn't exist or was removed</p>
          <Button onClick={() => router.push('/orders')}>View My Orders</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Order Details" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Order Status */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary">Order #{order.id}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
              {order.order_status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(order.order_status)}
            <div>
              <p className="font-medium text-primary">
                {order.order_status.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-sm text-greyunselect">
                {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Driver Details (if assigned) */}
        {order.driver_details && (
          <Card className="mb-4">
            <h3 className="font-bold text-primary mb-3 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Delivery Driver
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-primary">
                  {order.driver_details.first_name} {order.driver_details.last_name}
                </p>
                <p className="text-sm text-greyunselect">
                  {order.driver_details.vehicle_type} - {order.driver_details.vehicle_no}
                </p>
              </div>
              <a
                href={`tel:${order.driver_details.mobile}`}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-3 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Order Items
          </h3>
          <div className="space-y-3">
            {order.order_details?.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-primary">{item.item_name}</p>
                  <p className="text-sm text-greyunselect">
                    {item.item_quantity} x {item.item_price} SAR
                  </p>
                </div>
                <p className="font-bold text-button">{item.total_price} SAR</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Delivery Address
          </h3>
          <p className="text-sm text-greyunselect">{order.delivery_address}</p>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-4">
          <h3 className="font-bold text-primary mb-3 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Payment Method</span>
              <span className="font-medium capitalize">{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Subtotal</span>
              <span className="font-medium">
                {(parseFloat(order.total_amount) - parseFloat(order.delivery_fee)).toFixed(2)} SAR
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyunselect">Delivery Fee</span>
              <span className="font-medium">{order.delivery_fee} SAR</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-primary">Total</span>
              <span className="font-bold text-button">{order.total_amount} SAR</span>
            </div>
          </div>
        </Card>

        {/* Cancel Order Button */}
        {canCancel && (
          <Card className="mb-4">
            {!showCancelForm ? (
              <Button
                variant="outline"
                onClick={() => setShowCancelForm(true)}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Cancel Order
              </Button>
            ) : (
              <div className="space-y-3">
                <h3 className="font-bold text-red-600">Cancel Order</h3>
                <p className="text-sm text-greyunselect">
                  Please provide a reason for cancelling this order:
                </p>
                <textarea
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Why do you want to cancel?"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={handleCancelOrder}
                    loading={cancelling}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Confirm Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason('');
                    }}
                    className="flex-1"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Already cancelled */}
        {order.order_status.toLowerCase() === 'cancelled' && (
          <Card className="mb-4 bg-red-50 border-red-200">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-bold text-red-800">Order Cancelled</p>
                <p className="text-sm text-red-600">This order has been cancelled</p>
              </div>
            </div>
          </Card>
        )}
      </main>

      <BottomNavigation activeTab="orders" />
    </div>
  );
}
