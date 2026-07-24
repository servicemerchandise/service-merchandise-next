import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  code: string;
  name: string;
  image?: string;
  quantity: number;
  observations?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  update: (productId: string, data: Partial<CartItem>) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== productId) })),
      update: (productId, data) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, ...data } : i
          ),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: 'sm-quotation-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);