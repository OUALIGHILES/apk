'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { productsAPI, Product, Provider } from '@/lib/api/products';
import { useFavoritesStore } from '@/store/favoritesStore';
import { MapPin, Star, Clock, Phone, Share2, Heart, ChevronRight, Utensils, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function StoreDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [store, setStore] = useState<Provider | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleStoreFavorite, isStoreFavorite } = useFavoritesStore();
  const isFavorite = isStoreFavorite(params.id as string);

  useEffect(() => {
    if (params.id) {
      loadStoreDetails();
    }
  }, [params.id]);

  const loadStoreDetails = async () => {
    try {
      setLoading(true);
      // Load store details
      const storesResponse = await productsAPI.getAllStoreList({});
      if (storesResponse.status === 'success') {
        const foundStore = storesResponse.result.find(s => s.id === params.id);
        if (foundStore) {
          setStore(foundStore);
          setIsFavorite(foundStore.is_favorite === '1');
        }
      }

      // Load store products
      const productsResponse = await productsAPI.getProductList({
        provider_id: params.id as string,
      });
      if (productsResponse.status === 'success') {
        setProducts(productsResponse.result);
      }
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
    
    // Show feedback
    setTimeout(() => {
      alert(wasFavorite ? 'Removed from favorites' : 'Added to favorites!');
    }, 100);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store?.store_name,
        text: `Check out ${store?.store_name} on Kafek!`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Share cancelled:', error);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCall = () => {
    // In production, this would use the store's actual phone number
    // For now, using a default number since the API might not have mobile
    const phoneNumber = '+966500000000';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleViewMenu = () => {
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Store Details" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Store Details" />
        <Card className="mx-4 mt-8 text-center py-12">
          <h3 className="text-xl font-bold text-primary mb-2">Store Not Found</h3>
          <p className="text-greyunselect mb-6">This store doesn't exist or was removed</p>
          <Button onClick={() => router.push('/stores')}>Browse Stores</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title={store.store_name} showBack />

      <main className="max-w-screen-xl mx-auto">
        {/* Store Header */}
        <div className="relative">
          {/* Cover Image */}
          {store.store_cover_image ? (
            <div className="h-48 w-full overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${store.store_cover_image}`}
                alt={store.store_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-primary to-secondary"></div>
          )}

          {/* Store Info Overlay */}
          <div className="relative -mt-16 px-4">
            <Card className="p-4">
              <div className="flex items-start justify-between">
                {/* Logo */}
                <div className="relative">
                  {store.provider_logo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${store.provider_logo}`}
                      alt={store.store_name}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white">
                      <Utensils className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-greyunselect" />
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorite
                        ? 'bg-red-100 hover:bg-red-200'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-greyunselect'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Store Name & Rating */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-primary mb-2">{store.store_name}</h1>
                <p className="text-sm text-greyunselect mb-3">{store.description || store.about_store}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {store.avg_rating && (
                      <div className="flex items-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-bold text-primary">{store.avg_rating}</span>
                        <span className="text-sm text-greyunselect ml-1">
                          ({store.total_rating_count} reviews)
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-greyunselect">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{store.radius} km</span>
                    </div>
                  </div>
                  {store.store_ope_closs_status === 'open' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Open
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Store Info */}
        <Card className="mx-4 mt-4">
          <h3 className="font-bold text-primary mb-3">Store Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="w-5 h-5 mr-3 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Opening Hours</span>
                <p className="text-greyunselect">
                  {store.open_time} - {store.close_time}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Utensils className="w-5 h-5 mr-3 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Category</span>
                <p className="text-greyunselect">{store.cat_name}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="w-5 h-5 mr-3 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Delivery Options</span>
                <p className="text-greyunselect capitalize">{store.delivery_option}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Section */}
        <div id="products-section" className="mx-4 mt-4 mb-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primary">Menu</h2>
            <span className="text-sm text-greyunselect">{products.length} items</span>
          </div>

          {products.length === 0 ? (
            <Card className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">No Products Yet</h3>
              <p className="text-greyunselect">This store hasn't added any products</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                product.id ? (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start space-x-3">
                        {product.product_images?.[0]?.image_url && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.product_images[0].image_url}`}
                            alt={product.item_name}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-primary truncate mb-1">
                            {product.item_name}
                          </h4>
                          <p className="text-sm text-greyunselect line-clamp-2 mb-2">
                            {product.short_description || product.item_description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-button font-bold">
                                {product.offer_item_price || product.item_price} SAR
                              </span>
                              {product.offer_item_price && (
                                <span className="text-xs text-greyunselect line-through ml-2">
                                  {product.item_price} SAR
                                </span>
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
                ) : null
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t shadow-lg">
        <div className="max-w-screen-xl mx-auto flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCall}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </Button>
          <Button 
            onClick={handleViewMenu}
            className="flex-1"
          >
            View Menu
          </Button>
        </div>
      </div>

      <BottomNavigation activeTab="stores" />
    </div>
  );
}
