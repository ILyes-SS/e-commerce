import React from "react";
import Image from "next/image";
import { HistoryIcon } from "lucide-react";
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
import NavBar from "./NavBar";
import SearchInput from "./SearchInput";

const Header = async () => {
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
  return (
    <header className="hidden md:block">
      <div className="flex px-3 py-1 h-16 justify-around items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            className="h-12 w-12"
            width={100}
            height={100}
          />
        </Link>
        <SearchInput />
        <div className="flex gap-2 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    {user.user_metadata.name ? user.user_metadata.name
                      .split(" ")[0]
                      .substring(0, 1)
                      .toUpperCase() :user?.email?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.user_metadata.avatar_url} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href="/auth/history"
                    className="flex items-center gap-1"
                  >
                    <HistoryIcon className="mr-2 h-4 w-4" /> History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
          <Cart initialCartItems={cartItems} initialCartId={cart?.id} />
        </div>
      </div>
      <NavBar />
    </header>
  );
};

export default Header;
