"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface WilayaData {
  name: string;
  price: number;
}

export async function getWilayasAdmin() {
  try {
    const wilayas = await prisma.wilaya.findMany({
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: wilayas };
  } catch (error) {
    console.error("Error fetching wilayas:", error);
    return { success: false, error: "Failed to fetch wilayas" };
  }
}

export async function getWilayaById(id: string) {
  try {
    const wilaya = await prisma.wilaya.findUnique({
      where: { id },
    });
    return { success: true, data: wilaya };
  } catch (error) {
    console.error("Error fetching wilaya:", error);
    return { success: false, error: "Failed to fetch wilaya" };
  }
}

export async function createWilaya(data: WilayaData) {
  try {
    const wilaya = await prisma.wilaya.create({
      data: {
        name: data.name,
        price: data.price,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: wilaya };
  } catch (error) {
    console.error("Error creating wilaya:", error);
    return { success: false, error: "Failed to create wilaya" };
  }
}

export async function updateWilaya(id: string, data: Partial<WilayaData>) {
  try {
    const wilaya = await prisma.wilaya.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: wilaya };
  } catch (error) {
    console.error("Error updating wilaya:", error);
    return { success: false, error: "Failed to update wilaya" };
  }
}

export async function deleteWilaya(id: string) {
  try {
    await prisma.wilaya.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting wilaya:", error);
    return { success: false, error: "Failed to delete wilaya" };
  }
}
