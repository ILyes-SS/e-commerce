"use server";

import prisma from "@/lib/prisma";

export async function getCartItems(userId: string | undefined) {
  try {
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
      select: {
        items: {
          select: {
            cartId: true,
            productVariant: {
              select: {
                size: true,
                color: true,
                price: true,
                product: true,
                unit: true,
                stock: {
                  select: {
                    qty: true,
                  },
                },
              },
            },
            quantity: true,
            id: true,
          },
        },
      },
    });
    console.log(cart);
    return cart?.items || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createCart() {}

export async function addToCart() {}

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
      await removeCartItemDb(cartItemId);
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
export async function removeCartItemDb(cartItemId: string) {
  try {
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
