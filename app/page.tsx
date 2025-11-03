import CategoriesCards from "@/components/CategoriesCards";
import HomeCarousel from "../components/HomeCarousel";
import prisma from "@/lib/prisma";
import TrendingProducts from "@/components/TrendingProducts";
import Location from "@/components/Location";

export default async function Home() {
  const slides = await prisma.carouselSlide.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
  return (
    <div className="text-3xl">
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
  );
}
