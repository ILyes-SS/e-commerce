"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProductData {
  name: string;
  slug: string;
  image: string;
  description: string;
  weight?: number | null;
  dimension?: number | null;
  lowStock?: number;
  categoryId: string;
  brandId: string;
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            stock: true,
          },
        },
        images: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            stock: true,
          },
        },
        images: true,
      },
    });
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function createProduct(data: ProductData) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        weight: data.weight,
        dimension: data.dimension,
        lowStock: data.lowStock ?? 5,
        categoryId: data.categoryId,
        brandId: data.brandId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        weight: data.weight,
        dimension: data.dimension,
        lowStock: data.lowStock,
        categoryId: data.categoryId,
        brandId: data.brandId,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Product Images
export async function addProductImage(productId: string, imageUrl: string, sortOrder: number) {
  try {
    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        sortOrder,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: image };
  } catch (error) {
    console.error("Error adding product image:", error);
    return { success: false, error: "Failed to add product image" };
  }
}

export async function deleteProductImage(id: string) {
  try {
    await prisma.productImage.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product image:", error);
    return { success: false, error: "Failed to delete product image" };
  }
}
