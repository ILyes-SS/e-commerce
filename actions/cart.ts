"use server";

import prisma from "@/lib/prisma";
import { CartItem, CartWithItems } from "@/types";

export async function getCartWithItems(
  userId: string | undefined
): Promise<CartWithItems | null> {
  if (!userId) {
    return null;
  }
  try {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return cart as unknown as CartWithItems; // Type assertion needed due to Prisma's generated types
  } catch (error) {
    console.error("Error getting cart with items:", error);
    throw error;
  }
}

export async function createCart() {}

export async function addToCartDb(
  cartId: string | undefined,
  cartItem: CartItem
) {
  try {
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    if (!cartItem.id) {
      throw new Error("Product variant ID is required");
    }
    const item = await prisma.cartItem.create({
      data: {
        quantity: cartItem.quantity,
        productVariant: {
          connect: {
            id: cartItem.id,
          },
        },
        cart: {
          connect: {
            id: cartId,
          },
        },
      },
    });
    return { success: true, item };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
}

export async function removeFromCart() {}

export async function clearCartDb(cartId: string | undefined) {
  try {
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
}
export async function decreaseItemQuantityDb(
  variantId: string,
  cartId: string
) {
  try {
    if (!variantId) {
      throw new Error("Product variant ID is required");
    }
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    let item = await prisma.cartItem.updateManyAndReturn({
      where: {
        prodVariantId: variantId,
        cartId,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
    if (item[0].quantity <= 0) {
      await removeCartItemDb(item[0].prodVariantId, item[0].cartId);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function increaseItemQuantityDb(
  variantId: string,
  cartId: string
) {
  try {
    if (!variantId) {
      throw new Error("Product variant ID is required");
    }
    if (!cartId) {
      throw new Error("Cart ID is required");
    }
    await prisma.cartItem.updateMany({
      where: {
        prodVariantId: variantId,
        cartId: cartId,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}
//each cart item has one unique
export async function removeCartItemDb(variantId: string, cartId: string) {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        prodVariantId: variantId,
        cartId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
