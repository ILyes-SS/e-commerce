import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    min?: string;
    max?: string;
    sort?: string;
    brands?: string[] | string;
  }>;
}) => {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const { min, max, sort, brands } = await searchParams;
  const minPrice = min ? parseFloat(min) : undefined;
  const maxPrice = max ? parseFloat(max) : undefined;
  const products = query
    ? await prisma.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          variants: {
            some: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
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
        },
        include: {
          variants: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    : [];

  const sortedProducts = products.sort((a, b) => {
    if (sort === "asc" || sort == undefined) {
      return a.variants[0].price - b.variants[0].price;
    } else {
      return b.variants[0].price - a.variants[0].price;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : "Search Products"}
      </h1>
      {query ? (
        sortedProducts.length > 0 ? (
          <ProductsDisplay products={sortedProducts} />
        ) : (
          <p className="text-gray-500">
            No products found matching your search.
          </p>
        )
      ) : (
        <p className="text-gray-500">Enter a search query to find products.</p>
      )}
    </div>
  );
};

export default SearchPage;
