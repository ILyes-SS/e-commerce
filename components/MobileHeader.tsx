import React from "react";
import Image from "next/image";
import { HistoryIcon, DoorOpen, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUser } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogoutButton } from "./logout-button";
import Cart from "./Cart";
import { getCartWithItems } from "@/actions/cart";
import { CartItem, CartWithItems } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { getCategories } from "@/actions/category";
import MobileSearchInput from "./MobileSearchInput";
import MobileCategoryMenu from "./MobileCategoryMenu";

const MobileHeader = async () => {
  const user = await getUser();
  const cart: CartWithItems | null = (await getCartWithItems(
    user?.id
  )) as CartWithItems | null;
  const cartItems: CartItem[] =
    cart?.items?.map((item) => ({
      id: item.id,
      title: item.productVariant.product.name,
      image: item.productVariant.product.image,
      quantity: item.quantity,
      price: item.productVariant.price,
      size: item.productVariant.size,
      color: item.productVariant.color,
      stockQty: item.productVariant.stock.qty,
      prodVariantId: item.productVariant.id,
      cartId: item.cartId,
    })) || [];
  const categories = await getCategories();

  return (
    <header className="md:hidden">
      <div className="flex px-3 py-2 h-16 justify-between items-center">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <MobileCategoryMenu categories={categories || []} />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <MobileSearchInput />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.user_metadata.name ? user.user_metadata.name
                      .split(" ")[0]
                      .substring(0, 1)
                      .toUpperCase() : user?.email?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.user_metadata.avatar_url} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href="/auth/history"
                    className="flex items-center w-full"
                  >
                    <HistoryIcon className="mr-2 h-4 w-4" /> History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DoorOpen className="mr-2 h-4 w-4" /> <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <Cart initialCartItems={cartItems} initialCartId={cart?.id} />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
