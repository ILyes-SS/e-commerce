import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../mocks/prisma";
import "../mocks/next-cache";

import {
  getCartWithItems,
  addToCartDb,
  clearCartDb,
  decreaseItemQuantityDb,
  increaseItemQuantityDb,
  removeCartItemDb,
} from "@/actions/cart";

describe("Cart Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- getCartWithItems ---
  describe("getCartWithItems", () => {
    it("should return null when userId is undefined", async () => {
      const result = await getCartWithItems(undefined);
      expect(result).toBeNull();
    });

    it("should upsert and return cart with items", async () => {
      const mockCart = {
        id: "cart-1",
        userId: "user-1",
        items: [
          {
            id: "ci-1",
            quantity: 2,
            cartId: "cart-1",
            productVariant: {
              id: "pv-1",
              product: { id: "p-1", name: "Test" },
              stock: { qty: 10 },
            },
          },
        ],
      };
      prismaMock.cart.upsert.mockResolvedValue(mockCart);

      const result = await getCartWithItems("user-1");

      expect(prismaMock.cart.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1" },
          create: { userId: "user-1" },
        })
      );
      expect(result).toEqual(mockCart);
    });

    it("should throw when prisma errors", async () => {
      prismaMock.cart.upsert.mockRejectedValue(new Error("DB error"));

      await expect(getCartWithItems("user-1")).rejects.toThrow("DB error");
    });
  });

  // --- addToCartDb ---
  describe("addToCartDb", () => {
    it("should create a cart item successfully", async () => {
      const mockItem = { id: "ci-1", quantity: 1, cartId: "cart-1" };
      prismaMock.cartItem.create.mockResolvedValue(mockItem);

      const cartItem = {
        id: "pv-1",
        title: "Test",
        image: "/test.png",
        quantity: 1,
        price: 1000,
        size: "M",
        color: "red",
        stockQty: 10,
        prodVariantId: "pv-1",
        cartId: "cart-1",
      };

      const result = await addToCartDb("cart-1", cartItem);

      expect(result.success).toBe(true);
      expect(result.item).toEqual(mockItem);
      expect(prismaMock.cartItem.create).toHaveBeenCalledOnce();
    });

    it("should return error when cartId is undefined", async () => {
      const cartItem = {
        id: "pv-1",
        title: "Test",
        image: "/test.png",
        quantity: 1,
        price: 1000,
        size: null,
        color: null,
        stockQty: 10,
        prodVariantId: "pv-1",
        cartId: "cart-1",
      };

      const result = await addToCartDb(undefined, cartItem);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should return error when cartItem.id is empty", async () => {
      const cartItem = {
        id: "",
        title: "Test",
        image: "/test.png",
        quantity: 1,
        price: 1000,
        size: null,
        color: null,
        stockQty: 10,
        prodVariantId: "pv-1",
        cartId: "cart-1",
      };

      const result = await addToCartDb("cart-1", cartItem);

      expect(result.success).toBe(false);
    });
  });

  // --- clearCartDb ---
  describe("clearCartDb", () => {
    it("should delete all cart items for given cartId", async () => {
      prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      const result = await clearCartDb("cart-1");

      expect(result.success).toBe(true);
      expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: "cart-1" },
      });
    });

    it("should return error when cartId is undefined", async () => {
      const result = await clearCartDb(undefined);

      expect(result.success).toBe(false);
    });
  });

  // --- increaseItemQuantityDb ---
  describe("increaseItemQuantityDb", () => {
    it("should increment quantity for the variant", async () => {
      prismaMock.cartItem.updateMany.mockResolvedValue({ count: 1 });

      const result = await increaseItemQuantityDb("pv-1", "cart-1");

      expect(result.success).toBe(true);
      expect(prismaMock.cartItem.updateMany).toHaveBeenCalledWith({
        where: { prodVariantId: "pv-1", cartId: "cart-1" },
        data: { quantity: { increment: 1 } },
      });
    });

    it("should return error when variantId is empty", async () => {
      const result = await increaseItemQuantityDb("", "cart-1");
      expect(result.success).toBe(false);
    });

    it("should return error when cartId is empty", async () => {
      const result = await increaseItemQuantityDb("pv-1", "");
      expect(result.success).toBe(false);
    });
  });

  // --- decreaseItemQuantityDb ---
  describe("decreaseItemQuantityDb", () => {
    it("should decrement quantity", async () => {
      prismaMock.cartItem.updateManyAndReturn.mockResolvedValue([
        { id: "ci-1", quantity: 2, prodVariantId: "pv-1", cartId: "cart-1" },
      ]);

      const result = await decreaseItemQuantityDb("pv-1", "cart-1");

      expect(result.success).toBe(true);
      expect(prismaMock.cartItem.updateManyAndReturn).toHaveBeenCalledWith({
        where: { prodVariantId: "pv-1", cartId: "cart-1" },
        data: { quantity: { decrement: 1 } },
      });
    });

    it("should remove item when quantity reaches 0", async () => {
      prismaMock.cartItem.updateManyAndReturn.mockResolvedValue([
        { id: "ci-1", quantity: 0, prodVariantId: "pv-1", cartId: "cart-1" },
      ]);
      prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      await decreaseItemQuantityDb("pv-1", "cart-1");

      expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { prodVariantId: "pv-1", cartId: "cart-1" },
      });
    });

    it("should return error when variantId is empty", async () => {
      const result = await decreaseItemQuantityDb("", "cart-1");
      expect(result.success).toBe(false);
    });
  });

  // --- removeCartItemDb ---
  describe("removeCartItemDb", () => {
    it("should delete cart items matching variant and cart", async () => {
      prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      const result = await removeCartItemDb("pv-1", "cart-1");

      expect(result.success).toBe(true);
      expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { prodVariantId: "pv-1", cartId: "cart-1" },
      });
    });

    it("should handle prisma errors gracefully", async () => {
      prismaMock.cartItem.deleteMany.mockRejectedValue(new Error("DB error"));

      const result = await removeCartItemDb("pv-1", "cart-1");

      expect(result.success).toBe(false);
    });
  });
});
