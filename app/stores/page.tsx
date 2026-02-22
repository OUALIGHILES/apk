'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { productsAPI, Provider } from '@/lib/api/products';
import { MapPin, Clock, Star, ShoppingBag, Search } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function StoresPage() {
  const [stores, setStores] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAllStoreList({});
      if (response.status === 'success') {
        setStores(response.result);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(stores.map((s) => s.cat_name))).filter(Boolean);

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.cat_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || store.cat_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Stores" showSearch />

      <main className="w-full">
        {/* Search Bar */}
        <section className="mt-4 px-4">
          <div className="search-wrap">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Category Filter */}
        <section className="mt-4 px-4">
          <div className="cat-scroll">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`cat-chip ${!selectedCategory ? 'cat-active' : ''}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`cat-chip ${selectedCategory === category ? 'cat-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Stores Grid */}
        <section className="mt-6 px-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Loading stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <ShoppingBag className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">No stores found</p>
              <p className="empty-sub">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div>
              <div className="section-row">
                <div>
                  <h2 className="section-title">All Stores</h2>
                  <p className="section-sub">{filteredStores.length} stores available</p>
                </div>
              </div>
              <div className="stores-grid">
                {filteredStores.map((store) => (
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
                      <div className="store-status-badge">
                        {store.store_ope_closs_status === 'open' ? (
                          <span className="status-open">Open</span>
                        ) : (
                          <span className="status-closed">Closed</span>
                        )}
                      </div>
                      <div className="store-rating">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {store.avg_rating || '0'}
                      </div>
                      <div className="store-name-overlay">{store.store_name}</div>
                    </div>
                    <div className="store-footer">
                      <span className="store-cat">{store.cat_name}</span>
                      <div className="store-meta">
                        <span className="meta-chip">
                          <Clock className="w-3 h-3" />
                          {store.open_time || '09:00'}–{store.close_time || '23:00'}
                        </span>
                        <span className="meta-chip">
                          <MapPin className="w-3 h-3" />
                          {store.radius || '5'} km
                        </span>
                      </div>
                      {store.delivery_option && (
                        <div className="store-delivery">
                          {store.delivery_option === 'both' ? 'Delivery & Pickup' : store.delivery_option}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Search */
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); }
  .search-input { width: 100%; padding: 14px 16px 14px 48px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 16px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }

  /* Category Chips */
  .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .cat-scroll::-webkit-scrollbar { display: none; }
  .cat-chip { flex-shrink: 0; padding: 10px 18px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 100px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; white-space: nowrap; }
  .cat-chip:hover { border-color: rgba(61,111,255,.4); }
  .cat-active { background: var(--primary); border-color: var(--primary); color: #fff; }

  /* Section headers */
  .section-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .section-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

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
  .store-status-badge { position: absolute; top: 10px; left: 10px; }
  .status-open { padding: 4px 10px; background: var(--green); color: #fff; font-size: 10px; font-weight: 700; border-radius: 100px; font-family: 'Sora', sans-serif; letter-spacing: .05em; }
  .status-closed { padding: 4px 10px; background: var(--accent2); color: #fff; font-size: 10px; font-weight: 700; border-radius: 100px; font-family: 'Sora', sans-serif; letter-spacing: .05em; }
  .store-rating { position: absolute; top: 10px; right: 10px; display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(255,255,255,.95); backdrop-filter: blur(6px); border-radius: 100px; font-size: 12px; font-weight: 700; font-family: 'Sora',sans-serif; }
  .store-name-overlay { position: absolute; bottom: 12px; left: 14px; right: 14px; font-family: 'Sora',sans-serif; font-size: 16px; font-weight: 700; color: #fff; text-shadow: 0 1px 6px rgba(0,0,0,.3); }
  .store-footer { padding: 12px 14px; }
  .store-cat { font-size: 12px; color: var(--muted); display: block; margin-bottom: 8px; }
  .store-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
  .meta-chip { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: var(--bg); border-radius: 100px; font-size: 11px; font-weight: 500; color: var(--muted); }
  .store-delivery { font-size: 11px; font-weight: 600; color: var(--primary); padding: 6px 10px; background: rgba(10,22,40,.06); border-radius: 8px; display: inline-block; font-family: 'Sora', sans-serif; }
`;
