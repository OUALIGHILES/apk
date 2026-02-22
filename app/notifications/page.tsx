'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
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
        return <Package className="w-5 h-5" />;
      case 'store':
      case 'provider':
        return <Store className="w-5 h-5" />;
      case 'payment':
      case 'wallet':
        return <DollarSign className="w-5 h-5" />;
      case 'system':
        return <Bell className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
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
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Notifications" />

      <main className="w-full">
        {/* Tabs & Actions */}
        <section className="mt-4 px-4">
          <div className="notif-header">
            <div className="tab-strip">
              <button
                onClick={() => setFilter('all')}
                className={`tab-btn ${filter === 'all' ? 'tab-active' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`tab-btn ${filter === 'unread' ? 'tab-active' : ''}`}
              >
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-btn">
                <CheckCheck className="w-4 h-4" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </section>

        {/* Unread Count Banner */}
        {unreadCount > 0 && (
          <section className="mt-4 px-4">
            <div className="unread-banner">
              <Bell className="w-5 h-5" />
              <span>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
            </div>
          </section>
        )}

        {/* Notifications List */}
        <section className="mt-6 px-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <Bell className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              </p>
              <p className="empty-sub">
                {filter === 'unread'
                  ? "You've read all your notifications"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <div className="notif-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notif-item ${notification.is_read === '0' ? 'notif-unread' : ''}`}
                >
                  <div className={`notif-icon ${notification.is_read === '0' ? 'notif-icon-unread' : ''}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notif-body">
                    <div className="notif-top">
                      <h4 className={`notif-title ${notification.is_read === '0' ? '' : 'notif-read'}`}>
                        {notification.title}
                      </h4>
                      {notification.is_read === '0' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="notif-mark-read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="notif-message">{notification.message}</p>
                    <p className="notif-time">
                      {new Date(notification.date_time).toLocaleString()}
                    </p>
                    {notification.order_id && (
                      <button
                        onClick={() => router.push(`/orders/${notification.order_id}`)}
                        className="notif-action"
                      >
                        View Order <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }
  .loader { width: 40px; height: 40px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Header & Tabs */
  .notif-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .tab-strip { display: flex; gap: 8px; background: var(--surface); padding: 6px; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .tab-btn { flex: 1; padding: 10px 16px; border-radius: 12px; background: transparent; border: none; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; }
  .tab-btn:hover { background: rgba(10,22,40,.04); }
  .tab-active { background: var(--primary); color: #fff; }
  .mark-all-btn { display: flex; align-items: center; gap: 4px; padding: 8px 14px; background: rgba(61,111,255,.08); border: none; border-radius: 100px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--accent); cursor: pointer; transition: all .2s; }
  .mark-all-btn:hover { background: rgba(61,111,255,.15); }

  /* Unread Banner */
  .unread-banner { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: rgba(10,22,40,.06); border: 1.5px solid var(--border); border-radius: var(--radius); font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); }

  /* Notifications List */
  .notif-list { display: flex; flex-direction: column; gap: 10px; }
  .notif-item { display: flex; gap: 14px; padding: 16px; background: var(--surface); border-radius: var(--radius); box-shadow: 0 1px 4px rgba(0,0,0,.05); transition: all .2s; }
  .notif-item:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .notif-unread { border-left: 4px solid var(--primary); }
  .notif-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--bg); color: var(--muted); transition: all .2s; }
  .notif-icon-unread { background: rgba(61,111,255,.12); color: var(--accent); }
  .notif-body { flex: 1; min-width: 0; }
  .notif-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
  .notif-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); }
  .notif-read { color: var(--muted); }
  .notif-mark-read { width: 28px; height: 28px; border-radius: 8px; background: rgba(61,111,255,.08); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: none; cursor: pointer; transition: all .2s; }
  .notif-mark-read:hover { background: rgba(61,111,255,.15); }
  .notif-message { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .notif-time { font-size: 11px; color: var(--muted); font-weight: 500; }
  .notif-action { margin-top: 10px; display: flex; align-items: center; gap: 4px; padding: 8px 14px; background: rgba(10,22,40,.06); border: none; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--primary); cursor: pointer; transition: all .2s; }
  .notif-action:hover { background: rgba(10,22,40,.1); }
`;
