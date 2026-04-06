import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuestCartItem } from '../types';

type GuestCartStore = {
  items: GuestCartItem[];
  numItemsInCart: number;
  addItem: (productId: string, amount?: number) => void;
  removeItem: (productId: string) => void;
  updateAmount: (productId: string, amount: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      items: [],
      numItemsInCart: 0,

      addItem: (productId, amount = 1) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.productId === productId,
          );
          const updatedItems = existing
            ? state.items.map((cartItem) =>
                cartItem.productId === productId
                  ? { ...cartItem, amount: cartItem.amount + amount }
                  : cartItem,
              )
            : [...state.items, { productId, amount }];

          return {
            items: updatedItems,
            numItemsInCart: updatedItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (cartItem) => cartItem.productId !== productId,
          );
          return {
            items: updatedItems,
            numItemsInCart: updatedItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
          };
        }),

      updateAmount: (productId, amount) =>
        set((state) => {
          const updatedItems = state.items.map((cartItem) =>
            cartItem.productId === productId ? { ...cartItem, amount } : cartItem,
          );
          return {
            items: updatedItems,
            numItemsInCart: updatedItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
          };
        }),

      clearCart: () => set({ items: [], numItemsInCart: 0 }),
    }),
    { name: 'guest-cart' },
  ),
);
