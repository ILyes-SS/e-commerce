import prisma from "@/lib/prisma";
import React from "react";
import ProductCard from "./ProductCard";

const TrendingProducts = async () => {
  const trendingProducts = await prisma.trending.findMany({
    select: {
      product: true,
    },
  });
  return (
    <div className="flex mx-auto max-w-[900px] flex-col gap-3">
      <h1 className="text-center">Top Products</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {trendingProducts.map((product) => (
          <ProductCard key={product.product.id} product={product.product} />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
