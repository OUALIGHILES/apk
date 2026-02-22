'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();
  const [loading, setLoading] = useState(false);

  const deliveryFee = 10;
  const subtotal = getTotalAmount();
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    if (!user) { router.push('/login'); return; }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page-root pb-24">
        <style>{css}</style>
        <Header title="Cart" />
        <div className="empty-full">
          <div className="empty-icon-wrap"><ShoppingBag className="w-10 h-10 empty-icon" /></div>
          <p className="empty-title">Your cart is empty</p>
          <p className="empty-sub">Add items to get started</p>
          <Link href="/" className="pill-btn mt-6">Start Shopping</Link>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="page-root pb-36">
      <style>{css}</style>
      <Header title="Cart" />
      <main className="body-wrap">
        <div className="items-list">
          {items.map((item) => (
            <div key={item.product_id} className="cart-item">
              <img src={`${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`} alt={item.product_name} className="cart-item-img" />
              <div className="cart-item-body">
                <div className="cart-item-top">
                  <div>
                    <p className="cart-item-name">{item.product_name}</p>
                    {item.size_name && <p className="cart-item-size">Size: {item.size_name}</p>}
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="remove-btn"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="cart-item-bottom">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="w-3.5 h-3.5" /></button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className="cart-item-price">{item.total_amount.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-card">
          <p className="summary-title">Order Summary</p>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} SAR</span></div>
            <div className="summary-row"><span>Delivery Fee</span><span>{deliveryFee.toFixed(2)} SAR</span></div>
            <div className="summary-row summary-total"><span>Total</span><span>{total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </main>
      <div className="cta-bar">
        <div className="cta-info">
          <span className="cta-label">Total</span>
          <span className="cta-amount">{total.toFixed(2)} SAR</span>
        </div>
        <button onClick={handleCheckout} disabled={loading} className="cta-btn">{loading ? 'Loading...' : 'Checkout'}</button>
      </div>
      <BottomNavigation />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
  :root{--bg:#F7F6F2;--surface:#FFFFFF;--primary:#0A1628;--accent:#3D6FFF;--accent2:#FF5C3A;--green:#1DB87A;--muted:#8B8FA8;--border:#ECEDF2;--radius:20px;--radius-sm:12px;font-family:'DM Sans',sans-serif}
  .page-root{min-height:100vh;background:var(--bg)}
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;text-decoration:none;display:inline-block}
  .body-wrap{padding:16px;display:flex;flex-direction:column;gap:12px}
  .items-list{display:flex;flex-direction:column;gap:10px}
  .cart-item{display:flex;background:var(--surface);border-radius:var(--radius);overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .cart-item-img{width:96px;height:96px;object-fit:cover;flex-shrink:0}
  .cart-item-body{flex:1;padding:12px 14px;display:flex;flex-direction:column;justify-content:space-between}
  .cart-item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
  .cart-item-name{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--primary);margin-bottom:3px}
  .cart-item-size{font-size:12px;color:var(--muted)}
  .remove-btn{width:30px;height:30px;border-radius:9px;background:rgba(255,92,58,.08);color:var(--accent2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
  .remove-btn:hover{background:rgba(255,92,58,.15)}
  .cart-item-bottom{display:flex;align-items:center;justify-content:space-between}
  .qty-control{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:10px;padding:4px 10px}
  .qty-btn{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:var(--primary);border-radius:7px;transition:background .15s}
  .qty-btn:hover:not(:disabled){background:rgba(10,22,40,.08)}
  .qty-btn:disabled{opacity:.3}
  .qty-num{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:var(--primary);min-width:20px;text-align:center}
  .cart-item-price{font-family:'Sora',sans-serif;font-size:15px;font-weight:800;color:var(--primary)}
  .summary-card{background:var(--surface);border-radius:var(--radius);padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .summary-title{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
  .summary-rows{display:flex;flex-direction:column;gap:10px}
  .summary-row{display:flex;justify-content:space-between;font-size:13px;color:var(--muted)}
  .summary-row span:last-child{font-weight:600;color:var(--primary)}
  .summary-total{padding-top:12px;border-top:1px solid var(--border);font-family:'Sora',sans-serif;font-weight:800!important}
  .summary-total span{font-size:16px!important;color:var(--primary)!important}
  .summary-total span:last-child{font-size:20px!important}
  .cta-bar{position:fixed;bottom:68px;left:0;right:0;padding:12px 16px;background:rgba(247,246,242,.96);backdrop-filter:blur(12px);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;z-index:40}
  .cta-info{display:flex;flex-direction:column}
  .cta-label{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
  .cta-amount{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:var(--primary)}
  .cta-btn{padding:14px 32px;background:var(--primary);color:#fff;border-radius:16px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;box-shadow:0 8px 28px rgba(10,22,40,.3);transition:all .2s;white-space:nowrap}
  .cta-btn:hover{transform:translateY(-1px);box-shadow:0 12px 36px rgba(10,22,40,.4)}
  .cta-btn:active{transform:scale(.97)}
  .cta-btn:disabled{opacity:.6}
`;