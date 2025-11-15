"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Order,
  OrderProd,
  ProductVariant,
  Product,
  Wilaya,
} from "@/app/generated/prisma";

type OrderWithItems = Order & {
  items: (OrderProd & {
    productVariant: ProductVariant & {
      product: Product;
    };
  })[];
  wilaya: Wilaya;
};

interface OrderHistoryProps {
  orders: OrderWithItems[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          You haven't placed any orders yet.
        </p>
        <Link
          href="/"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </CardTitle>
                <CardDescription className="mt-2">
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {order.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {order.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {order.phone}
                    </p>
                    <p>
                      <span className="font-medium">Delivery:</span>{" "}
                      {order.wilaya.name} ({order.wilaya.price} DA)
                    </p>
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <p className="text-2xl font-bold">
                  {order.total.toFixed(0)} DA
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center border-b pb-4 last:border-b-0"
                  >
                    <Link href={`/product/${item.productVariant.product.slug}`}>
                      <Image
                        src={
                          item.productVariant.product.image ||
                          "/placeholder.png"
                        }
                        alt={item.productVariant.product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col gap-2">
                      <Link
                        href={`/product/${item.productVariant.product.slug}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {item.productVariant.product.name}
                      </Link>
                      {item.productVariant.color && (
                        <div className="flex items-center gap-2">
                          <div
                            className="rounded-full w-4 h-4 border-2 border-gray-300"
                            style={{
                              backgroundColor: item.productVariant.color,
                            }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {item.productVariant.color}
                          </span>
                        </div>
                      )}
                      {item.productVariant.size && (
                        <span className="text-sm text-gray-600">
                          Size: {item.productVariant.size}
                        </span>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-sm text-gray-600">
                          Price: {item.priceAtPurchase.toFixed(0)} DA
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.priceAtPurchase * item.quantity).toFixed(0)} DA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
