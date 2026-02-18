"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
