import { Product, ProductVariant } from "@/app/generated/prisma";
import { CircleArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({
  product,
}: {
  product: Product & { variants: ProductVariant[] };
}) => {
  const defaultVariant = product.variants[0];
  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex items-center transition-all duration-300 hover:bg-gray-200 bg-white py-3 px-4 rounded-lg flex-col gap-2"
    >
      <Image
        className="rounded-lg"
        src={product.image}
        alt={product.name}
        width={200}
        height={200}
      />
      <div className="flex flex-col gap-1 justify-between">
        <h1 className="text-xl font-heading">{product.name}</h1>
        <div className="flex items-center">
          <div>
            {defaultVariant.compareAtPrice && (
              <p className="text-lg font-semibold line-through">
                {defaultVariant.compareAtPrice}DA
              </p>
            )}
            <p className="text-lg font-semibold">{defaultVariant.price}DA</p>
          </div>
          <CircleArrowDown className="ml-auto text-brown-200 -rotate-120" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
