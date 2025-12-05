import prisma from "@/lib/prisma";
import ProductCard from "./ProductCard";

const SimilarProducts = async ({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) => {
  const similarProducts = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      NOT: {
        id: productId,
      },
    },
    include: {
      variants: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return (
    <div>
      <h2 className="text-2xl font-semibold">Similar Products</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {similarProducts.length >= 1 ? (
          similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Products not found</p>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
