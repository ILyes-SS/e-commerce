"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateOrderData {
  name: string;
  email: string;
  phone: string;
  wilayaId: string;
  customerId?: string | null;
  items: {
    prodVariantId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  total: number;
}

export async function createOrder(orderData: CreateOrderData) {
  try {
    // Use a transaction to ensure both order creation and stock decrement are atomic
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          total: Math.round(orderData.total),
          status: "PENDING",
          wilayaId: orderData.wilayaId,
          customerId: orderData.customerId || null,
          items: {
            create: orderData.items.map((item) => ({
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
              prodVariantId: item.prodVariantId,
            })),
          },
        },
        include: {
          items: true,
          wilaya: true,
        },
      });

      // Decrement the stock for each ordered item
      for (const item of orderData.items) {
        await tx.productVariant.update({
          where: { id: item.prodVariantId },
          data: {
            stock: {
              update: {
                qty: {
                  decrement: item.quantity,
                },
              },
            },
          },
        });
      }

      // Clear the cart after order creation, for logged-in users
      if (orderData.customerId) {
        const cart = await tx.cart.findUnique({
          where: { userId: orderData.customerId },
        });

        if (cart) {
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }
      }

      return newOrder;
    });

    revalidatePath("/checkout");
    return { success: true, order };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getWilayas() {
  try {
    const wilayas = await prisma.wilaya.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return wilayas;
  } catch (error) {
    console.error("Error fetching wilayas:", error);
    throw error;
  }
}

export async function getUserOrders(
  userId: string | undefined,
  userEmail: string | undefined
) {
  try {
    if (!userId && !userEmail) {
      return [];
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          ...(userId ? [{ customerId: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
        wilaya: true,
      },
      orderBy: {
        id: "desc", // Order by ID descending (newest first)
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}
