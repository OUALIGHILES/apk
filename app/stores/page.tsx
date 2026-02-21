'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import { productsAPI, Provider } from '@/lib/api/products';
import { MapPin, Clock, Star, ShoppingBag } from 'lucide-react';
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

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.cat_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || store.cat_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Stores" showSearch />
      
      <main className="max-w-screen-xl mx-auto">
        {/* Search Bar */}
        <div className="px-4 mt-4">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="px-4 mt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect border border-gray-200'
              }`}
            >
              All
            </button>
            {Array.from(new Set(stores.map((s) => s.cat_name))).map((category) => (
              category && (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-greyunselect border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              )
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-greyunselect mt-2">Loading stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <Card className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-greyunselect mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">No stores found</h3>
              <p className="text-greyunselect">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map((store) => (
                <Link key={store.id} href={`/stores/${store.id}`}>
                  <Card padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={store.store_cover_image || store.provider_logo || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                        alt={store.store_name}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {store.avg_rating || '0'}
                      </div>
                      {store.store_ope_closs_status === 'open' ? (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Open
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Closed
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-primary">{store.store_name}</h3>
                      <p className="text-sm text-greyunselect mt-1">{store.cat_name}</p>
                      
                      {store.description && (
                        <p className="text-sm text-greyunselect mt-2 line-clamp-2">
                          {store.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-greyunselect">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {store.open_time || '09:00'} - {store.close_time || '23:00'}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {store.radius || '5'} km
                        </div>
                      </div>
                      
                      {store.delivery_option && (
                        <div className="mt-3 flex space-x-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {store.delivery_option === 'both' ? 'Delivery & Pickup' : store.delivery_option}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
