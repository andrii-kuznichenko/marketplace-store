import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuestCartItem } from '../types';

type GuestCartStore = {
  items: GuestCartItem[];
  numItemsInCart: number;
  addItem: (productId: string, amount: number, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateAmount: (productId: string, size: string, amount: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      items: [],
      numItemsInCart: 0,

      addItem: (productId, amount, size) => {
        if (!size) throw new Error('Please select a size');
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.productId === productId && cartItem.size === size,
          );
          const updatedItems = existing
            ? state.items.map((cartItem) =>
                cartItem.productId === productId && cartItem.size === size
                  ? { ...cartItem, amount: cartItem.amount + amount }
                  : cartItem,
              )
            : [...state.items, { productId, amount, size }];

          return {
            items: updatedItems,
            numItemsInCart: updatedItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
          };
        });
      },

      removeItem: (productId, size) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (cartItem) => !(cartItem.productId === productId && cartItem.size === size),
          );
          return {
            items: updatedItems,
            numItemsInCart: updatedItems.reduce((sum, cartItem) => sum + cartItem.amount, 0),
          };
        }),

      updateAmount: (productId, size, amount) =>
        set((state) => {
          const updatedItems = state.items.map((cartItem) =>
            cartItem.productId === productId && cartItem.size === size
              ? { ...cartItem, amount }
              : cartItem,
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
