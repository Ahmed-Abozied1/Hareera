import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: CartLine) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

const sameLine = (a: CartLine, productId: string, size: string, color: string) =>
  a.productId === productId && a.size === size && a.color === color;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (line) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, line.productId, line.size, line.color)
          );
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                sameLine(i, line.productId, line.size, line.color)
                  ? { ...i, quantity: i.quantity + line.quantity }
                  : i
              ),
            };
          }
          return { isOpen: true, items: [...state.items, line] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, size, color)),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, size, color)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "hareera-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
