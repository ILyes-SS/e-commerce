import prisma from "@/lib/prisma";
import ProductCarousel from "@/components/ProductCarousel";
import ProductInfos from "@/components/ProductInfos";
import { getUser } from "@/lib/supabase/server";

const page = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;
  // const user = await getUser();
  // const cart = await prisma.cart.findUnique({
  //   where: {
  //     userId: user?.id,
  //   },
  // });

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
    <div className="flex gap-10">
      <div>
        <ProductCarousel
          images={product?.images || []}
          mainImage={product?.image || ""}
        />
      </div>
      <ProductInfos product={product!} />
    </div>
  );
};

export default page;
