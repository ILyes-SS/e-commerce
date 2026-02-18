import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    min?: string;
    max?: string;
    sort: string;
    brands?: string[] | string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findFirst({
    where: { slug: category },
    select: { title: true },
  });

  const title = cat ? `Shop ${cat.title}` : "Shop Products";
  const description = cat
    ? `Browse our ${cat.title} collection. Find the best deals and latest products.`
    : "Browse our product collection.";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

const page = async ({
  params,
  searchParams,
}: Props) => {
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

