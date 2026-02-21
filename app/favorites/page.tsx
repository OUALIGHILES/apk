'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Heart, ShoppingBag, Star } from 'lucide-react';
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
  }, [user, favorites]); // Re-run when favorites change

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Load all products and stores, then filter by favorites
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

  // Filter favorites based on favorites store
  const favoriteProducts = allProducts.filter(p => 
    favorites.some(f => f.id === p.id && f.type === 'product')
  );
  
  const favoriteStores = allStores.filter(s => 
    favorites.some(f => f.id === s.id && f.type === 'store')
  );

  // Debug log
  useEffect(() => {
    console.log('Favorites:', favorites);
    console.log('Favorite Products:', favoriteProducts);
    console.log('Favorite Stores:', favoriteStores);
  }, [favorites, favoriteProducts, favoriteStores]);

  if (!user) {
    return (
      <div className="min-h-screen bg-screenback pb-20">
        <Header title="Favorites" />
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-greyunselect mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Please Login</h2>
            <p className="text-greyunselect mb-6">Login to view your favorites</p>
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
          </Card>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Favorites" />
      
      <main className="max-w-screen-xl mx-auto">
        {/* Tabs */}
        <div className="flex px-4 mt-4 space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              activeTab === 'products'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              activeTab === 'stores'
                ? 'bg-primary text-white'
                : 'bg-white text-greyunselect'
            }`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Stores
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-greyunselect mt-2">Loading favorites...</p>
            </div>
          ) : activeTab === 'products' ? (
            favoriteProducts.length === 0 ? (
              <Card className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-greyunselect mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">No favorite products</h3>
                <p className="text-greyunselect mb-4">Start adding products to your favorites</p>
                <Link href="/">
                  <Button>Browse Products</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {favoriteProducts.map((product) => (
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
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )
          ) : (
            favoriteStores.length === 0 ? (
              <Card className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-greyunselect mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">No favorite stores</h3>
                <p className="text-greyunselect mb-4">Start following your favorite stores</p>
                <Link href="/stores">
                  <Button>Browse Stores</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteStores.map((store) => (
                  <Link key={store.id} href={`/stores/${store.id}`}>
                    <Card padding="none" className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={store.store_cover_image || store.provider_logo || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                          alt={store.store_name}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
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
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

const APP_CONFIG = {
  CURRENCY: 'SAR',
};
