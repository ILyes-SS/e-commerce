import React from "react";
import { Product, ProductVariant } from "@/app/generated/prisma";
import ProductCard from "./ProductCard";

const ProductsDisplay = ({
  products,
}: {
  products: (Product & { variants: ProductVariant[] })[];
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsDisplay;
