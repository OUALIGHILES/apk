'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { notificationsAPI, Notification } from '@/lib/api/extended';
import { Bell, Mail, Package, Store, DollarSign, AlertCircle, Check, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await notificationsAPI.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead(user?.id || '');
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order':
        return <Package className="w-5 h-5 text-primary" />;
      case 'store':
      case 'provider':
        return <Store className="w-5 h-5 text-orange-500" />;
      case 'payment':
      case 'wallet':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Mail className="w-5 h-5 text-greyunselect" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.is_read === '0')
    : notifications;

  const unreadCount = notifications.filter(n => n.is_read === '0').length;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Notifications" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect hover:bg-gray-100'
              }`}
            >
              Unread
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center text-sm text-primary hover:text-primary/80"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications Count */}
        {unreadCount > 0 && (
          <Card className="mb-4 bg-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">
              {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
            </h3>
            <p className="text-greyunselect">
              {filter === 'unread' 
                ? "You've read all your notifications" 
                : "You don't have any notifications yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${
                  notification.is_read === '0'
                    ? 'bg-white border-l-4 border-l-primary shadow-md'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.is_read === '0' ? 'bg-primary/10' : 'bg-gray-200'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-bold text-primary mb-1 ${
                          notification.is_read === '0' ? '' : 'text-greyunselect'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-greyunselect line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-greyunselect mt-2">
                          {new Date(notification.date_time).toLocaleString()}
                        </p>
                      </div>
                      {notification.is_read === '0' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-full"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {/* Click to navigate if order notification */}
                    {notification.order_id && (
                      <button
                        onClick={() => router.push(`/orders/${notification.order_id}`)}
                        className="mt-2 text-sm text-button font-medium hover:underline"
                      >
                        View Order →
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
