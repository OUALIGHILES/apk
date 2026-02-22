'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { Search, Filter, MapPin, Star, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { API_CONFIG } from '@/config';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'products' | 'stores'>('products');
  const [results, setResults] = useState<(Product | Provider)[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);

      if (searchType === 'products') {
        const response = await productsAPI.getProductList({
          search: searchQuery,
          cat_id: filters.category || undefined,
        });
        if (response.status === 'success') {
          setResults(response.result);
        }
      } else {
        const response = await productsAPI.getAllStoreList({
          search: searchQuery,
        });
        if (response.status === 'success') {
          setResults(response.result);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="Search" />

      <main className="w-full">
        {/* Search Bar */}
        <section className="mt-4 px-4">
          <div className="search-wrap">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={searchType === 'products' ? "Search products..." : "Search stores..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="search-clear">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Type Toggle */}
          <div className="tab-strip">
            <button
              onClick={() => setSearchType('products')}
              className={`tab-btn ${searchType === 'products' ? 'tab-active' : ''}`}
            >
              <Search className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setSearchType('stores')}
              className={`tab-btn ${searchType === 'stores' ? 'tab-active' : ''}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Stores</span>
            </button>
          </div>

          {/* Filter Toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-grid">
                <div className="filter-field">
                  <label className="filter-label">Category</label>
                  <input
                    type="text"
                    placeholder="All categories"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="filter-input"
                  />
                </div>
                <div className="filter-field">
                  <label className="filter-label">Max Price</label>
                  <input
                    type="number"
                    placeholder="SAR"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="filter-input"
                  />
                </div>
                <div className="filter-field">
                  <label className="filter-label">Min Rating</label>
                  <input
                    type="number"
                    placeholder="1-5"
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    className="filter-input"
                  />
                </div>
              </div>
              <button onClick={handleSearch} className="apply-filter-btn">
                Apply Filters
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <section className="mt-6 px-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Searching...</p>
            </div>
          ) : !hasSearched ? (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <Search className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">Search Anything</p>
              <p className="empty-sub">Find products from your favorite stores</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <Search className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">No Results Found</p>
              <p className="empty-sub">Try different keywords or adjust your filters</p>
            </div>
          ) : (
            <div>
              <div className="section-row">
                <div>
                  <h2 className="section-title">
                    {searchType === 'products' ? 'Products' : 'Stores'}
                  </h2>
                  <p className="section-sub">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
                </div>
              </div>
              {searchType === 'products' ? (
                <div className="products-grid">
                  {results.map((product) => (
                    <Link key={(product as Product).id} href={`/products/${(product as Product).id}`} className="product-card">
                      <div className="product-img-wrap">
                        <img
                          src={(product as Product).product_images?.[0]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                          alt={(product as Product).item_name}
                          className="product-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
                          }}
                        />
                        {(product as Product).offer_item_price && (
                          <span className="offer-badge">
                            <Sparkles className="w-3 h-3" />OFFER
                          </span>
                        )}
                      </div>
                      <div className="product-body">
                        <h3 className="product-name">{(product as Product).item_name}</h3>
                        <p className="product-store">{(product as Product).provider_details?.store_name}</p>
                        <div className="product-footer">
                          {(product as Product).offer_item_price ? (
                            <div>
                              <span className="price-offer">{(product as Product).offer_item_price} SAR</span>
                              <span className="price-old">{(product as Product).item_price}</span>
                            </div>
                          ) : (
                            <span className="price-main">{(product as Product).item_price} SAR</span>
                          )}
                          {(product as Product).avg_rating && (
                            <div className="product-rating">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {(product as Product).avg_rating}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="stores-grid">
                  {results.map((store) => (
                    <Link key={(store as Provider).id} href={`/stores/${(store as Provider).id}`} className="store-card">
                      <div className="store-img-wrap">
                        <img
                          src={(store as Provider).store_cover_image || (store as Provider).provider_logo || '/placeholder-store.jpg'}
                          alt={(store as Provider).store_name}
                          className="store-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-store.jpg';
                          }}
                        />
                        <div className="store-scrim" />
                        <div className="store-rating">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {(store as Provider).avg_rating || '0'}
                        </div>
                        <div className="store-name-overlay">{(store as Provider).store_name}</div>
                      </div>
                      <div className="store-footer">
                        <span className="store-cat">{(store as Provider).cat_name}</span>
                        <div className="store-meta">
                          <span className="meta-chip-sm">
                            <MapPin className="w-3 h-3" />{(store as Provider).radius || '5'} km
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation activeTab="stores" />
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
  .search-wrap { position: relative; margin-bottom: 12px; }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); }
  .search-input { width: 100%; padding: 14px 16px 14px 48px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 16px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }
  .search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; background: var(--bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); border: none; cursor: pointer; transition: all .2s; }
  .search-clear:hover { background: rgba(10,22,40,.1); color: var(--primary); }

  /* Tabs */
  .tab-strip { display: flex; gap: 8px; background: var(--surface); padding: 6px; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); margin-bottom: 12px; }
  .tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 16px; border-radius: 12px; background: transparent; border: none; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s; }
  .tab-btn:hover { background: rgba(10,22,40,.04); }
  .tab-active { background: var(--primary); color: #fff; }

  /* Filter Toggle */
  .filter-toggle { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: rgba(61,111,255,.08); border: none; border-radius: 100px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--accent); cursor: pointer; transition: all .2s; margin-bottom: 12px; }
  .filter-toggle:hover { background: rgba(61,111,255,.15); }

  /* Filter Panel */
  .filter-panel { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px; margin-top: 12px; }
  .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .filter-field { display: flex; flex-direction: column; gap: 6px; }
  .filter-label { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
  .filter-input { padding: 10px 12px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .filter-input:focus { border-color: var(--accent); }
  .filter-input::placeholder { color: var(--muted); }
  .apply-filter-btn { width: 100%; margin-top: 14px; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .apply-filter-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,22,40,.15); }

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
  .product-name { font-family: 'Sora',sans-serif; font-size: 13px; font-weight: 700; color: var(--primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.6em; margin-bottom: 4px; }
  .product-store { font-size: 11px; color: var(--muted); margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .price-main { font-family: 'Sora',sans-serif; font-size: 15px; font-weight: 800; color: var(--primary); }
  .price-offer { font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 800; color: var(--green); display: block; }
  .price-old { font-size: 11px; color: var(--muted); text-decoration: line-through; display: block; }
  .product-rating { display: flex; align-items: center; gap: 3px; padding: 4px 8px; background: var(--bg); border-radius: 8px; font-size: 11px; font-weight: 600; color: var(--primary); font-family: 'Sora', sans-serif; }

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
  .store-meta { display: flex; gap: 6px; flex-wrap: wrap; }
  .meta-chip-sm { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: var(--bg); border-radius: 100px; font-size: 11px; font-weight: 500; color: var(--muted); }
`;
