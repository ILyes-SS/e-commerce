import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

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
            className="bg-white/90 border p-7 text-lg hover:text-blue-500  border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-md cursor-pointer"
            key={category.id}
            href={`/category/${category.title}`}
          >
            {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesCards;
