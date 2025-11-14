import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const CategoriesCards = async () => {
  const categories = await prisma.category.findMany({
    where: {
      parentCategory: null,
    },
  });
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-center">Our Categories</h1>
      <div className="flex justify-center flex-wrap gap-2 max-w-[700px] mx-auto">
        {categories.map((category) => (
          <Link
            className="bg-white/90 flex flex-col items-center justify-center border p-7 text-lg hover:text-blue-500  border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-md cursor-pointer"
            key={category.id}
            href={`/category/${category.slug}`}
          >
            {category.title}
            {category.image !== null && (
              <Image
                src={category.image}
                alt={category.title}
                width={100}
                height={100}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesCards;
