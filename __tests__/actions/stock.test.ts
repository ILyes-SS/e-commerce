import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../mocks/prisma";
import "../mocks/next-cache";

import {
  getProductsWithVariantsStock,
  getVariantsByProductId,
  updateStockQty,
  bulkUpdateStock,
  deleteStock,
} from "@/actions/stock";

describe("Stock Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- getProductsWithVariantsStock ---
  describe("getProductsWithVariantsStock", () => {
    it("should return products with variants and stock", async () => {
      const mockProducts = [
        { id: "p-1", name: "Product 1", variants: [{ stock: { qty: 5 } }] },
      ];
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const result = await getProductsWithVariantsStock();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProducts);
    });

    it("should return error on failure", async () => {
      prismaMock.product.findMany.mockRejectedValue(new Error("fail"));

      const result = await getProductsWithVariantsStock();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch data");
    });
  });

  // --- getVariantsByProductId ---
  describe("getVariantsByProductId", () => {
    it("should return variants for a product", async () => {
      const mockVariants = [{ id: "v-1", prodId: "p-1", stock: { qty: 10 } }];
      prismaMock.productVariant.findMany.mockResolvedValue(mockVariants);

      const result = await getVariantsByProductId("p-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVariants);
      expect(prismaMock.productVariant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { prodId: "p-1" } })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.productVariant.findMany.mockRejectedValue(new Error("fail"));

      const result = await getVariantsByProductId("p-1");

      expect(result.success).toBe(false);
    });
  });

  // --- updateStockQty ---
  describe("updateStockQty", () => {
    it("should update existing stock", async () => {
      prismaMock.stock.findUnique.mockResolvedValue({ id: "s-1", qty: 5 });
      prismaMock.stock.update.mockResolvedValue({ id: "s-1", qty: 15 });

      const result = await updateStockQty("v-1", 15);

      expect(result.success).toBe(true);
      expect(prismaMock.stock.update).toHaveBeenCalledWith({
        where: { prodVariantId: "v-1" },
        data: { qty: 15 },
      });
    });

    it("should create stock if it does not exist", async () => {
      prismaMock.stock.findUnique.mockResolvedValue(null);
      prismaMock.stock.create.mockResolvedValue({ id: "s-new", qty: 10 });

      const result = await updateStockQty("v-1", 10);

      expect(result.success).toBe(true);
      expect(prismaMock.stock.create).toHaveBeenCalledWith({
        data: { qty: 10, prodVariantId: "v-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.stock.findUnique.mockRejectedValue(new Error("fail"));

      const result = await updateStockQty("v-1", 10);

      expect(result.success).toBe(false);
    });
  });

  // --- bulkUpdateStock ---
  describe("bulkUpdateStock", () => {
    it("should update multiple stocks", async () => {
      prismaMock.stock.findUnique
        .mockResolvedValueOnce({ id: "s-1", qty: 5 })
        .mockResolvedValueOnce(null);
      prismaMock.stock.update.mockResolvedValue({});
      prismaMock.stock.create.mockResolvedValue({});

      const updates = [
        { variantId: "v-1", qty: 10 },
        { variantId: "v-2", qty: 20 },
      ];

      const result = await bulkUpdateStock(updates);

      expect(result.success).toBe(true);
      expect(prismaMock.stock.update).toHaveBeenCalledOnce();
      expect(prismaMock.stock.create).toHaveBeenCalledOnce();
    });

    it("should return error on failure", async () => {
      prismaMock.stock.findUnique.mockRejectedValue(new Error("fail"));

      const result = await bulkUpdateStock([{ variantId: "v-1", qty: 10 }]);

      expect(result.success).toBe(false);
    });
  });

  // --- deleteStock ---
  describe("deleteStock", () => {
    it("should delete stock for a variant", async () => {
      prismaMock.stock.deleteMany.mockResolvedValue({ count: 1 });

      const result = await deleteStock("v-1");

      expect(result.success).toBe(true);
      expect(prismaMock.stock.deleteMany).toHaveBeenCalledWith({
        where: { prodVariantId: "v-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.stock.deleteMany.mockRejectedValue(new Error("fail"));

      const result = await deleteStock("v-1");

      expect(result.success).toBe(false);
    });
  });
});
