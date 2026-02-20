import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../../mocks/prisma";
import "../../mocks/next-cache";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
} from "@/actions/admin/products";

describe("Admin Product Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- getProducts ---
  describe("getProducts", () => {
    it("should return all products with relations", async () => {
      const mockProducts = [{ id: "p-1", name: "Product 1" }];
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const result = await getProducts();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProducts);
    });

    it("should return error on failure", async () => {
      prismaMock.product.findMany.mockRejectedValue(new Error("fail"));

      const result = await getProducts();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch products");
    });
  });

  // --- getProductById ---
  describe("getProductById", () => {
    it("should return a product by id", async () => {
      const mockProduct = { id: "p-1", name: "Product 1" };
      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      const result = await getProductById("p-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "p-1" } })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.product.findUnique.mockRejectedValue(new Error("fail"));

      const result = await getProductById("p-1");

      expect(result.success).toBe(false);
    });
  });

  // --- createProduct ---
  describe("createProduct", () => {
    const validData = {
      name: "New Product",
      slug: "new-product",
      image: "/img.png",
      description: "A product",
      categoryId: "cat-1",
      brandId: "brand-1",
    };

    it("should create a product", async () => {
      const mockProduct = { id: "p-new", ...validData };
      prismaMock.product.create.mockResolvedValue(mockProduct);

      const result = await createProduct(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
    });

    it("should default lowStock to 5", async () => {
      prismaMock.product.create.mockResolvedValue({ id: "p-new" });

      await createProduct(validData);

      expect(prismaMock.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ lowStock: 5 }),
        })
      );
    });

    it("should use provided lowStock value", async () => {
      prismaMock.product.create.mockResolvedValue({ id: "p-new" });

      await createProduct({ ...validData, lowStock: 10 });

      expect(prismaMock.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ lowStock: 10 }),
        })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.product.create.mockRejectedValue(new Error("fail"));

      const result = await createProduct(validData);

      expect(result.success).toBe(false);
    });
  });

  // --- updateProduct ---
  describe("updateProduct", () => {
    it("should update a product", async () => {
      const mockProduct = { id: "p-1", name: "Updated" };
      prismaMock.product.update.mockResolvedValue(mockProduct);

      const result = await updateProduct("p-1", { name: "Updated" });

      expect(result.success).toBe(true);
      expect(prismaMock.product.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "p-1" } })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.product.update.mockRejectedValue(new Error("fail"));

      const result = await updateProduct("p-1", { name: "Updated" });

      expect(result.success).toBe(false);
    });
  });

  // --- deleteProduct ---
  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      prismaMock.product.delete.mockResolvedValue({});

      const result = await deleteProduct("p-1");

      expect(result.success).toBe(true);
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: "p-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.product.delete.mockRejectedValue(new Error("fail"));

      const result = await deleteProduct("p-1");

      expect(result.success).toBe(false);
    });
  });

  // --- addProductImage ---
  describe("addProductImage", () => {
    it("should add an image to a product", async () => {
      const mockImage = { id: "img-1", productId: "p-1", imageUrl: "/img.png", sortOrder: 0 };
      prismaMock.productImage.create.mockResolvedValue(mockImage);

      const result = await addProductImage("p-1", "/img.png", 0);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockImage);
    });

    it("should return error on failure", async () => {
      prismaMock.productImage.create.mockRejectedValue(new Error("fail"));

      const result = await addProductImage("p-1", "/img.png", 0);

      expect(result.success).toBe(false);
    });
  });

  // --- deleteProductImage ---
  describe("deleteProductImage", () => {
    it("should delete a product image", async () => {
      prismaMock.productImage.delete.mockResolvedValue({});

      const result = await deleteProductImage("img-1");

      expect(result.success).toBe(true);
    });

    it("should return error on failure", async () => {
      prismaMock.productImage.delete.mockRejectedValue(new Error("fail"));

      const result = await deleteProductImage("img-1");

      expect(result.success).toBe(false);
    });
  });
});
