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
    await increaseItemQuantityDb(item.id);
  }
  async function handleDecrease() {
    decreaseItemQuantity(item.id);
    await decreaseItemQuantityDb(item.id);
  }
  async function handleRemove() {
    removeFromCart(item.id);
    await removeCartItemDb(item.id);
  }
  return (
    <div className="flex gap-2">
      <Image
        src={"/placeholder.png"}
        alt={item.title}
        width={100}
        height={100}
      />
      <div className="flex flex-col gap-2">
        <p className="text-lg">{item.title}</p>
        <div
          className="rounded-full w-4 h-4 p-1 border-2 border-black"
          style={{ backgroundColor: item.color || "black" }}
        ></div>
        <div>
          <div className="flex gap-2">
            <Button
              className="w-5 rounded-full cursor-pointer h-5 p-1"
              onClick={handleDecrease}
            >
              -
            </Button>
            <p>{item.quantity}</p>
            <Button
              className="w-5 rounded-full cursor-pointer h-5 p-1"
              onClick={handleIncrease}
            >
              +
            </Button>
          </div>
          <p>{item.price * item.quantity}</p>
        </div>
      </div>
      <Button
        className="cursor-pointer"
        variant={"ghost"}
        onClick={handleRemove}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

export default CartItemComponent;
