import { getCategories } from "@/actions/category";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import Link from "next/link";
import { Category } from "@/app/generated/prisma";
const NavBar = async () => {
  const categories = await getCategories();
  return (
    <nav className="flex items-center gap-2 px-4 py-3 text-sm">
      {categories?.map((category) => (
        <NavigationMenu key={category.id}>
          <SubNavigation items={[category]} />
        </NavigationMenu>
      ))}
      <Link href="/about-us">About Us</Link>
      <Link className="ml-2" href="/contact-us">
        Contact Us
      </Link>
    </nav>
  );
};
function SubNavigation({ items }: any) {
  return (
    <NavigationMenuList>
      {items?.map((item: any) => (
        <NavigationMenuItem key={item.id}>
          {item.subcategories?.length > 0 ? (
            <>
              <NavigationMenuTrigger>
                <Link href={`/category/${item.slug}`}>{item.title}</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {item.subcategories?.map((subcategory: Category) => (
                  <NavigationMenuLink key={subcategory.id} asChild>
                    <Link href={`/category/${subcategory.slug}`}>
                      {subcategory.title}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </>
          ) : (
            <NavigationMenuLink asChild>
              <Link href={`/category/${item.slug}`}>{item.title}</Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
}
export default NavBar;
