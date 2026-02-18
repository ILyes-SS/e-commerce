"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CarouselSlideData {
  imageUrl: string;
  title?: string | null;
  linkUrl?: string | null;
  sortOrder: number;
}

export async function getCarouselSlides() {
  try {
    const slides = await prisma.carouselSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return { success: true, data: slides };
  } catch (error) {
    console.error("Error fetching carousel slides:", error);
    return { success: false, error: "Failed to fetch carousel slides" };
  }
}

export async function getCarouselSlideById(id: string) {
  try {
    const slide = await prisma.carouselSlide.findUnique({
      where: { id },
    });
    return { success: true, data: slide };
  } catch (error) {
    console.error("Error fetching carousel slide:", error);
    return { success: false, error: "Failed to fetch carousel slide" };
  }
}

export async function createCarouselSlide(data: CarouselSlideData) {
  try {
    const slide = await prisma.carouselSlide.create({
      data: {
        imageUrl: data.imageUrl,
        title: data.title,
        linkUrl: data.linkUrl,
        sortOrder: data.sortOrder,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: slide };
  } catch (error) {
    console.error("Error creating carousel slide:", error);
    return { success: false, error: "Failed to create carousel slide" };
  }
}

export async function updateCarouselSlide(id: string, data: Partial<CarouselSlideData>) {
  try {
    const slide = await prisma.carouselSlide.update({
      where: { id },
      data: {
        imageUrl: data.imageUrl,
        title: data.title,
        linkUrl: data.linkUrl,
        sortOrder: data.sortOrder,
      },
    });
    revalidatePath("/products-management");
    return { success: true, data: slide };
  } catch (error) {
    console.error("Error updating carousel slide:", error);
    return { success: false, error: "Failed to update carousel slide" };
  }
}

export async function deleteCarouselSlide(id: string) {
  try {
    await prisma.carouselSlide.delete({
      where: { id },
    });
    revalidatePath("/products-management");
    return { success: true };
  } catch (error) {
    console.error("Error deleting carousel slide:", error);
    return { success: false, error: "Failed to delete carousel slide" };
  }
}
