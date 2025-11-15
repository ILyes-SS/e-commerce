"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types";
import { useCart } from "@/store/useCart";
import { createOrder } from "@/actions/order";
import { User } from "@supabase/supabase-js";
import { Wilaya } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import CartItemComponent from "./CartItemComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  decreaseItemQuantityDb,
  increaseItemQuantityDb,
  removeCartItemDb,
} from "@/actions/cart";

interface CheckoutFormProps {
  user: User | null;
  wilayas: Wilaya[];
}

const CheckoutForm = ({ user, wilayas }: CheckoutFormProps) => {
  const router = useRouter();
  const {
    cartItems,
    setCartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: "",
    wilayaId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncrease = async (item: CartItem) => {
    increaseItemQuantity(item.id);
    await increaseItemQuantityDb(item.prodVariantId, item.cartId);
  };

  const handleDecrease = async (item: CartItem) => {
    decreaseItemQuantity(item.id);
    await decreaseItemQuantityDb(item.prodVariantId, item.cartId);
  };

  const handleRemove = async (item: CartItem) => {
    removeFromCart(item.id);
    await removeCartItemDb(item.prodVariantId, item.cartId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const selectedWilaya = wilayas.find((w) => w.id === formData.wilayaId);
  const deliveryCost = selectedWilaya?.price || 0;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (cartItems.length === 0) {
      setOrderError("Your cart is empty");
      return;
    }

    if (!formData.wilayaId) {
      setOrderError("Please select a wilaya");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        wilayaId: formData.wilayaId,
        customerId: user?.id || null,
        items: cartItems.map((item) => ({
          prodVariantId: item.prodVariantId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
        total: total,
      };

      await createOrder(orderData);
      // Clear cart state after successful order
      setCartItems([]);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push("/");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Please provide your contact and delivery information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="wilayaId">Wilaya</Label>
                  <Select
                    id="wilayaId"
                    name="wilayaId"
                    required
                    value={formData.wilayaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.name} ({wilaya.price} DA delivery)
                      </option>
                    ))}
                  </Select>
                </div>

                {orderError && (
                  <p className="text-sm text-red-500">{orderError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      increaseItemQuantity={() => handleIncrease(item)}
                      decreaseItemQuantity={() => handleDecrease(item)}
                      removeFromCart={() => handleRemove(item)}
                    />
                  ))
                )}
              </div>

              {/* Totals */}
              {cartItems.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(0)} DA</span>
                  </div>
                  {selectedWilaya && (
                    <div className="flex justify-between">
                      <span>Delivery ({selectedWilaya.name})</span>
                      <span>{deliveryCost.toFixed(0)} DA</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{total.toFixed(0)} DA</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Confirmed!</DialogTitle>
            <DialogDescription>
              Your order has been successfully placed. We will send you a
              confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Continue Shopping</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutForm;
