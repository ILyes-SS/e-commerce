import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../../mocks/prisma";
import "../../mocks/next-cache";

import {
  getVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/actions/admin/variants";

describe("Admin Variant Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getVariants", () => {
    it("should return all variants with product and stock", async () => {
      const mockVariants = [{ id: "v-1", price: 1000, product: { name: "Prod" } }];
      prismaMock.productVariant.findMany.mockResolvedValue(mockVariants);

      const result = await getVariants();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVariants);
    });

    it("should return error on failure", async () => {
      prismaMock.productVariant.findMany.mockRejectedValue(new Error("fail"));

      const result = await getVariants();

      expect(result.success).toBe(false);
    });
  });

  describe("getVariantById", () => {
    it("should return a variant by id", async () => {
      const mockVariant = { id: "v-1", price: 1000 };
      prismaMock.productVariant.findUnique.mockResolvedValue(mockVariant);

      const result = await getVariantById("v-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVariant);
    });

    it("should return error on failure", async () => {
      prismaMock.productVariant.findUnique.mockRejectedValue(new Error("fail"));

      const result = await getVariantById("v-1");

      expect(result.success).toBe(false);
    });
  });

  describe("createVariant", () => {
    it("should create a variant without stock", async () => {
      const mockVariant = { id: "v-new", price: 1500 };
      prismaMock.productVariant.create.mockResolvedValue(mockVariant);

      const result = await createVariant({
        price: 1500,
        prodId: "p-1",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVariant);
    });

    it("should create a variant with stock when stockQty is provided", async () => {
      prismaMock.productVariant.create.mockResolvedValue({ id: "v-new" });

      await createVariant({
        price: 1500,
        prodId: "p-1",
        stockQty: 25,
      });

      expect(prismaMock.productVariant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            stock: { create: { qty: 25 } },
          }),
        })
      );
    });

    it("should include optional fields", async () => {
      prismaMock.productVariant.create.mockResolvedValue({ id: "v-new" });

      await createVariant({
        price: 2000,
        prodId: "p-1",
        color: "blue",
        size: "L",
        unit: "kg",
        compareAtPrice: 2500,
      });

      expect(prismaMock.productVariant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            color: "blue",
            size: "L",
            unit: "kg",
            compareAtPrice: 2500,
          }),
        })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.productVariant.create.mockRejectedValue(new Error("fail"));

      const result = await createVariant({ price: 100, prodId: "p-1" });

      expect(result.success).toBe(false);
    });
  });

  describe("updateVariant", () => {
    it("should update variant fields", async () => {
      const mockVariant = { id: "v-1", price: 2000, stock: null };
      prismaMock.productVariant.update.mockResolvedValue(mockVariant);

      const result = await updateVariant("v-1", { price: 2000 });

      expect(result.success).toBe(true);
    });

    it("should update stock when stockQty is provided and stock exists", async () => {
      const mockVariant = { id: "v-1", stock: { id: "s-1", qty: 5 } };
      prismaMock.productVariant.update.mockResolvedValue(mockVariant);
      prismaMock.stock.update.mockResolvedValue({});

      await updateVariant("v-1", { stockQty: 15 });

      expect(prismaMock.stock.update).toHaveBeenCalledWith({
        where: { prodVariantId: "v-1" },
        data: { qty: 15 },
      });
    });

    it("should create stock when stockQty is provided and no stock exists", async () => {
      const mockVariant = { id: "v-1", stock: null };
      prismaMock.productVariant.update.mockResolvedValue(mockVariant);
      prismaMock.stock.create.mockResolvedValue({});

      await updateVariant("v-1", { stockQty: 10 });

      expect(prismaMock.stock.create).toHaveBeenCalledWith({
        data: { qty: 10, prodVariantId: "v-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.productVariant.update.mockRejectedValue(new Error("fail"));

      const result = await updateVariant("v-1", { price: 100 });

      expect(result.success).toBe(false);
    });
  });

  describe("deleteVariant", () => {
    it("should delete stock first then the variant", async () => {
      prismaMock.stock.deleteMany.mockResolvedValue({ count: 1 });
      prismaMock.productVariant.delete.mockResolvedValue({});

      const result = await deleteVariant("v-1");

      expect(result.success).toBe(true);
      expect(prismaMock.stock.deleteMany).toHaveBeenCalledWith({
        where: { prodVariantId: "v-1" },
      });
      expect(prismaMock.productVariant.delete).toHaveBeenCalledWith({
        where: { id: "v-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.stock.deleteMany.mockRejectedValue(new Error("fail"));

      const result = await deleteVariant("v-1");

      expect(result.success).toBe(false);
    });
  });
});
