import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../../mocks/prisma";
import "../../mocks/next-cache";

import {
  getAllCategories,
  getCategoriesTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/admin/categories";

describe("Admin Category Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("should return all categories ordered by title", async () => {
      const mockCats = [{ id: "c-1", title: "Electronics" }];
      prismaMock.category.findMany.mockResolvedValue(mockCats);

      const result = await getAllCategories();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCats);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        orderBy: { title: "asc" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.category.findMany.mockRejectedValue(new Error("fail"));

      const result = await getAllCategories();

      expect(result.success).toBe(false);
    });
  });

  describe("getCategoriesTree", () => {
    it("should return root categories with subcategories", async () => {
      const mockTree = [
        { id: "c-1", title: "Root", subcategories: [{ id: "c-2", title: "Sub" }] },
      ];
      prismaMock.category.findMany.mockResolvedValue(mockTree);

      const result = await getCategoriesTree();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTree);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { parentCategoryId: null } })
      );
    });
  });

  describe("getCategoryById", () => {
    it("should return a category by id", async () => {
      const mockCat = { id: "c-1", title: "Electronics" };
      prismaMock.category.findUnique.mockResolvedValue(mockCat);

      const result = await getCategoryById("c-1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCat);
    });

    it("should return error on failure", async () => {
      prismaMock.category.findUnique.mockRejectedValue(new Error("fail"));

      const result = await getCategoryById("c-1");

      expect(result.success).toBe(false);
    });
  });

  describe("createCategory", () => {
    it("should create a category", async () => {
      const mockCat = { id: "c-new", title: "New Category" };
      prismaMock.category.create.mockResolvedValue(mockCat);

      const result = await createCategory({ title: "New Category" });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCat);
    });

    it("should create a subcategory with parentCategoryId", async () => {
      prismaMock.category.create.mockResolvedValue({ id: "c-sub" });

      await createCategory({
        title: "Sub",
        parentCategoryId: "c-parent",
      });

      expect(prismaMock.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ parentCategoryId: "c-parent" }),
        })
      );
    });

    it("should return error on failure", async () => {
      prismaMock.category.create.mockRejectedValue(new Error("fail"));

      const result = await createCategory({ title: "test" });

      expect(result.success).toBe(false);
    });
  });

  describe("updateCategory", () => {
    it("should update a category", async () => {
      const mockCat = { id: "c-1", title: "Updated" };
      prismaMock.category.update.mockResolvedValue(mockCat);

      const result = await updateCategory("c-1", { title: "Updated" });

      expect(result.success).toBe(true);
    });

    it("should return error on failure", async () => {
      prismaMock.category.update.mockRejectedValue(new Error("fail"));

      const result = await updateCategory("c-1", { title: "fail" });

      expect(result.success).toBe(false);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category", async () => {
      prismaMock.category.delete.mockResolvedValue({});

      const result = await deleteCategory("c-1");

      expect(result.success).toBe(true);
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: "c-1" },
      });
    });

    it("should return error on failure", async () => {
      prismaMock.category.delete.mockRejectedValue(new Error("fail"));

      const result = await deleteCategory("c-1");

      expect(result.success).toBe(false);
    });
  });
});
