'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import { categoriesAPIExtended, CategoryExtended, SubCategory } from '@/lib/api/extended';
import { ChevronRight, Utensils, Coffee, ShoppingBag, Car, Home, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryExtended[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPIExtended.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSubcategories([]);
      return;
    }

    try {
      const data = await categoriesAPIExtended.getSubCategories(categoryId);
      setSelectedCategory(categoryId);
      setSubcategories(data);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('restaurant') || name.includes('food')) return <Utensils className="w-6 h-6" />;
    if (name.includes('cafe') || name.includes('coffee')) return <Coffee className="w-6 h-6" />;
    if (name.includes('store') || name.includes('shop')) return <ShoppingBag className="w-6 h-6" />;
    if (name.includes('car') || name.includes('auto')) return <Car className="w-6 h-6" />;
    if (name.includes('home') || name.includes('furniture')) return <Home className="w-6 h-6" />;
    if (name.includes('beauty') || name.includes('salon')) return <Heart className="w-6 h-6" />;
    if (name.includes('service')) return <Sparkles className="w-6 h-6" />;
    return <Utensils className="w-6 h-6" />;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="Categories" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-xl font-bold text-primary mb-2">No Categories</h3>
            <p className="text-greyunselect">Categories will appear here soon</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Main Categories */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-3">All Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => loadSubcategories(category.id)}
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className={`${getCategoryColor(index)} p-4 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            {getCategoryIcon(category.category_name)}
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-sm">{category.category_name}</h3>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <p className="text-xs text-white/80">
                                {category.subcategories.length} subcategories
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    {category.category_image && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${category.category_image}`}
                        alt={category.category_name}
                        className="absolute bottom-0 right-0 w-20 h-20 object-cover opacity-20"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-primary mb-3">
                  Subcategories
                </h2>
                <div className="space-y-2">
                  {subcategories.map((subcat) => (
                    <Link key={subcat.id} href={`/products?category=${subcat.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(subcat.category_name)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-primary">{subcat.category_name}</h4>
                          </div>
                          <ChevronRight className="w-5 h-5 text-greyunselect" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Browse by Section */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-3">Browse By</h2>
              <Card>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium">Popular Near You</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-greyunselect" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium">New on Kafek</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-greyunselect" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="font-medium">Trending Now</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-greyunselect" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation activeTab="stores" />
    </div>
  );
}
