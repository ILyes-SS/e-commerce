import React from "react";
import { Product, ProductVariant } from "@/app/generated/prisma";
import ProductCard from "./ProductCard";

const ProductsDisplay = ({
  products,
}: {
  products: (Product & { variants: ProductVariant[] })[];
}) => {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsDisplay;
