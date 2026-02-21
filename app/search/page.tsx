'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { Search, Filter, MapPin, Star, X } from 'lucide-react';
import Link from 'next/link';

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

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`}>
      <Card className="mb-3 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-3">
          {product.product_images?.[0]?.image_url && (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.product_images[0].image_url}`}
              alt={product.item_name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-primary truncate">{product.item_name}</h4>
            <p className="text-sm text-greyunselect truncate">{product.provider_details?.store_name}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-button font-bold">{product.offer_item_price || product.item_price} SAR</span>
                {product.offer_item_price && (
                  <span className="text-xs text-greyunselect line-through ml-2">{product.item_price} SAR</span>
                )}
              </div>
              {product.avg_rating && (
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{product.avg_rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  const StoreCard = ({ store }: { store: Provider }) => (
    <Link href={`/stores/${store.id}`}>
      <Card className="mb-3 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-3">
          {store.provider_logo && (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${store.provider_logo}`}
              alt={store.store_name}
              className="w-16 h-16 object-cover rounded-full flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-primary truncate">{store.store_name}</h4>
            <p className="text-sm text-greyunselect truncate">{store.cat_name}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-greyunselect">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{store.radius} km</span>
              </div>
              {store.avg_rating && (
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{store.avg_rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Search" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 relative">
              <Input
                placeholder={searchType === 'products' ? "Search products..." : "Search stores..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                icon={<Search className="w-5 h-5" />}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-greyunselect hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80"
            >
              Search
            </button>
          </div>

          {/* Search Type Toggle */}
          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => setSearchType('products')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'products'
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect hover:bg-gray-100'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setSearchType('stores')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'stores'
                  ? 'bg-primary text-white'
                  : 'bg-white text-greyunselect hover:bg-gray-100'
              }`}
            >
              Stores
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-primary font-medium hover:underline"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <Card className="mt-3 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Category"
                  placeholder="All categories"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <Input
                  label="Max Price"
                  type="number"
                  placeholder="SAR"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
                <Input
                  label="Min Rating"
                  type="number"
                  placeholder="1-5"
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="w-full mt-3"
                size="sm"
              >
                Apply Filters
              </Button>
            </Card>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Searching...</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Search Anything</h3>
            <p className="text-greyunselect">
              Find products from your favorite stores
            </p>
          </div>
        ) : results.length === 0 ? (
          <Card className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No Results Found</h3>
            <p className="text-greyunselect">
              Try different keywords or adjust your filters
            </p>
          </Card>
        ) : (
          <div>
            <p className="text-sm text-greyunselect mb-3">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {searchType === 'products' ? (
              <div>
                {results.map((product) => (
                  <ProductCard key={(product as Product).id} product={product as Product} />
                ))}
              </div>
            ) : (
              <div>
                {results.map((store) => (
                  <StoreCard key={(store as Provider).id} store={store as Provider} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="stores" />
    </div>
  );
}
