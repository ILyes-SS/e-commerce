"use server";

import prisma from "@/lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentCategoryId: null },
      include: { subcategories: { include: { subcategories: true } } },
    });
    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}
