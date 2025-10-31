import HomeCarousel from "../components/HomeCarousel";
import prisma from "@/lib/prisma";

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
    </div>
  );
}
