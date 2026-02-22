'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { productsAPI, Product } from '@/lib/api/products';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import {
  ShoppingBag, Minus, Plus, Star, Heart, Share2,
  Info, Check, Truck, Shield, Award, ChevronRight, ArrowLeft
} from 'lucide-react';
import { API_CONFIG } from '@/config';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { toggleProductFavorite, isProductFavorite } = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const isFavorite = isProductFavorite(params.id as string);

  const handleToggleFavorite = () => {
    if (!product) return;
    const wasFavorite = isProductFavorite(product.id);
    toggleProductFavorite(product.id);
    setTimeout(() => {
      alert(wasFavorite ? 'Removed from favorites' : 'Added to favorites!');
    }, 100);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.item_name,
        text: `Check out ${product?.item_name} on Kafek!`,
        url: window.location.href,
      }).catch((error) => console.log('Share cancelled:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (params.id) loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProductDetails({
        product_id: params.id as string,
        user_id: user?.id,
      });
      if (response.status === 'success') {
        setProduct(response.result);
        if (response.result.product_size_price?.length) {
          setSelectedSize(response.result.product_size_price[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const totalAmount = parseFloat(product.offer_item_price || product.item_price) * quantity;
    addItem({
      product_id: product.id,
      product_name: product.item_name,
      product_price: parseFloat(product.offer_item_price || product.item_price),
      quantity,
      size_id: selectedSize || undefined,
      size_name: product.product_size_price?.find(s => s.id === selectedSize)?.size_name,
      size_price: product.product_size_price?.find(s => s.id === selectedSize)
        ? parseFloat(product.product_size_price.find(s => s.id === selectedSize)!.size_price)
        : 0,
      extra_items: [],
      total_amount: totalAmount,
    });
    setAddedToCart(true);
    setTimeout(() => router.push('/cart'), 600);
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <style>{styles}</style>
        <div className="loader" />
      </div>
    );
  }

  // ─── Not Found ────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
        <style>{styles}</style>
        <ShoppingBag className="w-16 h-16 opacity-20" />
        <p className="text-xl font-semibold opacity-40">Product not found</p>
        <Link href="/" className="pill-btn">Back to Home</Link>
      </div>
    );
  }

  const images = product.product_images?.length
    ? product.product_images
    : [{ image_url: `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg` }];

  const price = product.offer_item_price || product.item_price;
  const originalPrice = product.offer_item_price ? product.item_price : null;
  const total = (parseFloat(price) * quantity).toFixed(2);

  return (
    <div className="page-root pb-32">
      <style>{styles}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="hero-wrap">
        <img
          src={images[imageIndex]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
          alt={product.item_name}
          className="hero-img"
          onError={(e) => { (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`; }}
        />

        {/* scrim */}
        <div className="hero-scrim" />

        {/* top actions */}
        <div className="hero-topbar">
          <button onClick={() => router.back()} className="icon-btn">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="icon-btn"><Share2 className="w-5 h-5" /></button>
            <button onClick={handleToggleFavorite} className={`icon-btn ${isFavorite ? 'fav-active' : ''}`}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* offer badge */}
        {product.offer_item_price && (
          <div className="offer-badge">
            <Star className="w-3.5 h-3.5 fill-white" />
            Special Offer
          </div>
        )}

        {/* hero content */}
        <div className="hero-content">
          <h1 className="hero-title">{product.item_name}</h1>
          <div className="rating-row">
            <div className="rating-pill">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{product.avg_rating || '0'}</span>
            </div>
            <span className="review-count">({product.total_rating_count || '0'} reviews)</span>
          </div>
        </div>

        {/* thumbnail strip */}
        {images.length > 1 && (
          <div className="thumb-strip">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={`thumb ${idx === imageIndex ? 'thumb-active' : ''}`}
              >
                <img src={img.image_url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="body-wrap">

        {/* price card */}
        <div className="price-card">
          <div className="price-left">
            <span className="price-label">Price</span>
            <div className="price-row">
              <span className="price-main">{price}</span>
              <span className="price-currency">SAR</span>
              {originalPrice && <span className="price-old">{originalPrice} SAR</span>}
            </div>
          </div>
          <div className="price-divider" />
          <div className="price-right">
            <span className="price-label">Total</span>
            <span className="price-total">{total} SAR</span>
          </div>
        </div>

        {/* trust badges */}
        <div className="badges-row">
          {[
            { icon: <Truck className="w-5 h-5" />, label: 'Fast Delivery' },
            { icon: <Shield className="w-5 h-5" />, label: 'Quality Assured' },
            { icon: <Award className="w-5 h-5" />, label: 'Top Rated' },
          ].map(({ icon, label }) => (
            <div key={label} className="badge-item">
              <div className="badge-icon">{icon}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* description */}
        {product.short_description && (
          <div className="section-card">
            <div className="section-header">
              <Info className="w-4 h-4" />
              <span>About this item</span>
            </div>
            <p className="section-body">{product.short_description}</p>
          </div>
        )}

        {/* size selection */}
        {product.product_size_price?.length > 0 && (
          <div className="section-card">
            <div className="section-header"><span>Choose Size</span></div>
            <div className="size-grid">
              {product.product_size_price.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`size-btn ${selectedSize === size.id ? 'size-active' : ''}`}
                >
                  <span className="size-name">{size.size_name}</span>
                  <span className="size-price">{size.size_price} SAR</span>
                  {selectedSize === size.id && (
                    <div className="size-check"><Check className="w-3 h-3" /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* extras */}
        {product.product_additional?.length > 0 && (
          <div className="section-card">
            <div className="section-header"><span>Add Extras</span></div>
            <div className="extras-list">
              {product.product_additional.map((extra) => (
                <label key={extra.id} className="extra-row">
                  <span className="extra-name">{extra.additional_name}</span>
                  <div className="extra-right">
                    <span className="extra-price">+{extra.additional_price} SAR</span>
                    <div
                      className={`extra-check ${selectedExtras.includes(extra.id) ? 'extra-check-active' : ''}`}
                      onClick={() => {
                        setSelectedExtras(prev =>
                          prev.includes(extra.id)
                            ? prev.filter(id => id !== extra.id)
                            : [...prev, extra.id]
                        );
                      }}
                    >
                      {selectedExtras.includes(extra.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* quantity */}
        <div className="section-card">
          <div className="section-header"><span>Quantity</span></div>
          <div className="qty-row">
            <button className="qty-btn qty-minus" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="w-4 h-4" />
            </button>
            <span className="qty-num">{quantity}</span>
            <button className="qty-btn qty-plus" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* provider */}
        {product.provider_details && (
          <Link href={`/stores/${product.provider_id}`} className="store-card">
            <img
              src={product.provider_details.provider_logo || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
              alt={product.provider_details.store_name}
              className="store-logo"
              onError={(e) => { (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`; }}
            />
            <div className="store-info">
              <span className="store-name">{product.provider_details.store_name}</span>
              <span className="store-sub">Visit Store</span>
            </div>
            <ChevronRight className="w-5 h-5 store-arrow" />
          </Link>
        )}

        {/* full description */}
        {product.description && (
          <div className="section-card">
            <div className="section-header"><span>Full Description</span></div>
            <p className="section-body">{product.description}</p>
          </div>
        )}
      </div>

      {/* ── Sticky CTA ────────────────────────────────────────────────── */}
      <div className="cta-bar">
        <button
          onClick={handleAddToCart}
          className={`cta-btn ${addedToCart ? 'cta-success' : ''}`}
        >
          {addedToCart
            ? <><Check className="w-5 h-5" /> Added!</>
            : <><ShoppingBag className="w-5 h-5" /> Add to Cart — {total} SAR</>
          }
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  :root {
    --bg: #F7F6F2;
    --surface: #FFFFFF;
    --primary: #0A1628;
    --accent: #3D6FFF;
    --accent2: #FF5C3A;
    --green: #1DB87A;
    --muted: #8B8FA8;
    --border: #ECEDF2;
    --radius: 20px;
    --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }

  .page-root {
    min-height: 100vh;
    background: var(--bg);
  }

  /* ── Loader ── */
  .loader {
    width: 48px; height: 48px;
    border: 3px solid rgba(61,111,255,.15);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Hero ── */
  .hero-wrap {
    position: relative;
    height: 420px;
    overflow: hidden;
    border-radius: 0 0 32px 32px;
  }
  .hero-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: opacity .3s;
  }
  .hero-scrim {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,22,40,.25) 0%,
      transparent 40%,
      rgba(10,22,40,.85) 100%
    );
  }
  .hero-topbar {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: center;
    padding: 52px 20px 16px;
  }
  .icon-btn {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.18);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 50%;
    color: #fff;
    transition: background .2s, transform .15s;
  }
  .icon-btn:hover { background: rgba(255,255,255,.30); transform: scale(1.08); }
  .icon-btn:active { transform: scale(.94); }
  .fav-active { background: var(--accent2) !important; border-color: var(--accent2) !important; }

  .offer-badge {
    position: absolute; top: 110px; left: 20px;
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    background: var(--accent2);
    color: #fff; font-size: 11px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    border-radius: 100px;
    font-family: 'Sora', sans-serif;
  }

  .hero-content {
    position: absolute; bottom: 64px; left: 0; right: 0;
    padding: 0 20px;
  }
  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 26px; font-weight: 700;
    color: #fff; line-height: 1.25;
    margin-bottom: 10px;
    text-shadow: 0 2px 12px rgba(0,0,0,.3);
  }
  .rating-row { display: flex; align-items: center; gap: 10px; }
  .rating-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    background: rgba(255,255,255,.18);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 100px;
    color: #fff; font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif;
  }
  .review-count { color: rgba(255,255,255,.65); font-size: 13px; }

  .thumb-strip {
    position: absolute; bottom: 16px; left: 0; right: 0;
    display: flex; gap: 8px; padding: 0 20px;
    overflow-x: auto;
  }
  .thumb {
    flex-shrink: 0; width: 52px; height: 52px;
    border-radius: 12px; overflow: hidden;
    border: 2px solid transparent;
    opacity: .55; transition: all .2s;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-active { border-color: #fff; opacity: 1; }

  /* ── Body ── */
  .body-wrap {
    padding: 20px 16px 0;
    display: flex; flex-direction: column; gap: 12px;
  }

  /* price card */
  .price-card {
    display: flex; align-items: center;
    background: var(--primary);
    border-radius: var(--radius);
    padding: 20px 24px;
    gap: 20px;
  }
  .price-left { flex: 1; }
  .price-label { display: block; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.45); margin-bottom: 4px; font-family: 'Sora', sans-serif; }
  .price-row { display: flex; align-items: baseline; gap: 6px; }
  .price-main { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; color: #fff; }
  .price-currency { font-size: 16px; font-weight: 600; color: rgba(255,255,255,.6); }
  .price-old { font-size: 14px; color: rgba(255,255,255,.35); text-decoration: line-through; margin-left: 4px; }
  .price-divider { width: 1px; height: 48px; background: rgba(255,255,255,.12); }
  .price-right { text-align: right; }
  .price-total { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: var(--green); }

  /* badges */
  .badges-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .badge-item {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    background: var(--surface); border-radius: var(--radius-sm);
    padding: 14px 8px;
    font-size: 11px; font-weight: 500; color: var(--muted);
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .badge-icon {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(61,111,255,.08);
    border-radius: 10px;
    color: var(--accent);
  }

  /* section cards */
  .section-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 18px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .section-header {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 700;
    color: var(--primary);
    margin-bottom: 12px;
    color: var(--muted);
    text-transform: uppercase; letter-spacing: .07em; font-size: 11px;
  }
  .section-body { font-size: 14px; line-height: 1.7; color: var(--muted); }

  /* sizes */
  .size-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .size-btn {
    position: relative;
    display: flex; flex-direction: column; align-items: flex-start;
    padding: 14px 16px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: #FAFAFA;
    transition: all .2s;
    text-align: left;
  }
  .size-btn:hover { border-color: rgba(61,111,255,.4); }
  .size-name { font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 3px; font-family: 'Sora', sans-serif; }
  .size-price { font-size: 13px; font-weight: 500; color: var(--muted); }
  .size-active { border-color: var(--accent); background: rgba(61,111,255,.06); }
  .size-active .size-name { color: var(--accent); }
  .size-active .size-price { color: var(--accent); }
  .size-check {
    position: absolute; top: 10px; right: 10px;
    width: 20px; height: 20px;
    background: var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }

  /* extras */
  .extras-list { display: flex; flex-direction: column; gap: 8px; }
  .extra-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px;
    background: #FAFAFA; border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background .15s;
  }
  .extra-row:hover { background: rgba(61,111,255,.05); }
  .extra-name { font-size: 14px; font-weight: 500; color: var(--primary); }
  .extra-right { display: flex; align-items: center; gap: 12px; }
  .extra-price { font-size: 13px; font-weight: 600; color: var(--green); }
  .extra-check {
    width: 22px; height: 22px;
    border-radius: 7px;
    border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    transition: all .15s; cursor: pointer;
  }
  .extra-check-active { background: var(--accent); border-color: var(--accent); }

  /* quantity */
  .qty-row { display: flex; align-items: center; justify-content: center; gap: 24px; }
  .qty-btn {
    width: 44px; height: 44px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 300;
    transition: all .15s;
  }
  .qty-minus { background: #FFF0EE; color: var(--accent2); }
  .qty-minus:hover { background: #FFE0DB; transform: scale(1.08); }
  .qty-plus { background: #E6FAF3; color: var(--green); }
  .qty-plus:hover { background: #C6F3E3; transform: scale(1.08); }
  .qty-btn:active { transform: scale(.92); }
  .qty-num {
    font-family: 'Sora', sans-serif;
    font-size: 34px; font-weight: 800; color: var(--primary);
    min-width: 50px; text-align: center;
  }

  /* store */
  .store-card {
    display: flex; align-items: center; gap: 14px;
    background: var(--surface);
    border-radius: var(--radius);
    padding: 16px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
    text-decoration: none;
    transition: transform .15s, box-shadow .15s;
  }
  .store-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .store-logo { width: 52px; height: 52px; border-radius: 14px; object-fit: cover; }
  .store-info { flex: 1; }
  .store-name { display: block; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: var(--primary); }
  .store-sub { font-size: 12px; color: var(--muted); }
  .store-arrow { color: var(--muted); flex-shrink: 0; }

  /* CTA */
  .cta-bar {
    position: fixed; bottom: 72px; left: 0; right: 0;
    padding: 0 16px; z-index: 50;
  }
  .cta-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 17px 24px;
    background: var(--primary);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 700;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(10,22,40,.35);
    transition: all .25s;
    letter-spacing: .01em;
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(10,22,40,.45); }
  .cta-btn:active { transform: scale(.97); }
  .cta-success { background: var(--green) !important; box-shadow: 0 8px 32px rgba(29,184,122,.4) !important; }

  /* pill btn for not found */
  .pill-btn {
    padding: 12px 28px;
    background: var(--primary);
    color: #fff;
    border-radius: 100px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    text-decoration: none;
  }
`;