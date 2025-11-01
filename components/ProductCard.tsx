import { Product } from "@/app/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.slug}`} className="flex flex-col gap-2">
      {/* <Image src={product.image} alt={product.name} width={200} height={200} /> */}
      <h1 className="text-lg">{product.name}</h1>
    </Link>
  );
};

export default ProductCard;
