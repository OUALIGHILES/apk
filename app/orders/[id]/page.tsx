'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuthStore } from '@/store/authStore';
import { ordersAPIExtended, OrderDetails } from '@/lib/api/extended';
import {
  Package, Clock, MapPin, Phone, CreditCard,
  CheckCircle, XCircle, AlertCircle, Truck, User, ChefHat,
  ArrowLeft
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
    if (user && params.id) loadOrderDetails();
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
    if (!cancelReason.trim()) { alert('Please provide a reason for cancellation'); return; }
    try {
      setCancelling(true);
      await ordersAPIExtended.cancelOrder(params.id as string, cancelReason);
      setShowCancelForm(false);
      loadOrderDetails();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusMeta = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
      case 'pending':             return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: <Clock className="w-5 h-5" />, label: 'Pending' };
      case 'accepted':
      case 'confirmed':           return { color: '#1DB87A', bg: 'rgba(29,184,122,0.12)', icon: <CheckCircle className="w-5 h-5" />, label: 'Confirmed' };
      case 'preparing':           return { color: '#3D6FFF', bg: 'rgba(61,111,255,0.12)', icon: <ChefHat className="w-5 h-5" />, label: 'Preparing' };
      case 'on_way':
      case 'out_for_delivery':    return { color: '#3D6FFF', bg: 'rgba(61,111,255,0.12)', icon: <Truck className="w-5 h-5" />, label: 'On the way' };
      case 'delivered':           return { color: '#1DB87A', bg: 'rgba(29,184,122,0.12)', icon: <Package className="w-5 h-5" />, label: 'Delivered' };
      case 'cancelled':           return { color: '#FF5C3A', bg: 'rgba(255,92,58,0.12)', icon: <XCircle className="w-5 h-5" />, label: 'Cancelled' };
      default:                    return { color: '#8B8FA8', bg: 'rgba(139,143,168,0.12)', icon: <Package className="w-5 h-5" />, label: status };
    }
  };

  const canCancel = order && order.order_status && ['pending', 'accepted', 'confirmed'].includes(order.order_status.toLowerCase());

  if (!user) { router.push('/login'); return null; }

  if (loading) {
    return (
      <div className="page-root flex items-center justify-center">
        <style>{css}</style>
        <div className="loader" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-root">
        <style>{css}</style>
        <Header title="Order Details" />
        <div className="empty-state-full">
          <AlertCircle className="w-14 h-14 opacity-15 mb-4" />
          <p className="empty-title">Order Not Found</p>
          <p className="empty-sub">This order doesn't exist or was removed</p>
          <button onClick={() => router.push('/orders')} className="pill-btn mt-6">View My Orders</button>
        </div>
      </div>
    );
  }

  const meta = getStatusMeta(order.order_status);
  const subtotal = (parseFloat(order.total_amount) - parseFloat(order.delivery_fee)).toFixed(2);

  return (
    <div className="page-root pb-28">
      <style>{css}</style>
      <Header title="Order Details" />

      <main className="body-wrap">

        {/* ── Status Hero ── */}
        <div className="status-hero" style={{ background: `linear-gradient(135deg, #0A1628 0%, #142240 100%)` }}>
          <div className="status-hero-glow" style={{ background: meta.color }} />
          <div className="status-icon-wrap" style={{ color: meta.color, background: meta.bg }}>
            {meta.icon}
          </div>
          <div>
            <p className="status-hero-label">Order #{order.id}</p>
            <p className="status-hero-title" style={{ color: meta.color }}>{meta.label}</p>
            <p className="status-hero-date">{new Date(order.order_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        {/* ── Driver ── */}
        {order.driver_details && (
          <div className="section-card">
            <div className="section-header"><Truck className="w-4 h-4" /><span>Delivery Driver</span></div>
            <div className="driver-row">
              <div className="driver-avatar"><User className="w-5 h-5" /></div>
              <div className="driver-info">
                <span className="driver-name">{order.driver_details.first_name} {order.driver_details.last_name}</span>
                <span className="driver-sub">{order.driver_details.vehicle_type} · {order.driver_details.vehicle_no}</span>
              </div>
              <a href={`tel:${order.driver_details.mobile}`} className="call-btn">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}

        {/* ── Items ── */}
        <div className="section-card">
          <div className="section-header"><Package className="w-4 h-4" /><span>Order Items</span></div>
          <div className="items-list">
            {order.order_details?.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-qty">{item.item_quantity}×</div>
                <span className="item-name">{item.item_name}</span>
                <span className="item-price">{item.total_price} SAR</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Address ── */}
        <div className="section-card">
          <div className="section-header"><MapPin className="w-4 h-4" /><span>Delivery Address</span></div>
          <p className="address-text">{order.delivery_address}</p>
        </div>

        {/* ── Payment ── */}
        <div className="section-card">
          <div className="section-header"><CreditCard className="w-4 h-4" /><span>Payment Details</span></div>
          <div className="payment-list">
            <div className="payment-row">
              <span className="payment-label">Payment Method</span>
              <span className="payment-value capitalize">{order.payment_method}</span>
            </div>
            <div className="payment-row">
              <span className="payment-label">Subtotal</span>
              <span className="payment-value">{subtotal} SAR</span>
            </div>
            <div className="payment-row">
              <span className="payment-label">Delivery Fee</span>
              <span className="payment-value">{order.delivery_fee} SAR</span>
            </div>
            <div className="payment-row payment-total">
              <span>Total</span>
              <span className="total-amount">{order.total_amount} SAR</span>
            </div>
          </div>
        </div>

        {/* ── Cancel ── */}
        {canCancel && (
          <div className="section-card">
            {!showCancelForm ? (
              <button onClick={() => setShowCancelForm(true)} className="cancel-trigger">
                <XCircle className="w-4 h-4" /> Cancel Order
              </button>
            ) : (
              <div className="cancel-form">
                <p className="cancel-form-title">Cancel Order</p>
                <p className="cancel-form-sub">Please provide a reason:</p>
                <textarea
                  className="cancel-textarea"
                  rows={3}
                  placeholder="Why do you want to cancel?"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="cancel-actions">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="confirm-cancel-btn"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                  <button
                    onClick={() => { setShowCancelForm(false); setCancelReason(''); }}
                    className="go-back-btn"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Already cancelled ── */}
        {order.order_status && order.order_status.toLowerCase() === 'cancelled' && (
          <div className="cancelled-banner">
            <XCircle className="w-5 h-5" />
            <div>
              <p className="cancelled-title">Order Cancelled</p>
              <p className="cancelled-sub">This order has been cancelled</p>
            </div>
          </div>
        )}

      </main>

      <BottomNavigation activeTab="orders" />
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
  .loader { width: 44px; height: 44px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty */
  .empty-state-full { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; padding: 24px; }
  .empty-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; color: var(--muted); }
  .pill-btn { padding: 12px 28px; background: var(--primary); color: #fff; border-radius: 100px; font-family: 'Sora',sans-serif; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; cursor: pointer; border: none; }

  /* Body */
  .body-wrap { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

  /* Status hero */
  .status-hero { position: relative; border-radius: var(--radius); padding: 24px 22px; display: flex; align-items: center; gap: 18px; overflow: hidden; }
  .status-hero-glow { position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; border-radius: 50%; filter: blur(50px); opacity: .18; pointer-events: none; }
  .status-icon-wrap { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .status-hero-label { font-size: 11px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 3px; font-family: 'Sora',sans-serif; }
  .status-hero-title { font-family: 'Sora',sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .status-hero-date { font-size: 12px; color: rgba(255,255,255,.45); }

  /* Section cards */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-header { display: flex; align-items: center; gap: 7px; font-family: 'Sora',sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }

  /* Driver */
  .driver-row { display: flex; align-items: center; gap: 12px; }
  .driver-avatar { width: 46px; height: 46px; border-radius: 14px; background: rgba(61,111,255,.08); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .driver-info { flex: 1; }
  .driver-name { display: block; font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 3px; }
  .driver-sub { font-size: 12px; color: var(--muted); }
  .call-btn { width: 42px; height: 42px; border-radius: 14px; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
  .call-btn:hover { transform: scale(1.08); }

  /* Items */
  .items-list { display: flex; flex-direction: column; gap: 10px; }
  .item-row { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .item-row:last-child { border-bottom: none; padding-bottom: 0; }
  .item-qty { width: 28px; height: 28px; border-radius: 8px; background: rgba(61,111,255,.08); color: var(--accent); font-family: 'Sora',sans-serif; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .item-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--primary); }
  .item-price { font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); }

  /* Address */
  .address-text { font-size: 14px; line-height: 1.6; color: var(--muted); }

  /* Payment */
  .payment-list { display: flex; flex-direction: column; gap: 10px; }
  .payment-row { display: flex; align-items: center; justify-content: space-between; }
  .payment-label { font-size: 13px; color: var(--muted); }
  .payment-value { font-size: 13px; font-weight: 600; color: var(--primary); }
  .payment-total { padding-top: 12px; border-top: 1px solid var(--border); font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 700; color: var(--primary); }
  .total-amount { font-family: 'Sora',sans-serif; font-size: 20px; font-weight: 800; color: var(--primary); }

  /* Cancel */
  .cancel-trigger { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; border-radius: 14px; border: 1.5px dashed rgba(255,92,58,.4); color: var(--accent2); font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; transition: all .15s; }
  .cancel-trigger:hover { background: rgba(255,92,58,.05); border-style: solid; }
  .cancel-form-title { font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 700; color: var(--accent2); margin-bottom: 4px; }
  .cancel-form-sub { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
  .cancel-textarea { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 14px; font-family: 'DM Sans',sans-serif; font-size: 14px; color: var(--primary); background: var(--bg); outline: none; resize: none; transition: border-color .15s; }
  .cancel-textarea:focus { border-color: var(--accent); }
  .cancel-actions { display: flex; gap: 10px; margin-top: 12px; }
  .confirm-cancel-btn { flex: 1; padding: 13px; border-radius: 14px; background: var(--accent2); color: #fff; font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; transition: all .15s; }
  .confirm-cancel-btn:hover { background: #e54a2e; }
  .confirm-cancel-btn:disabled { opacity: .6; }
  .go-back-btn { flex: 1; padding: 13px; border-radius: 14px; background: var(--bg); color: var(--primary); font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; border: 1.5px solid var(--border); transition: all .15s; }
  .go-back-btn:hover { background: #ECEDF2; }

  /* Cancelled banner */
  .cancelled-banner { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: rgba(255,92,58,.08); border: 1px solid rgba(255,92,58,.2); border-radius: var(--radius); color: var(--accent2); }
  .cancelled-title { font-family: 'Sora',sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 2px; }
  .cancelled-sub { font-size: 12px; opacity: .75; }
`;