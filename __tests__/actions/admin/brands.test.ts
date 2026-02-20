import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../../mocks/prisma";
import "../../mocks/next-cache";

import {
  getBrands,
  getBrandById,
  getBrandsByCategory,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/actions/admin/brands";

describe("Admin Brand Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBrands", () => {
    it("should return all brands with category and product count", async () => {
      const mockBrands = [{ id: "b-1", title: "Brand A", _count: { products: 5 } }];
      prismaMock.brand.findMany.mockResolvedValue(mockBrands);

      const result = await getBrands();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBrands);
    });

    it("should return error on failure", async () => {
      prismaMock.brand.findMany.mockRejectedValue(new Error("fail"));

      const result = await getBrands();

      expect(result.success).toBe(false);
    });
  });

  describe("getBrandById", () => {
    it("should return a brand by id", async () => {
      const mockBrand = { id: "b-1", title: "Brand A" };
      prismaMock.brand.findUnique.mockResolvedValue(mockBrand);

      const result = await getBrandById("b-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBrand);
    });

    it("should return error on failure", async () => {
      prismaMock.brand.findUnique.mockRejectedValue(new Error("fail"));

      const result = await getBrandById("b-1");

      expect(result.success).toBe(false);
    });
  });

  describe("getBrandsByCategory", () => {
    it("should return brands for a category", async () => {
      const mockBrands = [{ id: "b-1", title: "Brand A" }];
      prismaMock.brand.findMany.mockResolvedValue(mockBrands);

      const result = await getBrandsByCategory("cat-1");

      expect(result.success).toBe(true);
      expect(prismaMock.brand.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { categoryId: "cat-1" } })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.brand.findMany.mockRejectedValue(new Error("fail"));

      const result = await getBrandsByCategory("cat-1");

      expect(result.success).toBe(false);
    });
  });

  describe("createBrand", () => {
    it("should create a brand", async () => {
      const mockBrand = { id: "b-new", title: "New Brand" };
      prismaMock.brand.create.mockResolvedValue(mockBrand);

      const result = await createBrand({ title: "New Brand", categoryId: "cat-1" });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBrand);
    });

    it("should return error on failure", async () => {
      prismaMock.brand.create.mockRejectedValue(new Error("fail"));

      const result = await createBrand({ title: "fail", categoryId: "cat-1" });

      expect(result.success).toBe(false);
    });
  });

  describe("updateBrand", () => {
    it("should update a brand", async () => {
      const mockBrand = { id: "b-1", title: "Updated" };
      prismaMock.brand.update.mockResolvedValue(mockBrand);

      const result = await updateBrand("b-1", { title: "Updated" });

      expect(result.success).toBe(true);
    });

    it("should return error on failure", async () => {
      prismaMock.brand.update.mockRejectedValue(new Error("fail"));

      const result = await updateBrand("b-1", { title: "fail" });

      expect(result.success).toBe(false);
    });
  });

  describe("deleteBrand", () => {
    it("should delete a brand", async () => {
      prismaMock.brand.delete.mockResolvedValue({});

      const result = await deleteBrand("b-1");

      expect(result.success).toBe(true);
      expect(prismaMock.brand.delete).toHaveBeenCalledWith({
        where: { id: "b-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.brand.delete.mockRejectedValue(new Error("fail"));

      const result = await deleteBrand("b-1");

      expect(result.success).toBe(false);
    });
  });
});
