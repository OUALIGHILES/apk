import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteItem {
  id: string;
  type: 'product' | 'store';
}

interface FavoritesState {
  favorites: FavoriteItem[];
  toggleProductFavorite: (productId: string) => void;
  toggleStoreFavorite: (storeId: string) => void;
  isProductFavorite: (productId: string) => boolean;
  isStoreFavorite: (storeId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleProductFavorite: (productId: string) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.find(f => f.id === productId && f.type === 'product');
        
        if (exists) {
          // Remove from favorites
          set({
            favorites: currentFavorites.filter(f => !(f.id === productId && f.type === 'product'))
          });
        } else {
          // Add to favorites
          set({
            favorites: [...currentFavorites, { id: productId, type: 'product' }]
          });
        }
      },
      
      toggleStoreFavorite: (storeId: string) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.find(f => f.id === storeId && f.type === 'store');
        
        if (exists) {
          // Remove from favorites
          set({
            favorites: currentFavorites.filter(f => !(f.id === storeId && f.type === 'store'))
          });
        } else {
          // Add to favorites
          set({
            favorites: [...currentFavorites, { id: storeId, type: 'store' }]
          });
        }
      },
      
      isProductFavorite: (productId: string) => {
        return get().favorites.some(f => f.id === productId && f.type === 'product');
      },
      
      isStoreFavorite: (storeId: string) => {
        return get().favorites.some(f => f.id === storeId && f.type === 'store');
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'kafek-favorites',
    }
  )
);
