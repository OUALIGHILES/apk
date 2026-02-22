'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { ordersAPI, Order } from '@/lib/api/cart';
import { useAuthStore } from '@/store/authStore';
import { Clock, CheckCircle, Package, MapPin, XCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'Current' | 'Past'>('Current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders(user!.id, activeTab);
      if (response.status === 'success') setOrders(response.result);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMeta = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':   return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'accepted':
      case 'preparing': return { color: '#3D6FFF', bg: 'rgba(61,111,255,0.12)', icon: <Package className="w-3.5 h-3.5" /> };
      case 'completed':
      case 'delivered': return { color: '#1DB87A', bg: 'rgba(29,184,122,0.12)', icon: <CheckCircle className="w-3.5 h-3.5" /> };
      case 'cancelled':
      case 'rejected':  return { color: '#FF5C3A', bg: 'rgba(255,92,58,0.12)', icon: <XCircle className="w-3.5 h-3.5" /> };
      default:          return { color: '#8B8FA8', bg: 'rgba(139,143,168,0.12)', icon: <Clock className="w-3.5 h-3.5" /> };
    }
  };

  if (!user) {
    return (
      <div className="page-root pb-24">
        <style>{css}</style>
        <Header title="My Orders" />
        <div className="empty-state-full">
          <ShoppingBag className="w-14 h-14 opacity-15 mb-4" />
          <p className="empty-title">Please Login</p>
          <p className="empty-sub">Login to view your orders</p>
          <Link href="/login" className="pill-btn mt-6">Login</Link>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="My Orders" />

      <main className="w-full">
        {/* Tabs */}
        <div className="tabs-wrap">
          <div className="tabs-inner">
            {(['Current', 'Past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'tab-active' : ''}`}
              >
                {tab} Orders
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        <div className="orders-body">
          {loading ? (
            <div className="loader-wrap">
              <div className="loader" />
              <p className="loader-text">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package className="w-12 h-12 opacity-15 mb-3" />
              <p className="empty-title">No orders found</p>
              <p className="empty-sub">
                {activeTab === 'Current' ? "You don't have any current orders" : "You don't have any past orders"}
              </p>
              {activeTab === 'Current' && (
                <Link href="/" className="pill-btn mt-5">Start Shopping</Link>
              )}
            </div>
          ) : (
            <div className="order-list">
              {orders.map((order) => {
                const meta = getStatusMeta(order.status);
                return (
                  <Link key={order.id} href={`/orders/${order.id}`} className="order-card">
                    {/* header row */}
                    <div className="order-card-top">
                      <div>
                        <span className="order-id-label">Order</span>
                        <span className="order-id">#{order.order_id}</span>
                      </div>
                      <span
                        className="status-pill"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {meta.icon}
                        {order.status}
                      </span>
                    </div>

                    {/* details */}
                    <div className="order-card-body">
                      <div className="order-row">
                        <MapPin className="w-3.5 h-3.5 order-row-icon" />
                        <span className="order-row-text order-address">{order.address}</span>
                      </div>
                      <div className="order-row">
                        <Clock className="w-3.5 h-3.5 order-row-icon" />
                        <span className="order-row-text">{order.date} · {order.time}</span>
                      </div>
                    </div>

                    {/* footer */}
                    <div className="order-card-footer">
                      <span className="order-total">{order.total_amount} SAR</span>
                      <span className="order-cta">
                        View Details <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }

  /* Tabs */
  .tabs-wrap { padding: 16px 16px 0; }
  .tabs-inner { display: flex; gap: 8px; background: var(--surface); border-radius: 16px; padding: 5px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .tab-btn { flex: 1; padding: 10px 16px; border-radius: 12px; font-family: 'Sora',sans-serif; font-size: 13px; font-weight: 700; color: var(--muted); transition: all .2s; }
  .tab-active { background: var(--primary); color: #fff; box-shadow: 0 4px 12px rgba(10,22,40,.25); }

  /* Body */
  .orders-body { padding: 16px; }

  /* Loader */
  .loader-wrap { display: flex; flex-direction: column; align-items: center; padding: 64px 0; gap: 14px; }
  .loader { width: 40px; height: 40px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loader-text { font-size: 13px; color: var(--muted); }

  /* Empty */
  .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px 24px; background: var(--surface); border-radius: var(--radius); }
  .empty-state-full { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 24px; }
  .empty-title { font-family: 'Sora',sans-serif; font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; color: var(--muted); text-align: center; }
  .pill-btn { padding: 12px 28px; background: var(--primary); color: #fff; border-radius: 100px; font-family: 'Sora',sans-serif; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; }

  /* Order list */
  .order-list { display: flex; flex-direction: column; gap: 10px; }
  .order-card { display: block; background: var(--surface); border-radius: var(--radius); padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,.05); text-decoration: none; transition: transform .15s, box-shadow .15s; border: 1px solid transparent; }
  .order-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.09); border-color: var(--border); }

  .order-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .order-id-label { display: block; font-size: 10px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .order-id { font-family: 'Sora',sans-serif; font-size: 16px; font-weight: 800; color: var(--primary); }

  .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 100px; font-family: 'Sora',sans-serif; font-size: 11px; font-weight: 700; text-transform: capitalize; letter-spacing: .01em; }

  .order-card-body { display: flex; flex-direction: column; gap: 7px; padding: 12px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .order-row { display: flex; align-items: flex-start; gap: 8px; }
  .order-row-icon { color: var(--muted); flex-shrink: 0; margin-top: 1px; }
  .order-row-text { font-size: 13px; color: var(--muted); line-height: 1.45; }
  .order-address { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }

  .order-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .order-total { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .order-cta { display: flex; align-items: center; gap: 2px; font-family: 'Sora',sans-serif; font-size: 12px; font-weight: 700; color: var(--accent); }
`;