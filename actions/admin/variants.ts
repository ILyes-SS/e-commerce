"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface VariantData {
  price: number;
  compareAtPrice?: number | null;
  color?: string | null;
  size?: string | null;
  unit?: string | null;
  prodId: string;
  stockQty?: number;
}

export async function getVariants() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: true,
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

export async function getVariantById(id: string) {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: true,
        stock: true,
      },
    });
    return { success: true, data: variant };
  } catch (error) {
    console.error("Error fetching variant:", error);
    return { success: false, error: "Failed to fetch variant" };
  }
}

export async function createVariant(data: VariantData) {
  try {
    const variant = await prisma.productVariant.create({
      data: {
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        color: data.color,
        size: data.size,
        unit: data.unit,
        prodId: data.prodId,
        stock: data.stockQty !== undefined ? {
          create: {
            qty: data.stockQty,
          },
        } : undefined,
      },
      include: {
        stock: true,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: variant };
  } catch (error) {
    console.error("Error creating variant:", error);
    return { success: false, error: "Failed to create variant" };
  }
}

export async function updateVariant(id: string, data: Partial<VariantData>) {
  try {
    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        color: data.color,
        size: data.size,
        unit: data.unit,
        prodId: data.prodId,
      },
      include: {
        stock: true,
      },
    });

    // Update stock if provided
    if (data.stockQty !== undefined) {
      if (variant.stock) {
        await prisma.stock.update({
          where: { prodVariantId: id },
          data: { qty: data.stockQty },
        });
      } else {
        await prisma.stock.create({
          data: {
            qty: data.stockQty,
            prodVariantId: id,
          },
        });
      }
    }

    revalidatePath("/products-management");
    return { success: true, data: variant };
  } catch (error) {
    console.error("Error updating variant:", error);
    return { success: false, error: "Failed to update variant" };
  }
}

export async function deleteVariant(id: string) {
  try {
    // Delete stock first (if exists)
    await prisma.stock.deleteMany({
      where: { prodVariantId: id },
    });
    
    await prisma.productVariant.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: "Failed to delete variant" };
  }
}
