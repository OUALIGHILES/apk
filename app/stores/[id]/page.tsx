'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { useFavoritesStore } from '@/store/favoritesStore';
import {
  MapPin, Star, Clock, Phone, Share2, Heart,
  ChevronRight, Utensils, ShoppingBag, Award, Zap, Shield, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function StoreDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [store, setStore] = useState<Provider | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toggleStoreFavorite, isStoreFavorite } = useFavoritesStore();

  useEffect(() => {
    if (params.id) loadStoreDetails();
  }, [params.id]);

  const loadStoreDetails = async () => {
    try {
      setLoading(true);
      const storesResponse = await productsAPI.getAllStoreList({});
      if (storesResponse.status === 'success') {
        const foundStore = storesResponse.result.find(s => s.id === params.id);
        if (foundStore) {
          setStore(foundStore);
          setIsFavorite(foundStore.is_favorite === '1');
        }
      }
      const productsResponse = await productsAPI.getProductList({ provider_id: params.id as string });
      if (productsResponse.status === 'success') setProducts(productsResponse.result);
    } catch (error) {
      console.error('Error loading store details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!store) return;
    const wasFavorite = isStoreFavorite(store.id);
    toggleStoreFavorite(store.id);
    setIsFavorite(!wasFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: store?.store_name, text: `Check out ${store?.store_name} on Kafek!`, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const handleCall = () => { window.location.href = `tel:+966500000000`; };

  const handleViewMenu = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <style>{css}</style>
        <div className="loader" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
        <style>{css}</style>
        <Utensils className="w-16 h-16 opacity-20" />
        <p className="text-xl font-semibold opacity-40">Store not found</p>
        <Link href="/stores" className="pill-btn">Browse Stores</Link>
      </div>
    );
  }

  const isOpen = store.store_ope_closs_status === 'open';

  return (
    <div className="page-root pb-36">
      <style>{css}</style>

      {/* ── Hero ── */}
      <div className="hero-wrap">
        {store.store_cover_image
          ? <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${store.store_cover_image}`} alt={store.store_name} className="hero-img" />
          : <div className="hero-placeholder"><Utensils className="w-20 h-20 text-white/10" /></div>
        }
        <div className="hero-scrim" />

        {/* topbar */}
        <div className="hero-topbar">
          <button onClick={() => router.back()} className="icon-btn"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="icon-btn"><Share2 className="w-5 h-5" /></button>
            <button onClick={handleToggleFavorite} className={`icon-btn ${isFavorite ? 'fav-active' : ''}`}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* status */}
        <div className={`status-badge ${isOpen ? 'status-open' : 'status-closed'}`}>
          <Zap className="w-3.5 h-3.5 fill-white" />
          {isOpen ? 'Open Now' : 'Closed'}
        </div>

        {/* store identity block */}
        <div className="hero-content">
          <div className="store-logo-wrap">
            {store.provider_logo
              ? <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${store.provider_logo}`} alt={store.store_name} className="store-logo" />
              : <div className="store-logo store-logo-placeholder"><Utensils className="w-8 h-8 text-white/60" /></div>
            }
          </div>
          <div>
            <h1 className="hero-title">{store.store_name}</h1>
            <div className="hero-meta">
              <span className="meta-chip"><Utensils className="w-3 h-3" />{store.cat_name}</span>
              <span className="meta-chip"><MapPin className="w-3 h-3" />{store.radius} km</span>
              {store.avg_rating && (
                <span className="meta-chip">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {store.avg_rating}
                  <span className="opacity-50 text-xs">({store.total_rating_count})</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="body-wrap">

        {/* description */}
        {(store.description || store.about_store) && (
          <div className="section-card">
            <p className="section-body">{store.description || store.about_store}</p>
          </div>
        )}

        {/* trust badges */}
        <div className="badges-row">
          {[
            { icon: <Shield className="w-5 h-5" />, label: 'Quality' },
            { icon: <Zap className="w-5 h-5" />, label: 'Fast Delivery' },
            { icon: <Award className="w-5 h-5" />, label: 'Top Rated' },
          ].map(({ icon, label }) => (
            <div key={label} className="badge-item">
              <div className="badge-icon">{icon}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* store info */}
        <div className="info-card">
          <div className="info-header">Store Information</div>
          <div className="info-list">
            <div className="info-row">
              <div className="info-icon"><Clock className="w-4 h-4" /></div>
              <div>
                <span className="info-label">Hours</span>
                <span className="info-value">{store.open_time} – {store.close_time}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><Utensils className="w-4 h-4" /></div>
              <div>
                <span className="info-label">Category</span>
                <span className="info-value">{store.cat_name}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><ShoppingBag className="w-4 h-4" /></div>
              <div>
                <span className="info-label">Delivery</span>
                <span className="info-value capitalize">{store.delivery_option}</span>
              </div>
            </div>
          </div>
        </div>

        {/* products */}
        <div id="products-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Menu</h2>
              <p className="section-sub">{products.length} items available</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <Utensils className="w-10 h-10 opacity-20 mb-3" />
              <p className="font-semibold opacity-40">No products yet</p>
            </div>
          ) : (
            <div className="product-list">
              {products.map((product) =>
                product.id ? (
                  <Link key={product.id} href={`/products/${product.id}`} className="product-row">
                    {product.product_images?.[0]?.image_url && (
                      <div className="product-img-wrap">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.product_images[0].image_url}`}
                          alt={product.item_name}
                          className="product-img"
                        />
                        {product.offer_item_price && <span className="offer-dot">OFFER</span>}
                      </div>
                    )}
                    <div className="product-info">
                      <h4 className="product-name">{product.item_name}</h4>
                      <p className="product-desc">{product.short_description || product.item_description || ''}</p>
                      <div className="product-footer">
                        <div>
                          {product.offer_item_price ? (
                            <span className="product-price-offer">
                              {product.offer_item_price} SAR
                              <span className="product-price-old">{product.item_price}</span>
                            </span>
                          ) : (
                            <span className="product-price">{product.item_price} SAR</span>
                          )}
                        </div>
                        {product.avg_rating && (
                          <span className="product-rating">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {product.avg_rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-30" />
                  </Link>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CTA Bar ── */}
      <div className="cta-bar">
        <button onClick={handleCall} className="cta-btn cta-secondary">
          <Phone className="w-5 h-5" /> Call
        </button>
        <button onClick={handleViewMenu} className="cta-btn cta-primary">
          <ShoppingBag className="w-5 h-5" /> View Menu
        </button>
      </div>

      <BottomNavigation activeTab="stores" />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }
  .loader { width: 48px; height: 48px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pill-btn { padding: 12px 28px; background: var(--primary); color: #fff; border-radius: 100px; font-weight: 600; font-family: 'Sora',sans-serif; text-decoration: none; }

  /* Hero */
  .hero-wrap { position: relative; height: 380px; overflow: hidden; border-radius: 0 0 32px 32px; }
  .hero-img { width: 100%; height: 100%; object-fit: cover; }
  .hero-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg,#0A1628,#1a3a6b); display: flex; align-items: center; justify-content: center; }
  .hero-scrim { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,22,40,.4) 0%, transparent 35%, rgba(10,22,40,.9) 100%); }
  .hero-topbar { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 52px 20px 16px; }
  .icon-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.18); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.25); border-radius: 50%; color: #fff; transition: background .2s, transform .15s; }
  .icon-btn:hover { background: rgba(255,255,255,.3); transform: scale(1.08); }
  .icon-btn:active { transform: scale(.94); }
  .fav-active { background: var(--accent2) !important; border-color: var(--accent2) !important; }
  .status-badge { position: absolute; top: 112px; right: 20px; display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; font-family: 'Sora',sans-serif; color: #fff; }
  .status-open { background: var(--green); }
  .status-closed { background: var(--accent2); }
  .hero-content { position: absolute; bottom: 24px; left: 0; right: 0; padding: 0 20px; display: flex; align-items: flex-end; gap: 16px; }
  .store-logo-wrap { flex-shrink: 0; }
  .store-logo { width: 72px; height: 72px; border-radius: 18px; border: 3px solid rgba(255,255,255,.3); object-fit: cover; }
  .store-logo-placeholder { width: 72px; height: 72px; border-radius: 18px; border: 3px solid rgba(255,255,255,.15); background: rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; }
  .hero-title { font-family: 'Sora',sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; text-shadow: 0 2px 12px rgba(0,0,0,.3); }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 6px; }
  .meta-chip { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(255,255,255,.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.15); border-radius: 100px; color: #fff; font-size: 12px; font-weight: 500; }

  /* Body */
  .body-wrap { padding: 20px 16px 0; display: flex; flex-direction: column; gap: 12px; }
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-body { font-size: 14px; line-height: 1.7; color: var(--muted); }

  /* Badges */
  .badges-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--surface); border-radius: var(--radius-sm); padding: 14px 8px; font-size: 11px; font-weight: 500; color: var(--muted); text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .badge-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(61,111,255,.08); border-radius: 10px; color: var(--accent); }

  /* Info card */
  .info-card { background: var(--surface); border-radius: var(--radius); overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .info-header { background: var(--primary); padding: 14px 20px; font-family: 'Sora',sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: rgba(255,255,255,.55); }
  .info-list { padding: 4px 0; }
  .info-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .info-row:last-child { border-bottom: none; }
  .info-icon { width: 36px; height: 36px; background: rgba(61,111,255,.07); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .info-label { display: block; font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 2px; }
  .info-value { display: block; font-size: 14px; font-weight: 600; color: var(--primary); font-family: 'Sora',sans-serif; }

  /* Products */
  .section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .section-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .section-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .empty-state { background: var(--surface); border-radius: var(--radius); padding: 48px 20px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .product-list { display: flex; flex-direction: column; gap: 10px; }
  .product-row { display: flex; align-items: center; gap: 14px; background: var(--surface); border-radius: var(--radius); padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.05); text-decoration: none; transition: transform .15s, box-shadow .15s; }
  .product-row:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .product-img-wrap { position: relative; flex-shrink: 0; }
  .product-img { width: 76px; height: 76px; border-radius: 14px; object-fit: cover; }
  .offer-dot { position: absolute; top: 6px; left: 6px; background: var(--green); color: #fff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 100px; font-family: 'Sora',sans-serif; letter-spacing: .05em; }
  .product-info { flex: 1; min-width: 0; }
  .product-name { font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Sora',sans-serif; font-size: 16px; font-weight: 800; color: var(--primary); }
  .product-price-offer { font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 800; color: var(--green); display: flex; align-items: baseline; gap: 6px; }
  .product-price-old { font-size: 11px; font-weight: 400; color: var(--muted); text-decoration: line-through; }
  .product-rating { display: flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; color: var(--primary); }

  /* CTA */
  .cta-bar { position: fixed; bottom: 72px; left: 0; right: 0; padding: 0 16px; z-index: 50; display: flex; gap: 10px; }
  .cta-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; border-radius: 18px; font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 700; transition: all .2s; }
  .cta-btn:active { transform: scale(.97); }
  .cta-secondary { background: var(--surface); color: var(--primary); box-shadow: 0 4px 16px rgba(0,0,0,.1); flex: 0.6; }
  .cta-secondary:hover { box-shadow: 0 8px 24px rgba(0,0,0,.15); transform: translateY(-1px); }
  .cta-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 32px rgba(10,22,40,.35); flex: 1.4; }
  .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(10,22,40,.45); }
`;