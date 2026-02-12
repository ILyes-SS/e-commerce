"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all products with their variants and stock info (for the stock page)
export async function getProductsWithVariantsStock() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        lowStock: true,
        variants: {
          include: {
            stock: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products with variants:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

// Get variants for a specific product (used in Add Stock dialog)
export async function getVariantsByProductId(productId: string) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { prodId: productId },
      include: {
        stock: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: variants };
  } catch (error) {
    console.error("Error fetching variants:", error);
    return { success: false, error: "Failed to fetch variants" };
  }
}

// Update stock quantity for a single variant
export async function updateStockQty(variantId: string, qty: number) {
  try {
    const existingStock = await prisma.stock.findUnique({
      where: { prodVariantId: variantId },
    });

    if (existingStock) {
      await prisma.stock.update({
        where: { prodVariantId: variantId },
        data: { qty },
      });
    } else {
      await prisma.stock.create({
        data: {
          qty,
          prodVariantId: variantId,
        },
      });
    }

    revalidatePath("/stock");
    return { success: true };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

// Bulk update stock for multiple variants at once
export async function bulkUpdateStock(
  updates: { variantId: string; qty: number }[]
) {
  try {
    for (const update of updates) {
      const existingStock = await prisma.stock.findUnique({
        where: { prodVariantId: update.variantId },
      });

      if (existingStock) {
        await prisma.stock.update({
          where: { prodVariantId: update.variantId },
          data: { qty: update.qty },
        });
      } else {
        await prisma.stock.create({
          data: {
            qty: update.qty,
            prodVariantId: update.variantId,
          },
        });
      }
    }

    revalidatePath("/stock");
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

// Delete stock for a variant (sets it to no stock record)
export async function deleteStock(variantId: string) {
  try {
    await prisma.stock.deleteMany({
      where: { prodVariantId: variantId },
    });

    revalidatePath("/stock");
    return { success: true };
  } catch (error) {
    console.error("Error deleting stock:", error);
    return { success: false, error: "Failed to delete stock" };
  }
}
