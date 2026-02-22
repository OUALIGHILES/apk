'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI } from '@/lib/api/cart';
import { CreditCard, DollarSign, Wallet, MapPin, Loader2, Navigation, Check, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState({ address: '', lat: '', lon: '' });
  const [locationError, setLocationError] = useState('');

  const deliveryFee = 10;
  const subtotal = getTotalAmount();
  const total = subtotal + deliveryFee;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { setLocationError('Geolocation not supported'); return; }
    setGettingLocation(true); setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setAddress(p => ({ ...p, lat: latitude.toString(), lon: longitude.toString() }));
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
          const d = r.ok ? await r.json() : null;
          setAddress(p => ({ ...p, address: d?.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        } catch { setAddress(p => ({ ...p, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` })); }
        setGettingLocation(false);
      },
      (e) => { setGettingLocation(false); setLocationError({ 1: 'Location access denied.', 2: 'Location unavailable.', 3: 'Request timed out.' }[e.code] || 'Failed to get location.'); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/login'); return; }
    if (!address.address && orderType === 'delivery') { alert('Please enter a delivery address'); return; }
    try {
      setLoading(true);
      const response = await ordersAPI.placeOrder({ user_id: user.id, provider_id: items[0]?.provider_id || '', cart_id: items[0]?.product_id, address_id: '', total_amount: total.toString(), delivery_fee: deliveryFee.toString(), payment_method: paymentMethod, order_type: orderType, lat: address.lat || '24.7136', lon: address.lon || '46.6753' });
      if (response.status === 'success') { clearCart(); router.push('/orders'); }
      else alert(response.message || 'Failed to place order');
    } catch (error: any) { alert(error.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="page-root">
        <style>{css}</style>
        <Header title="Checkout" />
        <div className="empty-full">
          <ShoppingBag className="w-12 h-12 opacity-15 mb-4" />
          <p className="empty-title">Your cart is empty</p>
          <p className="empty-sub">Add items before checkout</p>
          <button onClick={() => router.push('/')} className="pill-btn mt-6">Start Shopping</button>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { id: 'cash', label: 'Cash on Delivery', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <div className="page-root pb-36">
      <style>{css}</style>
      <Header title="Checkout" />
      <main className="body-wrap">
        {/* Order Type */}
        <div className="section-card">
          <p className="section-label">Order Type</p>
          <div className="type-grid">
            {(['delivery', 'pickup'] as const).map((type) => (
              <button key={type} onClick={() => setOrderType(type)} className={`type-btn ${orderType === type ? 'type-active' : ''}`}>
                {type === 'delivery' ? <MapPin className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                <span>{type === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                {orderType === type && <span className="type-check"><Check className="w-3 h-3" /></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        {orderType === 'delivery' && (
          <div className="section-card">
            <p className="section-label">Delivery Address</p>
            <div className="input-wrap">
              <MapPin className="input-icon" />
              <input className="addr-input" placeholder="Enter your delivery address" value={address.address} onChange={(e) => { setAddress({ ...address, address: e.target.value }); setLocationError(''); }} />
            </div>
            <button onClick={getCurrentLocation} disabled={gettingLocation} className="locate-btn">
              {gettingLocation ? <><Loader2 className="w-4 h-4 animate-spin" />Getting location...</> : <><Navigation className="w-4 h-4" />Use Current Location</>}
            </button>
            {locationError && <p className="loc-error">{locationError}</p>}
            {address.lat && address.lon && (
              <div className="loc-success"><Check className="w-3.5 h-3.5" /><span>Location captured · {parseFloat(address.lat).toFixed(4)}, {parseFloat(address.lon).toFixed(4)}</span></div>
            )}
          </div>
        )}

        {/* Payment */}
        <div className="section-card">
          <p className="section-label">Payment Method</p>
          <div className="payment-list">
            {paymentOptions.map((opt) => (
              <button key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`payment-row ${paymentMethod === opt.id ? 'payment-active' : ''}`}>
                <span className={`payment-icon ${paymentMethod === opt.id ? 'payment-icon-active' : ''}`}>{opt.icon}</span>
                <span className="payment-label-text">{opt.label}</span>
                <span className={`radio ${paymentMethod === opt.id ? 'radio-active' : ''}`}>{paymentMethod === opt.id && <span className="radio-dot" />}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="section-card">
          <p className="section-label">Order Summary</p>
          <div className="sum-list">
            {items.map((item) => (
              <div key={item.product_id} className="sum-item">
                <span className="sum-item-name">{item.product_name} <span className="sum-qty">×{item.quantity}</span></span>
                <span className="sum-item-price">{item.total_amount.toFixed(2)} SAR</span>
              </div>
            ))}
            <div className="sum-divider" />
            <div className="sum-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} SAR</span></div>
            <div className="sum-row"><span>Delivery Fee</span><span>{deliveryFee.toFixed(2)} SAR</span></div>
            <div className="sum-row sum-total"><span>Total</span><span>{total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </main>

      <div className="cta-bar">
        <div className="cta-info">
          <span className="cta-sublabel">Total Amount</span>
          <span className="cta-amount">{total.toFixed(2)} SAR</span>
        </div>
        <button onClick={handlePlaceOrder} disabled={loading || (orderType === 'delivery' && !address.address)} className="cta-btn">
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
  :root{--bg:#F7F6F2;--surface:#FFFFFF;--primary:#0A1628;--accent:#3D6FFF;--accent2:#FF5C3A;--green:#1DB87A;--muted:#8B8FA8;--border:#ECEDF2;--radius:20px;font-family:'DM Sans',sans-serif}
  .page-root{min-height:100vh;background:var(--bg)}
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;cursor:pointer;border:none;display:inline-block;margin-top:24px}
  .body-wrap{padding:16px;display:flex;flex-direction:column;gap:12px}
  .section-card{background:var(--surface);border-radius:var(--radius);padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .section-label{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:block}
  .type-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .type-btn{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 12px;border-radius:16px;border:1.5px solid var(--border);background:#FAFAFA;color:var(--muted);font-family:'Sora',sans-serif;font-size:13px;font-weight:600;transition:all .2s;cursor:pointer}
  .type-btn:hover{border-color:rgba(61,111,255,.4)}
  .type-active{border-color:var(--accent);background:rgba(61,111,255,.06);color:var(--accent)}
  .type-check{position:absolute;top:8px;right:8px;width:18px;height:18px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff}
  .input-wrap{position:relative;margin-bottom:10px}
  .input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--muted)}
  .addr-input{width:100%;padding:12px 14px 12px 42px;border:1.5px solid var(--border);border-radius:14px;background:var(--bg);font-size:14px;color:var(--primary);outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s}
  .addr-input:focus{border-color:var(--accent)}
  .addr-input::placeholder{color:var(--muted)}
  .locate-btn{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--accent);font-family:'Sora',sans-serif;cursor:pointer}
  .locate-btn:disabled{opacity:.5}
  .loc-error{margin-top:10px;padding:10px 14px;background:rgba(255,92,58,.08);border:1px solid rgba(255,92,58,.2);border-radius:12px;font-size:12px;color:var(--accent2)}
  .loc-success{margin-top:10px;display:flex;align-items:center;gap:6px;padding:8px 12px;background:rgba(29,184,122,.08);border:1px solid rgba(29,184,122,.2);border-radius:12px;font-size:12px;color:var(--green);font-weight:500}
  .payment-list{display:flex;flex-direction:column;gap:8px}
  .payment-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:1.5px solid var(--border);background:#FAFAFA;text-align:left;transition:all .2s;cursor:pointer;width:100%}
  .payment-row:hover{border-color:rgba(61,111,255,.35)}
  .payment-active{border-color:var(--accent);background:rgba(61,111,255,.05)}
  .payment-icon{width:38px;height:38px;border-radius:11px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;color:var(--muted);flex-shrink:0;transition:all .2s}
  .payment-icon-active{background:rgba(61,111,255,.12);color:var(--accent)}
  .payment-label-text{flex:1;font-size:14px;font-weight:600;color:var(--primary);font-family:'Sora',sans-serif}
  .radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .15s}
  .radio-active{border-color:var(--accent)}
  .radio-dot{width:9px;height:9px;border-radius:50%;background:var(--accent)}
  .sum-list{display:flex;flex-direction:column;gap:10px}
  .sum-item{display:flex;justify-content:space-between;align-items:baseline}
  .sum-item-name{font-size:13px;color:var(--primary);font-weight:500}
  .sum-qty{color:var(--muted);font-weight:400}
  .sum-item-price{font-size:13px;font-weight:600;color:var(--primary)}
  .sum-divider{height:1px;background:var(--border);margin:2px 0}
  .sum-row{display:flex;justify-content:space-between;font-size:13px;color:var(--muted)}
  .sum-row span:last-child{font-weight:600;color:var(--primary)}
  .sum-total{padding-top:10px;border-top:1px solid var(--border);font-family:'Sora',sans-serif;font-weight:800!important}
  .sum-total span{font-size:16px!important;color:var(--primary)!important}
  .sum-total span:last-child{font-size:20px!important}
  .cta-bar{position:fixed;bottom:0;left:0;right:0;padding:14px 16px 24px;background:rgba(247,246,242,.96);backdrop-filter:blur(12px);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;z-index:50}
  .cta-info{display:flex;flex-direction:column}
  .cta-sublabel{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
  .cta-amount{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:var(--primary)}
  .cta-btn{padding:14px 28px;background:var(--primary);color:#fff;border-radius:16px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;box-shadow:0 8px 28px rgba(10,22,40,.3);transition:all .2s;white-space:nowrap;cursor:pointer}
  .cta-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 12px 36px rgba(10,22,40,.4)}
  .cta-btn:active{transform:scale(.97)}
  .cta-btn:disabled{opacity:.45}
`;