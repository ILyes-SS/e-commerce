import React from "react";
import { getCategories } from "@/actions/category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const NavBar = async () => {
  const categories = await getCategories();
  return (
    <nav className="flex gap-2 px-4 py-3 text-sm">
      {categories?.map((category) => (
        <DropdownMenu key={category.id}>
          <DropdownMenuTrigger>
            <Link className="flex gap-2" href={`/category/${category.title}`}>
              {category.title} <ChevronDownIcon scale={0.4} />
            </Link>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {category?.subcategories?.map((subcategory) =>
              subcategory?.subcategories?.length > 0 ? (
                <DropdownMenuSub key={subcategory.id}>
                  <DropdownMenuSubTrigger>
                    <Link
                      href={`/category/${category.title}/${subcategory.title}`}
                    >
                      {subcategory.title}
                    </Link>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {subcategory?.subcategories?.map((subsubcategory) => (
                      <DropdownMenuItem key={subsubcategory.id}>
                        <Link
                          href={`/category/${category.title}/${subcategory.title}/${subsubcategory.title}`}
                        >
                          {subsubcategory.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem key={subcategory.id}>
                  <Link
                    href={`/category/${category.title}/${subcategory.title}`}
                  >
                    {subcategory.title}
                  </Link>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  );
};

export default NavBar;
