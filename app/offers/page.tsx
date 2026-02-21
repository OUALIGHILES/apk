'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { offersAPI, Offer } from '@/lib/api/extended';
import { Tag, Percent, Calendar, Store, Copy, Check } from 'lucide-react';

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await offersAPI.getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isValidOffer = (offer: Offer) => {
    const now = new Date();
    const validUntil = new Date(offer.valid_until);
    return validUntil > now;
  };

  const getDiscountDisplay = (offer: Offer) => {
    if (offer.discount_type === 'percentage') {
      return `${offer.discount_value}% OFF`;
    }
    return `${offer.discount_value} SAR OFF`;
  };

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Offers & Promotions" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Featured Offer */}
        {offers.length > 0 && (
          <Card className="mb-4 bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-5 h-5" />
                <span className="text-sm font-medium">Featured Offer</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{offers[0]?.title}</h2>
              <p className="text-white/90 mb-4">{offers[0]?.description}</p>
              <div className="flex items-center justify-between">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-3xl font-bold">{offers[0]?.discount_value}</span>
                  <span className="text-sm ml-1">
                    {offers[0]?.discount_type === 'percentage' ? '%' : 'SAR'}
                  </span>
                </div>
                {offers[0]?.offer_code && (
                  <button
                    onClick={() => handleCopyCode(offers[0]!.offer_code!)}
                    className="flex items-center space-x-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90"
                  >
                    {copiedCode === offers[0]?.offer_code ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </Card>
        )}

        {/* Offers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <Card className="text-center py-12">
            <Percent className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No Offers Available</h3>
            <p className="text-greyunselect">Check back soon for exciting deals!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {offers.slice(1).map((offer) => (
              <Card key={offer.id} className={`overflow-hidden ${!isValidOffer(offer) ? 'opacity-60' : ''}`}>
                <div className="flex items-start space-x-4">
                  {/* Discount Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                      <div className="text-center">
                        <span className="text-2xl font-bold">{offer.discount_value}</span>
                        <span className="text-xs block">
                          {offer.discount_type === 'percentage' ? 'OFF' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-primary mb-1">{offer.title}</h3>
                    <p className="text-sm text-greyunselect mb-2 line-clamp-2">
                      {offer.description}
                    </p>
                    
                    {offer.store_name && (
                      <div className="flex items-center text-xs text-greyunselect mb-2">
                        <Store className="w-3 h-3 mr-1" />
                        <span>{offer.store_name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-greyunselect">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          Valid until {new Date(offer.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {offer.offer_code && (
                        <button
                          onClick={() => handleCopyCode(offer.offer_code)}
                          className="flex items-center space-x-1 text-sm text-button font-medium hover:underline"
                        >
                          {copiedCode === offer.offer_code ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {offer.min_order_amount && parseFloat(offer.min_order_amount) > 0 && (
                      <p className="text-xs text-greyunselect mt-2">
                        Min. order: {offer.min_order_amount} SAR
                      </p>
                    )}
                  </div>
                </div>

                {/* Offer Code Box */}
                {offer.offer_code && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <code className="text-sm font-mono text-primary">{offer.offer_code}</code>
                      <button
                        onClick={() => handleCopyCode(offer.offer_code)}
                        className="text-xs text-button font-medium hover:underline"
                      >
                        {copiedCode === offer.offer_code ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">How to Use Offers</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Copy the offer code</li>
                <li>2. Add items to your cart</li>
                <li>3. Apply code at checkout</li>
                <li>4. Enjoy your discount!</li>
              </ol>
            </div>
          </div>
        </Card>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
