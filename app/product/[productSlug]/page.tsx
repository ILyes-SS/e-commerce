import prisma from "@/lib/prisma";
import ProductCarousel from "@/components/ProductCarousel";
import ProductInfos from "@/components/ProductInfos";
import SimilarProducts from "@/components/SimilarProducts";

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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-10">
        <div>
          <ProductCarousel
            images={product?.images || []}
            mainImage={product?.image || ""}
          />
        </div>
        <ProductInfos product={product!} />
      </div>
      <SimilarProducts
        productId={product?.id || ""}
        categoryId={product?.categoryId || ""}
      />
    </div>
  );
};

export default page;
