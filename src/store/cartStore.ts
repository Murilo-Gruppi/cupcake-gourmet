/**
 * Store Zustand para o carrinho de compras local (usuários anônimos).
 *
 * Quando o usuário faz login, o componente CartSync migra
 * os itens locais para o carrinho persistido no banco via API.
 *
 * Usuários autenticados usam a API diretamente; este store
 * serve apenas como estado temporário pré-login.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalCartItem } from "@/types/cart";

interface CartStore {
  items: LocalCartItem[];
  addItem: (item: LocalCartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? {
                      ...i,
                      quantity: Math.min(99, i.quantity + newItem.quantity),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) }
              : i
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.productPrice * item.quantity,
          0
        ),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cupcake-cart",
      version: 1,
    }
  )
);
