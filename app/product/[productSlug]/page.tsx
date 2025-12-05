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
    <div className="flex py-10 px-6 items-center flex-col gap-10">
      <div className="flex gap-10">
        <div>
          <ProductCarousel
            images={product?.images || []}
            mainImage={product?.image || ""}
          />
        </div>
        <ProductInfos product={product!} />
      </div>
      <div className="self-start">
        <SimilarProducts
          productId={product?.id || ""}
          categoryId={product?.categoryId || ""}
        />
      </div>
    </div>
  );
};

export default page;
