"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrendingProducts() {
  try {
    const trending = await prisma.trending.findMany({
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            variants: {
              include: {
                stock: true,
              },
              take: 1,
            },
          },
        },
      },
    });
    return { success: true, data: trending };
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return { success: false, error: "Failed to fetch trending products" };
  }
}

export async function getAvailableProductsForTrending() {
  try {
    // Get products that are not already in trending
    const trendingProdIds = await prisma.trending.findMany({
      select: { prodId: true },
    });
    
    const products = await prisma.product.findMany({
      where: {
        id: {
          notIn: trendingProdIds.map((t) => t.prodId),
        },
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching available products:", error);
    return { success: false, error: "Failed to fetch available products" };
  }
}

export async function addTrending(prodId: string) {
  try {
    const trending = await prisma.trending.create({
      data: {
        prodId,
      },
      include: {
        product: true,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: trending };
  } catch (error) {
    console.error("Error adding trending product:", error);
    return { success: false, error: "Failed to add trending product" };
  }
}

export async function removeTrending(id: string) {
  try {
    await prisma.trending.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error removing trending product:", error);
    return { success: false, error: "Failed to remove trending product" };
  }
}
