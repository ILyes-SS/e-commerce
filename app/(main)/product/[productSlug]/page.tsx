import prisma from "@/lib/prisma";
import ProductCarousel from "@/components/ProductCarousel";
import ProductInfos from "@/components/ProductInfos";
import SimilarProducts from "@/components/SimilarProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

type Props = { params: Promise<{ productSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: { variants: { orderBy: { createdAt: "desc" } } },
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  const price = product.variants[0]?.price;

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image],
    },
    ...(price && {
      other: { "product:price:amount": String(price), "product:price:currency": "DZD" },
    }),
  };
}

const page = async ({ params }: Props) => {
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

  const price = product.variants[0]?.price;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "DZD",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
};

export default page;

