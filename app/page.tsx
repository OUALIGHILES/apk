'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { productsAPI, Product, Category, Provider } from '@/lib/api/products';
import { API_CONFIG } from '@/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ShoppingBag, MapPin, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check if mock mode is enabled
    setIsMockMode(process.env.NEXT_PUBLIC_USE_MOCK_API === 'true');
    loadData();
  }, [activeCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load products
      const productsResponse = await productsAPI.getProductList({
        cat_id: activeCategory || undefined,
      });
      
      if (productsResponse.status === 'success') {
        setProducts(productsResponse.result);
      } else if (productsResponse.status === 'error') {
        setError(productsResponse.message || 'Failed to load products');
      }

      // Load stores
      const storesResponse = await productsAPI.getAllStoreList({});
      if (storesResponse.status === 'success') {
        setStores(storesResponse.result);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load data';
      
      // Check for database error
      if (errorMessage.includes('database') || errorMessage.includes('Database')) {
        setError('The backend server is currently experiencing database issues. Please try again later.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Kafek" showSearch showCart showNotifications />
      
      <main className="max-w-screen-xl mx-auto">
        {/* Mock API Banner */}
        {isMockMode && (
          <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🧪</span>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Mock Data Mode</h3>
                  <p className="text-xs text-yellow-700">Testing with sample data. Backend API is offline.</p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-yellow-800 hover:text-yellow-600 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Service Unavailable</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-600"
                >
                  Try Again →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Slider */}
        <section className="mt-4 px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="rounded-lg overflow-hidden"
          >
            <SwiperSlide>
              <div className="bg-gradient-to-r from-primary to-secondary h-48 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h2 className="text-2xl font-bold mb-2">Welcome to Kafek</h2>
                  <p className="text-sm">Order food and services from your favorite stores</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-gradient-to-r from-orange to-yellow h-48 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h2 className="text-2xl font-bold mb-2">Special Offers</h2>
                  <p className="text-sm">Get up to 50% off on your first order</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Categories */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primary">Categories</h2>
            <Link href="/categories" className="text-sm text-button font-medium">
              View All
            </Link>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect border border-gray-200'
              }`}
            >
              All
            </button>
            {/* Categories would be loaded from API */}
            <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-greyunselect border border-gray-200">
              Restaurant
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-greyunselect border border-gray-200">
              Grocery
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-greyunselect border border-gray-200">
              Pharmacy
            </button>
            <button className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium text-greyunselect border border-gray-200">
              Services
            </button>
          </div>
        </section>

        {/* Popular Stores */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primary">Popular Stores</h2>
            <Link href="/stores" className="text-sm text-button font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.slice(0, 6).map((store) => (
              <Link key={store.id} href={`/stores/${store.id}`}>
                <Card padding="none" className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={store.store_cover_image || store.provider_logo || '/placeholder-store.jpg'}
                      alt={store.store_name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-store.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {store.avg_rating || '0'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-primary">{store.store_name}</h3>
                    <p className="text-sm text-greyunselect mt-1">{store.cat_name}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-greyunselect">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {store.open_time} - {store.close_time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {(store.radius || '5')} km
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primary">Popular Products</h2>
            <Link href="/products" className="text-sm text-button font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card padding="none" className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.product_images?.[0]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                      alt={product.item_name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
                      }}
                    />
                    {product.offer_item_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                        OFFER
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm text-primary line-clamp-2">{product.item_name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {product.offer_item_price ? (
                          <>
                            <span className="text-button font-bold">
                              {product.offer_item_price} {APP_CONFIG.CURRENCY}
                            </span>
                            <span className="text-xs text-greyunselect line-through ml-1">
                              {product.item_price}
                            </span>
                          </>
                        ) : (
                          <span className="text-button font-bold">
                            {product.item_price} {APP_CONFIG.CURRENCY}
                          </span>
                        )}
                      </div>
                      <button className="p-1.5 bg-primary text-white rounded-full hover:bg-opacity-90">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-center mt-2 text-sm text-greyunselect">Loading...</p>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

const APP_CONFIG = {
  CURRENCY: 'SAR',
};
