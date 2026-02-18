"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface BrandData {
  title: string;
  categoryId: string;
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { title: "asc" },
    });
    return { success: true, data: brands };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { success: false, error: "Failed to fetch brands" };
  }
}

export async function getBrandById(id: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return { success: true, data: brand };
  } catch (error) {
    console.error("Error fetching brand:", error);
    return { success: false, error: "Failed to fetch brand" };
  }
}

export async function getBrandsByCategory(categoryId: string) {
  try {
    const brands = await prisma.brand.findMany({
      where: { categoryId },
      orderBy: { title: "asc" },
    });
    return { success: true, data: brands };
  } catch (error) {
    console.error("Error fetching brands by category:", error);
    return { success: false, error: "Failed to fetch brands" };
  }
}

export async function createBrand(data: BrandData) {
  try {
    const brand = await prisma.brand.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: brand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: "Failed to create brand" };
  }
}

export async function updateBrand(id: string, data: Partial<BrandData>) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        title: data.title,
        categoryId: data.categoryId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: brand };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { success: false, error: "Failed to update brand" };
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: "Failed to delete brand" };
  }
}
