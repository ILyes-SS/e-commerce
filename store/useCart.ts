import { CartItem } from "@/types";
import { create } from "zustand";
import { CartStore } from "../types";

export const useCart = create<CartStore>((set) => ({
  cartId: null,
  cartItems: [] as CartItem[],
  addToCart: (product: CartItem) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
      cartId: state.cartId || product.cartId,
    })),
  removeFromCart: (productId: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== productId),
      cartId: state.cartId || state.cartItems[0].cartId,
    })),
  setCartItems: (cartItems: CartItem[]) =>
    set((state) => ({
      cartItems,
      cartId: state.cartId || cartItems[0]?.cartId,
    })),
  setCartId: (cartId: string | null) =>
    set((state) => ({ cartId, cartItems: state.cartItems })),
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
      cartId: state.cartId || state.cartItems[0].cartId,
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
      cartId: state.cartId || state.cartItems[0].cartId,
    })),
}));
