import { CartItem } from "@/types";
import { create } from "zustand";
import { CartStore } from "../types";

export const useCart = create<CartStore>((set) => ({
  cartItems: [] as CartItem[],
  addToCart: (product: CartItem) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
    })),
  removeFromCart: (productId: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== productId),
    })),
  setCartItems: (cartItems: CartItem[]) => set((state) => ({ cartItems })),
  getCartTotal: () => {
    return (state) =>
      state.cartItems.reduce(
        (total: number, item: CartItem) => total + item.price,
        0
      );
  },
  increaseItemQuantity: (productId: string) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),
  decreaseItemQuantity: (productId: string) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),
}));
