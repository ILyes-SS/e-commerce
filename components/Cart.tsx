"use client";
import { ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "@/store/useCart";
import { CartItem } from "@/types";
import Link from "next/link";
import { Button } from "./ui/button";

const Cart = ({ initialCartItems }: { initialCartItems?: CartItem[] }) => {
  const { cartItems, setCartItems, clearCart } = useCart();

  useEffect(() => {
    if (initialCartItems) {
      setCartItems(initialCartItems);
    }
  }, []);
  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length <= 0
          ? "Your cart is empty"
          : cartItems.map((item) => (
              <div key={item.id}>
                <p>{item.title}</p>
                <p>{item.size}</p>
                <p>{item.color}</p>
                <p>{item.price}</p>
                <p>{item.quantity}</p>
              </div>
            ))}
        <SheetFooter>
          <Button variant={"default"} onClick={() => clearCart()}>
            Clear Cart
          </Button>
          <Button asChild variant={"outline"}>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
