import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ min?: string; max?: string; sort: string }>;
}) => {
  const { category } = await params;
  const { min, max, sort } = await searchParams;
  const minPrice = min ? parseFloat(min) : undefined;
  const maxPrice = max ? parseFloat(max) : undefined;

  // Fetch products in the category, include only variants in the price range
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
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
  const sortedProducts = products.sort((a, b) => {
    if (sort === "asc" || sort == undefined) {
      return a.variants[0].price - b.variants[0].price;
    } else {
      return b.variants[0].price - a.variants[0].price;
    }
  });

  return <ProductsDisplay products={sortedProducts} />;
};

export default page;
