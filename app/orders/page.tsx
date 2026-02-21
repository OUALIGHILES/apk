'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ordersAPI, Order } from '@/lib/api/cart';
import { useAuthStore } from '@/store/authStore';
import { Clock, CheckCircle, Package, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'Current' | 'Past'>('Current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders(user!.id, activeTab);
      if (response.status === 'success') {
        setOrders(response.result);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'accepted':
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-screenback pb-20">
        <Header title="My Orders" />
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <h2 className="text-xl font-bold text-primary mb-2">Please Login</h2>
            <p className="text-greyunselect mb-6">Login to view your orders</p>
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
          </Card>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="My Orders" />
      
      <main className="max-w-screen-xl mx-auto">
        {/* Tabs */}
        <div className="flex px-4 mt-4 space-x-2">
          <button
            onClick={() => setActiveTab('Current')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'Current'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect'
            }`}
          >
            Current Orders
          </button>
          <button
            onClick={() => setActiveTab('Past')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'Past'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect'
            }`}
          >
            Past Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-greyunselect mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12">
              <h3 className="text-lg font-bold text-primary mb-2">No orders found</h3>
              <p className="text-greyunselect">
                {activeTab === 'Current'
                  ? "You don't have any current orders"
                  : "You don't have any past orders"}
              </p>
              {activeTab === 'Current' && (
                <Link href="/">
                  <Button className="mt-4">Start Shopping</Button>
                </Link>
              )}
            </Card>
          ) : (
            orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-greyunselect">Order ID</p>
                      <p className="font-bold text-primary">{order.order_id}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center text-sm text-greyunselect">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.address}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-greyunselect">Date & Time</span>
                      <span className="font-medium text-primary">
                        {order.date} {order.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-greyunselect">Total Amount</span>
                      <span className="font-bold text-button">
                        {order.total_amount} SAR
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
