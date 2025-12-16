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
import { clearCartDb } from "@/actions/cart";
import CartItemComponent from "./CartItemComponent";

const Cart = ({
  initialCartItems,
  initialCartId,
}: {
  initialCartItems?: CartItem[];
  initialCartId?: string;
}) => {
  const {
    cartItems,
    setCartItems,
    setCartId,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (initialCartId) {
      setCartId(initialCartId);
      setCartItems(initialCartItems || []);
    }
  }, [initialCartItems, initialCartId, setCartId, setCartItems]);

  async function handleClearCart() {
    if (cartItems.length <= 0) return;
    await clearCartDb(initialCartId!);
    setCartItems([]);
  }
  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent className="max-w-[500px] w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl">Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 items-center overflow-y-auto">
          {cartItems.length <= 0
            ? "Your cart is empty"
            : cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  increaseItemQuantity={increaseItemQuantity}
                  decreaseItemQuantity={decreaseItemQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
        </div>
        <SheetFooter>
          {cartItems.length > 0 ? (
            <div className="flex justify-between text-xl font-semibold">
              <p>Total:</p>
              <p>
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(0) + " DA"}
              </p>
            </div>
          ) : null}
          <Button variant={"default"} onClick={handleClearCart}>
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
