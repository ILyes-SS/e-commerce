import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../mocks/prisma";
import "../mocks/next-cache";

import { createOrder, getWilayas, getUserOrders } from "@/actions/order";

describe("Order Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- createOrder ---
  describe("createOrder", () => {
    const validOrderData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "0555123456",
      wilayaId: "w-1",
      customerId: "user-1",
      items: [
        { prodVariantId: "pv-1", quantity: 2, priceAtPurchase: 1000 },
        { prodVariantId: "pv-2", quantity: 1, priceAtPurchase: 2000 },
      ],
      total: 4000,
    };

    it("should create an order within a transaction", async () => {
      const mockOrder = { id: "order-1", ...validOrderData, status: "PENDING" };

      prismaMock.order.create.mockResolvedValue(mockOrder);
      prismaMock.productVariant.update.mockResolvedValue({});
      prismaMock.cart.findUnique.mockResolvedValue({ id: "cart-1" });
      prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      const result = await createOrder(validOrderData);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    });

    it("should decrement stock for each item", async () => {
      const mockOrder = { id: "order-1", status: "PENDING" };
      prismaMock.order.create.mockResolvedValue(mockOrder);
      prismaMock.productVariant.update.mockResolvedValue({});
      prismaMock.cart.findUnique.mockResolvedValue(null);

      await createOrder(validOrderData);

      expect(prismaMock.productVariant.update).toHaveBeenCalledTimes(2);
    });

    it("should clear cart for logged-in users", async () => {
      const mockOrder = { id: "order-1", status: "PENDING" };
      prismaMock.order.create.mockResolvedValue(mockOrder);
      prismaMock.productVariant.update.mockResolvedValue({});
      prismaMock.cart.findUnique.mockResolvedValue({ id: "cart-1" });
      prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      await createOrder(validOrderData);

      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
      expect(prismaMock.cartItem.deleteMany).toHaveBeenCalled();
    });

    it("should not clear cart for guest orders", async () => {
      const guestOrder = { ...validOrderData, customerId: null };
      const mockOrder = { id: "order-1", status: "PENDING" };
      prismaMock.order.create.mockResolvedValue(mockOrder);
      prismaMock.productVariant.update.mockResolvedValue({});

      await createOrder(guestOrder);

      expect(prismaMock.cart.findUnique).not.toHaveBeenCalled();
    });

    it("should round the total", async () => {
      const orderData = { ...validOrderData, total: 1999.7 };
      const mockOrder = { id: "order-1" };
      prismaMock.order.create.mockResolvedValue(mockOrder);
      prismaMock.productVariant.update.mockResolvedValue({});
      prismaMock.cart.findUnique.mockResolvedValue(null);

      await createOrder(orderData);

      expect(prismaMock.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ total: 2000 }),
        })
      );
    });
  });

  // --- getWilayas ---
  describe("getWilayas", () => {
    it("should return wilayas ordered by name", async () => {
      const mockWilayas = [
        { id: "w-1", name: "Alger", price: 500 },
        { id: "w-2", name: "Oran", price: 800 },
      ];
      prismaMock.wilaya.findMany.mockResolvedValue(mockWilayas);

      const result = await getWilayas();

      expect(result).toEqual(mockWilayas);
      expect(prismaMock.wilaya.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });
    });

    it("should throw on error", async () => {
      prismaMock.wilaya.findMany.mockRejectedValue(new Error("DB error"));

      await expect(getWilayas()).rejects.toThrow("DB error");
    });
  });

  // --- getUserOrders ---
  describe("getUserOrders", () => {
    it("should return empty array when no userId or email", async () => {
      const result = await getUserOrders(undefined, undefined);
      expect(result).toEqual([]);
    });

    it("should fetch orders by userId", async () => {
      const mockOrders = [{ id: "order-1", customerId: "user-1" }];
      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const result = await getUserOrders("user-1", undefined);

      expect(result).toEqual(mockOrders);
      expect(prismaMock.order.findMany).toHaveBeenCalledOnce();
    });

    it("should fetch orders by email", async () => {
      const mockOrders = [{ id: "order-1", email: "test@test.com" }];
      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const result = await getUserOrders(undefined, "test@test.com");

      expect(result).toEqual(mockOrders);
    });

    it("should throw on error", async () => {
      prismaMock.order.findMany.mockRejectedValue(new Error("DB error"));

      await expect(getUserOrders("user-1", "a@b.com")).rejects.toThrow();
    });
  });
});
