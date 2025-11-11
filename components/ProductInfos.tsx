"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/useCart";
import { ProductVariantsImagesStock } from "@/types";
import { addToCartDb, removeCartItemDb, removeFromCart } from "@/actions/cart";

const ProductInfos = ({ product }: { product: ProductVariantsImagesStock }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, cartItems, removeFromCart } = useCart();
  useEffect(() => {
    setSelectedColor(product.variants[0].color);
    setSelectedSize(product.variants[0].size);
  }, []);
  const selectedVariant = product.variants.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize
  );
  const colors = product?.variants.map((variant) => variant.color);
  const sizes = product?.variants.map((variant) => variant.size);
  const variantInCart = cartItems.find(
    (item) =>
      item.id === selectedVariant?.id &&
      item.color === selectedColor &&
      item.size === selectedSize
  );

  async function addToCartHandler() {
    const newItem = {
      id: selectedVariant?.id!,
      title: product.name,
      image: product.image,
      price: selectedVariant?.price || 0,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      stockQty: selectedVariant?.stock?.qty!,
      cartId: cartItems[0].cartId,
    };
    addToCart(newItem);
    await addToCartDb(cartItems[0].cartId, newItem);
  }
  async function removeFromCartHandler() {
    removeFromCart(selectedVariant?.id!);
    // what if there wasnt a cart item
    await removeCartItemDb("", selectedVariant?.id!, cartItems[0].cartId);
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">{product?.name}</h1>
      <h2>Colors</h2>
      <div className="flex gap-3">
        {colors?.map((color) => (
          <div
            key={color}
            style={{ backgroundColor: color || "" }}
            className={
              "w-6 h-6 rounded-full ring-1 cursor-pointer" +
              (selectedColor === color ? " border-2 border-gray-500" : "")
            }
            onClick={() => setSelectedColor(color)}
          ></div>
        ))}
      </div>
      <h2>Size</h2>
      <div className="flex gap-3">
        {sizes?.map((size) => (
          <span
            key={size}
            className={
              "rounded-full hover:border-gray-500 border-1 p-2 cursor-pointer" +
              (selectedSize === size ? " border-2 border-gray-500" : "")
            }
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </span>
        ))}
      </div>
      <p className="text-3xl text-bg-red-500 font-bold">
        {selectedVariant?.price || "Not Available"}DA
      </p>
      {selectedVariant?.stock?.qty! < 1 ? (
        <p className="text-red-500">Out of Stock</p>
      ) : null}
      <Button
        className="cursor-pointer"
        onClick={variantInCart ? removeFromCartHandler : addToCartHandler}
      >
        {variantInCart ? "Remove from Cart" : "Add to Cart"}
      </Button>
      <Button variant={"secondary"} asChild>
        <Link href={"/checkout"}>Checkout</Link>
      </Button>
      <p>{product?.description}</p>
    </div>
  );
};

export default ProductInfos;
