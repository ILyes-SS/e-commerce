import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";
import { Suspense } from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    min?: string;
    max?: string;
    sort: string;
    brands?: string[] | string;
  }>;
}) => {
  const { category } = await params;
  const { min, max, sort, brands } = await searchParams;
  const minPrice = min ? parseFloat(min) : undefined;
  const maxPrice = max ? parseFloat(max) : undefined;

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
      ...(brands
        ? {
            brand: {
              title: {
                in: Array.isArray(brands) ? brands : [brands],
              },
            },
          }
        : {}),
      variants: {
        some: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      },
    },
    include: {
      variants: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const sortedProducts = products
    .filter((p) => p.variants.length > 0)
    .sort((a, b) => {
      const priceA = a.variants[0]?.price ?? 0;
      const priceB = b.variants[0]?.price ?? 0;
      return sort === "desc" ? priceB - priceA : priceA - priceB;
    });

  return (
    <Suspense fallback={<div>Loading category products...</div>}>
      <ProductsDisplay products={sortedProducts} />
    </Suspense>
  );
};

export default page;
