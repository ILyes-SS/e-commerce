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
    // Create the order
    const order = await prisma.order.create({
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

    // Clear the cart after order creation
    // For logged-in users, find cart by userId
    if (orderData.customerId) {
      const cart = await prisma.cart.findUnique({
        where: { userId: orderData.customerId },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    }

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
