import { Product, ProductVariant } from "@/app/generated/prisma";
import ProductCard from "./ProductCard";
import PriceFilter from "./PriceFilter";
import SortProducts from "./SortProducts";
import BrandsFilter from "./BrandsFilter";
import prisma from "@/lib/prisma";

const ProductsDisplay = async ({
  products,
}: {
  products: (Product & { variants: ProductVariant[] })[];
}) => {
  const brands = await prisma.brand.findMany({
    // where: {
    //   id: {
    //     in: products.map((p) => p.brandId),
    //   },
    // },
  });
  return (
    <div>
      <PriceFilter />
      <SortProducts />
      <BrandsFilter brandsList={brands} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsDisplay;
