'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Receipt, User, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/stores', icon: ShoppingBag, label: 'Stores' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/orders', icon: Receipt, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <>
      <style>{css}</style>
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'nav-active' : ''}`}
              >
                <div className="nav-icon-wrap">
                  <Icon className="nav-icon" strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.href === '/stores' && itemCount > 0 && (
                    <span className="nav-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                  )}
                  {isActive && <span className="nav-glow" />}
                </div>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&display=swap');

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(10, 22, 40, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding: 8px 0 env(safe-area-inset-bottom, 8px);
  }

  .bottom-nav-inner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0 8px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 16px;
    text-decoration: none;
    transition: transform .18s;
    position: relative;
    flex: 1;
  }
  .nav-item:active { transform: scale(.9); }

  .nav-icon-wrap {
    position: relative;
    width: 42px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: background .2s;
  }

  .nav-active .nav-icon-wrap {
    background: rgba(61, 111, 255, 0.15);
  }

  .nav-icon {
    width: 22px;
    height: 22px;
    color: rgba(255, 255, 255, 0.35);
    transition: color .2s, transform .2s;
  }

  .nav-active .nav-icon {
    color: #3D6FFF;
    transform: translateY(-1px);
  }

  /* Active glow behind icon */
  .nav-glow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: radial-gradient(ellipse at center, rgba(61,111,255,0.25) 0%, transparent 70%);
    pointer-events: none;
  }

  .nav-label {
    font-family: 'Sora', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.3);
    transition: color .2s;
    letter-spacing: .01em;
  }

  .nav-active .nav-label {
    color: #3D6FFF;
  }

  /* Badge */
  .nav-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    background: #FF5C3A;
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    font-family: 'Sora', sans-serif;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #0A1628;
    line-height: 1;
  }

  /* Active indicator bar at top */
  .nav-active::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background: #3D6FFF;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 0 10px rgba(61,111,255,0.6);
  }
`;