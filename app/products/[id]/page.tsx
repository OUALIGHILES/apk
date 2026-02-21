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
import { ShoppingBag, Minus, Plus, Star, Heart, Share2 } from 'lucide-react';
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
      }).catch((error) => {
        console.log('Share cancelled:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
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
        // Set default size if available
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

    const totalAmount = (parseFloat(product.offer_item_price || product.item_price) * quantity);
    
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

    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Product Details" />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-screenback">
        <Header title="Product Details" />
        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="mt-8 text-center py-12">
            <h2 className="text-xl font-bold text-primary mb-2">Product Not Found</h2>
            <Link href="/">
              <Button className="mt-4">Back to Home</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const images = product.product_images?.length ? product.product_images : [
    { image_url: `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg` }
  ];

  const price = product.offer_item_price || product.item_price;
  const originalPrice = product.offer_item_price ? product.item_price : null;

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Product Details" />
      
      <main className="max-w-screen-xl mx-auto">
        {/* Product Images */}
        <div className="bg-white">
          <div className="relative h-64 md:h-96">
            <img
              src={images[imageIndex]?.image_url || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
              alt={product.item_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`;
              }}
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-2 h-2 rounded-full ${
                      idx === imageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <Card className="m-4">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-xl font-bold text-primary flex-1">{product.item_name}</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleToggleFavorite}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-greyunselect'
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Share2 className="w-5 h-5 text-greyunselect" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 font-medium">{product.avg_rating || '0'}</span>
            <span className="text-greyunselect text-sm ml-1">
              ({product.total_rating_count || '0'} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-button">{price} SAR</span>
            {originalPrice && (
              <span className="ml-2 text-sm text-greyunselect line-through">{originalPrice} SAR</span>
            )}
          </div>

          {/* Description */}
          {product.short_description && (
            <p className="text-greyunselect mb-4">{product.short_description}</p>
          )}

          {/* Size Selection */}
          {product.product_size_price && product.product_size_price.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-primary mb-2">Select Size</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.product_size_price.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedSize === size.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="font-medium">{size.size_name}</div>
                    <div className="text-sm text-button">{size.size_price} SAR</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {product.product_additional && product.product_additional.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-primary mb-2">Add Extras</h3>
              <div className="space-y-2">
                {product.product_additional.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <span className="font-medium">{extra.additional_name}</span>
                    <div className="flex items-center">
                      <span className="text-button mr-2">+{extra.additional_price} SAR</span>
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtras([...selectedExtras, extra.id]);
                          } else {
                            setSelectedExtras(selectedExtras.filter(id => id !== extra.id));
                          }
                        }}
                        className="w-4 h-4 text-primary rounded"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4">
            <h3 className="font-bold text-primary mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Provider Info */}
        {product.provider_details && (
          <Link href={`/stores/${product.provider_id}`}>
            <Card className="m-4 flex items-center space-x-3">
              <img
                src={product.provider_details.provider_logo || `${API_CONFIG.IMAGE_BASE_URL}placeholder.jpg`}
                alt={product.provider_details.store_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-primary">{product.provider_details.store_name}</h3>
                <p className="text-sm text-greyunselect">View Store</p>
              </div>
              <svg className="w-5 h-5 text-greyunselect" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Card>
          </Link>
        )}

        {/* Full Description */}
        {product.description && (
          <Card className="m-4">
            <h3 className="font-bold text-primary mb-2">Description</h3>
            <p className="text-greyunselect">{product.description}</p>
          </Card>
        )}

        {/* Add to Cart Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t shadow-lg">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-greyunselect">Total Price</p>
              <p className="text-xl font-bold text-button">
                {(parseFloat(price) * quantity).toFixed(2)} SAR
              </p>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
