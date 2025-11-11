"use server";

import prisma from "@/lib/prisma";
import { CartItem, CartWithItems } from "@/types";

export async function getCartWithItems(
  userId: string | undefined
): Promise<CartWithItems> {
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
  } catch (error) {
    console.log(error);
  }
}

export async function removeFromCart() {}

export async function clearCartDb(cartId: string | undefined) {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
export async function decreaseItemQuantityDb(cartItemId: string) {
  try {
    let item = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
    if (item.quantity <= 0) {
      await removeCartItemDb(item.id, item.id, item.cartId);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function increaseItemQuantityDb(cartItemId: string) {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
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
export async function removeCartItemDb(
  cartItemId: string,
  variantId: string,
  cartId: string
) {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        OR: [
          {
            id: cartItemId,
          },
          {
            prodVariantId: variantId,
            cartId,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}
