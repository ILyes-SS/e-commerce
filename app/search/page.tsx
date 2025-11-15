import ProductsDisplay from "@/components/ProductsDisplay";
import prisma from "@/lib/prisma";
import React from "react";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          variants: true,
        },
      })
    : [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : "Search Products"}
      </h1>
      {query ? (
        products.length > 0 ? (
          <ProductsDisplay products={products} />
        ) : (
          <p className="text-gray-500">No products found matching your search.</p>
        )
      ) : (
        <p className="text-gray-500">Enter a search query to find products.</p>
      )}
    </div>
  );
};

export default SearchPage;

