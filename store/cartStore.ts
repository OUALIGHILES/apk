import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/api/cart';

interface CartState {
  items: CartItem[];
  providerId: string | null;
  loading: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setProviderId: (providerId: string | null) => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      providerId: null,
      loading: false,

      addItem: (item) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product_id === item.product_id);
        
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...currentItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + item.quantity,
            total_amount: updatedItems[existingIndex].total_amount + item.total_amount,
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          set({ items: [...currentItems, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product_id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const items = get().items.map((item) => {
          if (item.product_id === productId) {
            return {
              ...item,
              quantity,
              total_amount: item.product_price * quantity + (item.extra_items?.reduce((sum, extra) => sum + extra.extra_item_price * extra.extra_item_qty, 0) || 0),
            };
          }
          return item;
        });
        set({ items });
      },

      clearCart: () => {
        set({ items: [], providerId: null });
      },

      setProviderId: (providerId) => {
        set({ providerId });
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.total_amount, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, providerId: state.providerId }),
    }
  )
);
