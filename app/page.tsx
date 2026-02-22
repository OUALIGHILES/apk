'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { productsAPI, Product, Category, Provider } from '@/lib/api/products';
import { API_CONFIG } from '@/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  ShoppingBag, MapPin, Clock, Star, Truck, Utensils,
  Sparkles, TrendingUp, Coffee, Pill, Wrench, AlertCircle,
  ChevronRight, Croissant, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const APP_CONFIG = { CURRENCY: 'SAR' };

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsMockMode(process.env.NEXT_PUBLIC_USE_MOCK_API === 'true');
    loadData();
  }, [activeCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsResponse = await productsAPI.getProductList({ cat_id: activeCategory || undefined });
      if (productsResponse.status === 'success') setProducts(productsResponse.result);
      else if (productsResponse.status === 'error') setError(productsResponse.message || 'Failed to load products');
      const storesResponse = await productsAPI.getAllStoreList({});
      if (storesResponse.status === 'success') setStores(storesResponse.result);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to load data';
      setError(msg.includes('database') ? 'The server is experiencing database issues. Please try again.' : msg);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: null, label: 'All', icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'Restaurant', label: 'Restaurant', icon: <Utensils className="w-5 h-5" /> },
    { key: 'Grocery', label: 'Grocery', icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'Pharmacy', label: 'Pharmacy', icon: <Pill className="w-5 h-5" /> },
    { key: 'Services', label: 'Services', icon: <Wrench className="w-5 h-5" /> },
    { key: 'Café', label: 'Café', icon: <Coffee className="w-5 h-5" /> },
    { key: 'Bakery', label: 'Bakery', icon: <Croissant className="w-5 h-5" /> },
  ];

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Kafek" showSearch showCart showNotifications />

      <main className="w-full">

        {/* Mock Banner */}
        {isMockMode && (
          <div className="alert-bar alert-mock mx-4 mt-4">
            <span>🧪</span>
            <div>
              <p className="alert-title">Mock Data Mode</p>
              <p className="alert-sub">Testing with sample data. Backend API is offline.</p>
            </div>
            <button onClick={() => window.location.reload()} className="alert-action">Refresh</button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="alert-bar alert-error mx-4 mt-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="alert-title">Service Unavailable</p>
              <p className="alert-sub">{error}</p>
            </div>
            <button onClick={loadData} className="alert-action"><RefreshCw className="w-4 h-4" /></button>
          </div>
        )}

        {/* ── Hero Slider ── */}
        <section className="mt-4 px-4">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="swiper-hero"
          >
            {[
              { gradient: 'linear-gradient(135deg,#0A1628 0%,#1a3a6b 100%)', icon: <Sparkles className="w-8 h-8" />, title: 'Welcome to Kafek', sub: 'Order food & services from your favorite stores' },
              { gradient: 'linear-gradient(135deg,#FF5C3A 0%,#FF9A3C 100%)', icon: <TrendingUp className="w-8 h-8" />, title: 'Special Offers', sub: 'Get up to 50% off on your first order' },
              { gradient: 'linear-gradient(135deg,#1DB87A 0%,#0A8A58 100%)', icon: <Truck className="w-8 h-8" />, title: 'Fast Delivery', sub: 'Quick and reliable delivery to your doorstep' },
            ].map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="slide-inner" style={{ background: slide.gradient }}>
                  <div className="slide-glow slide-glow-1" />
                  <div className="slide-glow slide-glow-2" />
                  <div className="slide-icon-wrap">{slide.icon}</div>
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-sub">{slide.sub}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* ── Categories ── */}
        <section className="mt-8 px-4">
          <div className="section-row">
            <div>
              <h2 className="section-title">Categories</h2>
              <p className="section-sub">Explore what you need</p>
            </div>
            <Link href="/categories" className="see-all">View All <ChevronRight className="w-4 h-4" /></Link>
          </div>

          <div className="cat-strip">
            {categories.map(({ key, label, icon }) => {
              const active = activeCategory === key;
              return (
                <button key={label} onClick={() => setActiveCategory(key)} className={`cat-btn ${active ? 'cat-active' : ''}`}>
                  <div className="cat-icon">{icon}</div>
                  <span className="cat-label">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Popular Stores ── */}
        <section className="mt-8 px-4">
          <div className="section-row">
            <div>
              <h2 className="section-title">Popular Stores</h2>
              <p className="section-sub">Top-rated stores near you</p>
            </div>
            <Link href="/stores" className="see-all">View All <ChevronRight className="w-4 h-4" /></Link>
          </div>

          <div className="stores-grid">
            {stores.slice(0, 6).map((store) => (
              <Link key={store.id} href={`/stores/${store.id}`} className="store-card">
                <div className="store-img-wrap">
                  <img
                    src={store.store_cover_image || store.provider_logo || '/placeholder-store.jpg'}
                    alt={store.store_name}
                    className="store-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-store.jpg'; }}
                  />
                  <div className="store-scrim" />
                  <div className="store-rating">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {store.avg_rating || '0'}
                  </div>
                  <div className="store-name-overlay">{store.store_name}</div>
                </div>
                <div className="store-footer">
                  <span className="store-cat">{store.cat_name}</span>
                  <div className="store-meta">
                    <span className="meta-chip-sm"><Clock className="w-3 h-3" />{store.open_time}–{store.close_time}</span>
                    <span className="meta-chip-sm"><MapPin className="w-3 h-3" />{store.radius || '5'} km</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular Products ── */}
        <section className="mt-8 px-4 mb-6">
          <div className="section-row">
            <div>
              <h2 className="section-title">Popular Products</h2>
              <p className="section-sub">Best sellers just for you</p>
            </div>
            <Link href="/products" className="see-all">View All <ChevronRight className="w-4 h-4" /></Link>
          </div>

          <div className="products-grid">
            {products.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="product-card">
                <div className="product-img-wrap">
                  <img
                    src={product.product_images?.[0]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                    alt={product.item_name}
                    className="product-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`; }}
                  />
                  {product.offer_item_price && <span className="offer-badge"><Sparkles className="w-3 h-3" />OFFER</span>}
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.item_name}</h3>
                  <div className="product-footer">
                    {product.offer_item_price ? (
                      <div>
                        <span className="price-offer">{product.offer_item_price} SAR</span>
                        <span className="price-old">{product.item_price}</span>
                      </div>
                    ) : (
                      <span className="price-main">{product.item_price} SAR</span>
                    )}
                    <button className="add-btn"><ShoppingBag className="w-4 h-4" /></button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="loader" />
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      )}

      <BottomNavigation />
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

  /* Alerts */
  .alert-bar { display: flex; align-items: center; gap: 12px; border-radius: var(--radius); padding: 14px 16px; }
  .alert-mock { background: #FFFBEB; border: 1px solid #FDE68A; }
  .alert-error { background: #FFF5F5; border: 1px solid #FED7D7; color: #C53030; }
  .alert-title { font-weight: 700; font-size: 13px; font-family: 'Sora',sans-serif; }
  .alert-sub { font-size: 12px; opacity: .75; margin-top: 2px; }
  .alert-action { font-size: 12px; font-weight: 700; padding: 6px 12px; background: rgba(0,0,0,.07); border-radius: 8px; white-space: nowrap; display: flex; align-items: center; gap: 4px; }

  /* Swiper hero */
  .swiper-hero { border-radius: 24px; overflow: hidden; }
  .slide-inner { height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; position: relative; overflow: hidden; }
  .slide-glow { position: absolute; border-radius: 50%; filter: blur(48px); opacity: .25; }
  .slide-glow-1 { width: 150px; height: 150px; background: rgba(255,255,255,.5); top: -30px; left: -30px; }
  .slide-glow-2 { width: 180px; height: 180px; background: rgba(255,255,255,.3); bottom: -40px; right: -40px; }
  .slide-icon-wrap { position: relative; z-index: 1; width: 56px; height: 56px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(8px); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 14px; }
  .slide-title { position: relative; z-index: 1; font-family: 'Sora',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .slide-sub { position: relative; z-index: 1; font-size: 13px; color: rgba(255,255,255,.75); max-width: 260px; }

  /* Section headers */
  .section-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .section-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .see-all { display: flex; align-items: center; gap: 2px; font-family: 'Sora',sans-serif; font-size: 12px; font-weight: 700; color: var(--accent); text-decoration: none; padding-bottom: 2px; }

  /* Categories */
  .cat-strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .cat-strip::-webkit-scrollbar { display: none; }
  .cat-btn { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; border-radius: var(--radius); background: var(--surface); transition: all .2s; box-shadow: 0 1px 4px rgba(0,0,0,.05); min-width: 72px; }
  .cat-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .cat-active { background: var(--primary) !important; }
  .cat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(61,111,255,.08); color: var(--accent); transition: all .2s; }
  .cat-active .cat-icon { background: rgba(255,255,255,.15); color: #fff; }
  .cat-label { font-size: 11px; font-weight: 600; color: var(--muted); white-space: nowrap; font-family: 'Sora',sans-serif; }
  .cat-active .cat-label { color: rgba(255,255,255,.8); }

  /* Stores */
  .stores-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  @media(min-width:640px){ .stores-grid { grid-template-columns: repeat(3,1fr); } }
  @media(min-width:1024px){ .stores-grid { grid-template-columns: repeat(4,1fr); } }
  @media(min-width:1280px){ .stores-grid { grid-template-columns: repeat(5,1fr); } }
  .store-card { background: var(--surface); border-radius: var(--radius); overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.05); text-decoration: none; transition: transform .2s, box-shadow .2s; display: block; }
  .store-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,.1); }
  .store-img-wrap { position: relative; height: 150px; overflow: hidden; }
  .store-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
  .store-card:hover .store-img { transform: scale(1.06); }
  .store-scrim { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(10,22,40,.8) 100%); }
  .store-rating { position: absolute; top: 10px; right: 10px; display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(255,255,255,.95); backdrop-filter: blur(6px); border-radius: 100px; font-size: 12px; font-weight: 700; font-family: 'Sora',sans-serif; }
  .store-name-overlay { position: absolute; bottom: 12px; left: 14px; right: 14px; font-family: 'Sora',sans-serif; font-size: 16px; font-weight: 700; color: #fff; text-shadow: 0 1px 6px rgba(0,0,0,.3); }
  .store-footer { padding: 12px 14px; }
  .store-cat { font-size: 12px; color: var(--muted); display: block; margin-bottom: 8px; }
  .store-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .meta-chip-sm { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: var(--bg); border-radius: 100px; font-size: 11px; font-weight: 500; color: var(--muted); }

  /* Products */
  .products-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  @media(min-width:640px){ .products-grid { grid-template-columns: repeat(3,1fr); } }
  @media(min-width:1024px){ .products-grid { grid-template-columns: repeat(5,1fr); } }
  @media(min-width:1280px){ .products-grid { grid-template-columns: repeat(6,1fr); } }
  .product-card { background: var(--surface); border-radius: var(--radius); overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.05); text-decoration: none; transition: transform .2s, box-shadow .2s; display: block; }
  .product-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,.1); }
  .product-img-wrap { position: relative; height: 140px; overflow: hidden; }
  .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
  .product-card:hover .product-img { transform: scale(1.07); }
  .offer-badge { position: absolute; top: 8px; left: 8px; display: flex; align-items: center; gap: 4px; background: var(--green); color: #fff; font-size: 9px; font-weight: 800; padding: 4px 8px; border-radius: 100px; font-family: 'Sora',sans-serif; letter-spacing: .05em; }
  .product-body { padding: 12px; }
  .product-name { font-family: 'Sora',sans-serif; font-size: 13px; font-weight: 700; color: var(--primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.6em; margin-bottom: 10px; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .price-main { font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 800; color: var(--primary); }
  .price-offer { font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 800; color: var(--green); display: block; }
  .price-old { font-size: 11px; color: var(--muted); text-decoration: line-through; display: block; }
  .add-btn { width: 34px; height: 34px; border-radius: 10px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
  .add-btn:hover { transform: scale(1.1); }
  .add-btn:active { transform: scale(.92); }

  /* Loading overlay */
  .loading-overlay { position: fixed; inset: 0; background: rgba(10,22,40,.6); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .loading-card { background: var(--surface); border-radius: 24px; padding: 32px 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 24px 64px rgba(0,0,0,.3); }
  .loading-text { font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); }

  /* Swiper dot styling */
  .swiper-pagination-bullet { background: rgba(255,255,255,.5) !important; }
  .swiper-pagination-bullet-active { background: #fff !important; }
`;