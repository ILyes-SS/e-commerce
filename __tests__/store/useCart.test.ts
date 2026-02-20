import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "@/store/useCart";
import { CartItem } from "@/types";

// Helper to create a mock cart item
function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "variant-1",
    title: "Test Product",
    image: "/test.png",
    quantity: 1,
    price: 1000,
    size: "M",
    color: "red",
    stockQty: 10,
    prodVariantId: "pv-1",
    cartId: "cart-1",
    ...overrides,
  };
}

describe("useCart Store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useCart.setState({ cartId: null, cartItems: [] });
  });

  // --- addToCart ---
  describe("addToCart", () => {
    it("should add an item to the cart", () => {
      const item = createCartItem();
      useCart.getState().addToCart(item);

      const state = useCart.getState();
      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0]).toEqual(item);
    });

    it("should set cartId from the first item added", () => {
      const item = createCartItem({ cartId: "cart-abc" });
      useCart.getState().addToCart(item);

      expect(useCart.getState().cartId).toBe("cart-abc");
    });

    it("should not overwrite cartId when a second item is added", () => {
      useCart.setState({ cartId: "existing-cart" });
      const item = createCartItem({ cartId: "new-cart" });
      useCart.getState().addToCart(item);

      expect(useCart.getState().cartId).toBe("existing-cart");
    });

    it("should add multiple items", () => {
      const item1 = createCartItem({ id: "v1", title: "Product 1" });
      const item2 = createCartItem({ id: "v2", title: "Product 2" });

      useCart.getState().addToCart(item1);
      useCart.getState().addToCart(item2);

      expect(useCart.getState().cartItems).toHaveLength(2);
    });
  });

  // --- removeFromCart ---
  describe("removeFromCart", () => {
    it("should remove an item by id", () => {
      const item = createCartItem({ id: "v1" });
      useCart.setState({ cartItems: [item], cartId: "cart-1" });

      useCart.getState().removeFromCart("v1");

      expect(useCart.getState().cartItems).toHaveLength(0);
    });

    it("should not remove items with a different id", () => {
      const item1 = createCartItem({ id: "v1", title: "Keep" });
      const item2 = createCartItem({ id: "v2", title: "Remove" });
      useCart.setState({ cartItems: [item1, item2], cartId: "cart-1" });

      useCart.getState().removeFromCart("v2");

      expect(useCart.getState().cartItems).toHaveLength(1);
      expect(useCart.getState().cartItems[0].id).toBe("v1");
    });

    it("should do nothing if id does not exist", () => {
      const item = createCartItem({ id: "v1" });
      useCart.setState({ cartItems: [item], cartId: "cart-1" });

      useCart.getState().removeFromCart("nonexistent");

      expect(useCart.getState().cartItems).toHaveLength(1);
    });
  });

  // --- increaseItemQuantity ---
  describe("increaseItemQuantity", () => {
    it("should increment quantity by 1", () => {
      const item = createCartItem({ id: "v1", quantity: 2 });
      useCart.setState({ cartItems: [item], cartId: "cart-1" });

      useCart.getState().increaseItemQuantity("v1");

      expect(useCart.getState().cartItems[0].quantity).toBe(3);
    });

    it("should only increment the matching item", () => {
      const item1 = createCartItem({ id: "v1", quantity: 1 });
      const item2 = createCartItem({ id: "v2", quantity: 5 });
      useCart.setState({ cartItems: [item1, item2], cartId: "cart-1" });

      useCart.getState().increaseItemQuantity("v1");

      expect(useCart.getState().cartItems[0].quantity).toBe(2);
      expect(useCart.getState().cartItems[1].quantity).toBe(5);
    });
  });

  // --- decreaseItemQuantity ---
  describe("decreaseItemQuantity", () => {
    it("should decrement quantity by 1", () => {
      const item = createCartItem({ id: "v1", quantity: 3 });
      useCart.setState({ cartItems: [item], cartId: "cart-1" });

      useCart.getState().decreaseItemQuantity("v1");

      expect(useCart.getState().cartItems[0].quantity).toBe(2);
    });

    it("should remove the item when quantity reaches 0", () => {
      const item = createCartItem({ id: "v1", quantity: 1 });
      useCart.setState({ cartItems: [item], cartId: "cart-1" });

      useCart.getState().decreaseItemQuantity("v1");

      expect(useCart.getState().cartItems).toHaveLength(0);
    });

    it("should not affect other items when one is removed", () => {
      const item1 = createCartItem({ id: "v1", quantity: 1 });
      const item2 = createCartItem({ id: "v2", quantity: 3 });
      useCart.setState({ cartItems: [item1, item2], cartId: "cart-1" });

      useCart.getState().decreaseItemQuantity("v1");

      expect(useCart.getState().cartItems).toHaveLength(1);
      expect(useCart.getState().cartItems[0].id).toBe("v2");
    });
  });

  // --- setCartItems ---
  describe("setCartItems", () => {
    it("should replace all cart items", () => {
      const existing = createCartItem({ id: "old" });
      useCart.setState({ cartItems: [existing] });

      const newItems = [
        createCartItem({ id: "new1" }),
        createCartItem({ id: "new2" }),
      ];
      useCart.getState().setCartItems(newItems);

      expect(useCart.getState().cartItems).toHaveLength(2);
      expect(useCart.getState().cartItems[0].id).toBe("new1");
    });

    it("should set cartId from first item if cartId was null", () => {
      useCart.setState({ cartId: null, cartItems: [] });

      const items = [createCartItem({ cartId: "cart-xyz" })];
      useCart.getState().setCartItems(items);

      expect(useCart.getState().cartId).toBe("cart-xyz");
    });

    it("should clear cart when given empty array", () => {
      useCart.setState({
        cartItems: [createCartItem()],
        cartId: "cart-1",
      });

      useCart.getState().setCartItems([]);

      expect(useCart.getState().cartItems).toHaveLength(0);
    });
  });

  // --- setCartId ---
  describe("setCartId", () => {
    it("should update the cartId", () => {
      useCart.getState().setCartId("new-cart-id");
      expect(useCart.getState().cartId).toBe("new-cart-id");
    });

    it("should allow setting cartId to null", () => {
      useCart.setState({ cartId: "some-id" });
      useCart.getState().setCartId(null);
      expect(useCart.getState().cartId).toBeNull();
    });
  });

  // --- getCartTotal ---
  describe("getCartTotal", () => {
    it("should return 0 for empty cart", () => {
      const totalFn = useCart.getState().getCartTotal();
      const result = totalFn({ cartItems: [] });
      expect(result).toBe(0);
    });

    it("should sum all item prices", () => {
      const items = [
        createCartItem({ price: 500 }),
        createCartItem({ price: 1500 }),
      ];
      const totalFn = useCart.getState().getCartTotal();
      const result = totalFn({ cartItems: items });
      expect(result).toBe(2000);
    });
  });
});
