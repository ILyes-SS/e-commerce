"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/app/generated/prisma";

const MobileCategoryMenu = ({ categories }) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(categoryId)) {
      newOpen.delete(categoryId);
    } else {
      newOpen.add(categoryId);
    }
    setOpenCategories(newOpen);
  };

  return (
    <nav className="flex flex-col gap-1 px-2">
      {categories?.map((category) => (
        <div key={category.id} className="flex flex-col">
          {category.subcategories && category.subcategories.length > 0 ? (
            <>
              <div className="flex items-center">
                <Link
                  href={`/category/${category.slug}`}
                  className="flex-1 py-2 text-lg font-semibold hover:text-primary transition-colors"
                >
                  {category.title}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleCategory(category.id)}
                >
                  {openCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {openCategories.has(category.id) && (
                <div className="flex flex-col pl-4 gap-1 mb-2">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/category/${subcategory.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                    >
                      {subcategory.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={`/category/${category.slug}`}
              className="py-2 text-lg font-semibold hover:text-primary transition-colors"
            >
              {category.title}
            </Link>
          )}
        </div>
      ))}
      <Link href="/about-us">About Us</Link>
      <Link href="/contact-us">Contact Us</Link>
    </nav>
  );
};

export default MobileCategoryMenu;
