"use client";

import React from "react";
import { CartItem } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
import {
  decreaseItemQuantityDb,
  increaseItemQuantityDb,
  removeCartItemDb,
} from "@/actions/cart";

const CartItemComponent = ({
  item,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeFromCart,
}: {
  item: CartItem;
  increaseItemQuantity: (productId: string) => void;
  decreaseItemQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}) => {
  async function handleIncrease() {
    increaseItemQuantity(item.id);
    await increaseItemQuantityDb(item.prodVariantId, item.cartId);
  }
  async function handleDecrease() {
    decreaseItemQuantity(item.id);
    await decreaseItemQuantityDb(item.prodVariantId, item.cartId);
  }
  async function handleRemove() {
    removeFromCart(item.id);
    await removeCartItemDb(item.prodVariantId, item.cartId);
  }
  return (
    <div className="flex gap-4 items-center border-b pb-4">
      <Image
        src={item.image || "/placeholder.png"}
        alt={item.title}
        width={80}
        height={80}
        className="rounded-md"
      />
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-lg font-medium">{item.title}</p>
        {item.color && (
          <div className="flex items-center gap-2">
            <div
              className="rounded-full w-4 h-4 border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.color}</span>
          </div>
        )}
        {item.size && (
          <span className="text-sm text-gray-600">Size: {item.size}</span>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              className="w-8 h-8 rounded-full p-0"
              variant="outline"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              className="w-8 h-8 rounded-full p-0"
              variant="outline"
              onClick={handleIncrease}
              disabled={item.quantity >= item.stockQty}
            >
              +
            </Button>
          </div>
          <p className="font-semibold">{item.price * item.quantity} DA</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2Icon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItemComponent;
