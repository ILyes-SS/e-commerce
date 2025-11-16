import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";
import React from "react";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
    include: {
      variants: true,
    },
  });

  return <ProductsDisplay products={products} />;
};

export default page;
