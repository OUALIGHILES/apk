'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Heart, ShoppingBag, Star, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allStores, setAllStores] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, favorites]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [productsResponse, storesResponse] = await Promise.all([
        productsAPI.getProductList({}),
        productsAPI.getAllStoreList({}),
      ]);

      if (productsResponse.status === 'success') {
        setAllProducts(productsResponse.result);
      }
      if (storesResponse.status === 'success') {
        setAllStores(storesResponse.result);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const favoriteProducts = allProducts.filter(p =>
    favorites.some(f => f.id === p.id && f.type === 'product')
  );

  const favoriteStores = allStores.filter(s =>
    favorites.some(f => f.id === s.id && f.type === 'store')
  );

  if (!user) {
    return (
      <div className="page-root pb-24">
        <style>{css}</style>
        <Header title="Favorites" />
        <div className="empty-full">
          <div className="empty-icon-wrap">
            <Heart className="w-10 h-10 empty-icon" />
          </div>
          <p className="empty-title">Please Login</p>
          <p className="empty-sub">Login to view your favorites</p>
          <Link href="/login" className="pill-btn mt-6">Login</Link>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Favorites" />

      <main className="w-full">
        {/* Tabs */}
        <section className="mt-4 px-4">
          <div className="tab-strip">
            <button
              onClick={() => setActiveTab('products')}
              className={`tab-btn ${activeTab === 'products' ? 'tab-active' : ''}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
              {activeTab === 'products' && <span className="tab-indicator" />}
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`tab-btn ${activeTab === 'stores' ? 'tab-active' : ''}`}
            >
              <Heart className="w-4 h-4" />
              <span>Stores</span>
              {activeTab === 'stores' && <span className="tab-indicator" />}
            </button>
          </div>
        </section>

        {/* Content */}
        <section className="mt-6 px-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Loading favorites...</p>
            </div>
          ) : activeTab === 'products' ? (
            favoriteProducts.length === 0 ? (
              <div className="empty-full">
                <div className="empty-icon-wrap">
                  <Heart className="w-10 h-10 empty-icon" />
                </div>
                <p className="empty-title">No favorite products</p>
                <p className="empty-sub">Start adding products to your favorites</p>
                <Link href="/" className="pill-btn mt-6">Browse Products</Link>
              </div>
            ) : (
              <div>
                <div className="section-row">
                  <div>
                    <h2 className="section-title">Favorite Products</h2>
                    <p className="section-sub">{favoriteProducts.length} items</p>
                  </div>
                </div>
                <div className="products-grid">
                  {favoriteProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="product-card">
                      <div className="product-img-wrap">
                        <img
                          src={product.product_images?.[0]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                          alt={product.item_name}
                          className="product-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
                          }}
                        />
                        {product.offer_item_price && (
                          <span className="offer-badge">
                            <Sparkles className="w-3 h-3" />OFFER
                          </span>
                        )}
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
                          <button className="fav-btn-active">
                            <Heart className="w-4 h-4 fill-white" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ) : (
            favoriteStores.length === 0 ? (
              <div className="empty-full">
                <div className="empty-icon-wrap">
                  <Heart className="w-10 h-10 empty-icon" />
                </div>
                <p className="empty-title">No favorite stores</p>
                <p className="empty-sub">Start following your favorite stores</p>
                <Link href="/stores" className="pill-btn mt-6">Browse Stores</Link>
              </div>
            ) : (
              <div>
                <div className="section-row">
                  <div>
                    <h2 className="section-title">Favorite Stores</h2>
                    <p className="section-sub">{favoriteStores.length} stores</p>
                  </div>
                </div>
                <div className="stores-grid">
                  {favoriteStores.map((store) => (
                    <Link key={store.id} href={`/stores/${store.id}`} className="store-card">
                      <div className="store-img-wrap">
                        <img
                          src={store.store_cover_image || store.provider_logo || '/placeholder-store.jpg'}
                          alt={store.store_name}
                          className="store-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-store.jpg';
                          }}
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
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </section>
      </main>

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

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;text-decoration:none;display:inline-block}

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Tabs */
  .tab-strip { display: flex; gap: 10px; background: var(--surface); padding: 6px; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border-radius: 12px; background: transparent; border: none; color: var(--muted); font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; position: relative; }
  .tab-btn:hover { background: rgba(10,22,40,.04); }
  .tab-active { background: var(--primary); color: #fff; }
  .tab-indicator { position: absolute; bottom: 4px; width: 4px; height: 4px; background: rgba(255,255,255,.6); border-radius: 50%; }

  /* Section headers */
  .section-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .section-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* Products */
  .products-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  @media(min-width:640px){ .products-grid { grid-template-columns: repeat(3,1fr); } }
  @media(min-width:1024px){ .products-grid { grid-template-columns: repeat(4,1fr); } }
  @media(min-width:1280px){ .products-grid { grid-template-columns: repeat(5,1fr); } }
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
  .fav-btn-active { width: 34px; height: 34px; border-radius: 10px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
  .fav-btn-active:hover { transform: scale(1.1); }
  .fav-btn-active:active { transform: scale(.92); }

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
  .store-cat { font-size: 12px; color: var(--muted); display: block; }
`;
