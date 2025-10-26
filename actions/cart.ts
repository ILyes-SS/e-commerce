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

export async function clearCart() {}
