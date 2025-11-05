import { DisplayPath } from "@/components/DisplayPath";
import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";
import React from "react";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const products = await prisma.product.findMany({
    where: {
      category: {
        title: category.replaceAll("%20", " "),
      },
    },
    include: {
      variants: true,
    },
  });

  return (
    <div>
      <DisplayPath />
      <ProductsDisplay products={products} />
    </div>
  );
};

export default page;
