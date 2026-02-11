"use server";

import prisma from "@/lib/prisma";

// Types for stock management
export type StockVariantWithProduct = {
  id: string;
  price: number;
  compareAtPrice: number | null;
  color: string | null;
  size: string | null;
  unit: string | null;
  createdAt: Date;
  prodId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
  stock: {
    id: string;
    qty: number;
  } | null;
};

// Get all product variants with their stock and product info
export async function getAllVariantsWithStock(): Promise<StockVariantWithProduct[]> {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
        stock: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return variants as StockVariantWithProduct[];
  } catch (error) {
    console.error("Error fetching variants with stock:", error);
    throw error;
  }
}

// Get a single product variant by ID
export async function getVariantById(id: string): Promise<StockVariantWithProduct | null> {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
        stock: true,
      },
    });
    return variant as StockVariantWithProduct | null;
  } catch (error) {
    console.error("Error fetching variant:", error);
    throw error;
  }
}

// Get all products for dropdown selection
export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Create a new product variant with stock
export async function createVariantWithStock(data: {
  prodId: string;
  price: number;
  compareAtPrice?: number | null;
  color?: string | null;
  size?: string | null;
  unit?: string | null;
  stockQty: number;
}) {
  try {
    const variant = await prisma.productVariant.create({
      data: {
        prodId: data.prodId,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        color: data.color || null,
        size: data.size || null,
        unit: data.unit || null,
        stock: {
          create: {
            qty: data.stockQty,
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
        stock: true,
      },
    });
    return { success: true, variant };
  } catch (error) {
    console.error("Error creating variant:", error);
    return { success: false, error: String(error) };
  }
}

// Update a product variant and its stock
export async function updateVariantWithStock(
  id: string,
  data: {
    prodId?: string;
    price?: number;
    compareAtPrice?: number | null;
    color?: string | null;
    size?: string | null;
    unit?: string | null;
    stockQty?: number;
  }
) {
  try {
    // Update variant
    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        prodId: data.prodId,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        color: data.color,
        size: data.size,
        unit: data.unit,
      },
      include: {
        stock: true,
      },
    });

    // Update or create stock if provided
    if (data.stockQty !== undefined) {
      if (variant.stock) {
        await prisma.stock.update({
          where: { id: variant.stock.id },
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

    return { success: true };
  } catch (error) {
    console.error("Error updating variant:", error);
    return { success: false, error: String(error) };
  }
}

// Update only stock quantity
export async function updateStockQuantity(variantId: string, qty: number) {
  try {
    // Check if stock exists
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

    return { success: true };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { success: false, error: String(error) };
  }
}

// Delete a product variant (will cascade delete stock)
export async function deleteVariant(id: string) {
  try {
    // First delete the stock if it exists
    await prisma.stock.deleteMany({
      where: { prodVariantId: id },
    });

    // Delete cart items referencing this variant
    await prisma.cartItem.deleteMany({
      where: { prodVariantId: id },
    });

    // Delete order items referencing this variant
    await prisma.orderProd.deleteMany({
      where: { prodVariantId: id },
    });

    // Then delete the variant
    await prisma.productVariant.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: String(error) };
  }
}
