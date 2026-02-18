"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CategoryData {
  title: string;
  slug?: string | null;
  image?: string | null;
  parentCategoryId?: string | null;
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { title: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoriesTree() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentCategoryId: null },
      include: {
        subcategories: {
          include: {
            subcategories: true,
          },
        },
        _count: {
          select: { products: true, brands: true },
        },
      },
      orderBy: { title: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories tree:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parentCategory: true,
        subcategories: true,
      },
    });
    return { success: true, data: category };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function createCategory(data: CategoryData) {
  try {
    const category = await prisma.category.create({
      data: {
        title: data.title,
        slug: data.slug,
        image: data.image,
        parentCategoryId: data.parentCategoryId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: Partial<CategoryData>) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        image: data.image,
        parentCategoryId: data.parentCategoryId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
