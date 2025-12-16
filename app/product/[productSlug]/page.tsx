import prisma from "@/lib/prisma";
import ProductCarousel from "@/components/ProductCarousel";
import ProductInfos from "@/components/ProductInfos";
import SimilarProducts from "@/components/SimilarProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const page = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;
  const product = await prisma.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      variants: {
        include: {
          stock: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="flex py-10 px-6 items-center flex-col gap-10">
      <div className="flex gap-10">
        <div>
          <Suspense fallback={<div>Loading images...</div>}>
            <ProductCarousel
              images={product?.images || []}
              mainImage={product?.image || ""}
            />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading product details...</div>}>
          <ProductInfos product={product!} />
        </Suspense>
      </div>
      <div className="self-start">
        <Suspense fallback={<div>Loading similar products...</div>}>
          <SimilarProducts
            productId={product?.id || ""}
            categoryId={product?.categoryId || ""}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
