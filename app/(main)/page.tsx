import CategoriesCards from "@/components/CategoriesCards";
import HomeCarousel from "../../components/HomeCarousel";
import prisma from "@/lib/prisma";
import TrendingProducts from "@/components/TrendingProducts";
import Location from "@/components/Location";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function Home() {
  const slides = await prisma.carouselSlide.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "E-Commerce Store",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-5 bg-gray-100 py-3">
        <section className="container mx-auto">
          <HomeCarousel slides={slides} />
        </section>
        <section className="container mx-auto">
          <CategoriesCards />
        </section>
        <section className="container mx-auto">
          <TrendingProducts />
        </section>
        <section className="container mx-auto">
          <Location />
        </section>
      </div>
    </>
  );
}
