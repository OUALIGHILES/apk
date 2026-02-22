'use client';

import Link from 'next/link';
import { Search, Bell, ShoppingCart, Coffee } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
}

export default function Header({
  title = 'Kafek',
  showSearch = false,
  showCart = false,
  showNotifications = false,
}: HeaderProps) {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{css}</style>
      <header className={`kafek-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <div className="logo-icon-wrap">
              <Coffee className="w-5 h-5 logo-icon" />
            </div>
            <span className="logo-text">{title}</span>
          </Link>

          {/* Actions */}
          <div className="header-actions">
            {showSearch && (
              <Link href="/search" className="hdr-btn" aria-label="Search">
                <Search className="w-5 h-5" />
              </Link>
            )}

            {showNotifications && (
              <Link href="/notifications" className="hdr-btn" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="notif-dot" />
              </Link>
            )}

            {showCart && (
              <Link href="/cart" className="hdr-btn hdr-btn-cart" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </Link>
            )}

            {!user && (
              <Link href="/login" className="login-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');

  .kafek-header {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    background: #0A1628;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: box-shadow .3s, background .3s;
  }

  .header-scrolled {
    background: rgba(10, 22, 40, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    width: 100%;
  }

  /* Logo */
  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    transition: opacity .2s;
  }
  .header-logo:hover { opacity: .85; }

  .logo-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-icon { color: #3D6FFF; }

  .logo-text {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  /* Action buttons */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .hdr-btn {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    transition: background .2s, color .2s, transform .15s;
    text-decoration: none;
  }
  .hdr-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    transform: scale(1.06);
  }
  .hdr-btn:active { transform: scale(.93); }

  /* Notification dot */
  .notif-dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 7px;
    height: 7px;
    background: #FF5C3A;
    border-radius: 50%;
    border: 1.5px solid #0A1628;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .7; transform: scale(1.3); }
  }

  /* Cart badge */
  .hdr-btn-cart { color: rgba(255,255,255,.7); }
  .cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: #FF5C3A;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    font-family: 'Sora', sans-serif;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #0A1628;
    line-height: 1;
  }

  /* Login button */
  .login-btn {
    margin-left: 6px;
    padding: 8px 18px;
    background: #3D6FFF;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 16px rgba(61, 111, 255, 0.35);
  }
  .login-btn:hover {
    background: #5585ff;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(61, 111, 255, 0.5);
  }
  .login-btn:active { transform: scale(.96); }
`;