"use client";

import { OrderStatus } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  total: number;
  status: OrderStatus;
  wilaya: {
    name: string;
    price: number;
  };
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    productVariant: {
      product: {
        name: string;
      };
    };
  }[];
};

type OrdersTableProps = {
  orders: Order[];
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  PROCESSING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  SHIPPED: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Wilaya</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-xs">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.name}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {order.items.slice(0, 2).map((item) => (
                    <span key={item.id} className="text-sm">
                      {item.quantity}x {item.productVariant.product.name.slice(0, 20)}
                      {item.productVariant.product.name.length > 20 ? "..." : ""}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{order.items.length - 2} more items
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{order.wilaya.name}</span>
              </TableCell>
              <TableCell className="font-semibold">
                {order.total.toLocaleString()} DA
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusColors[order.status]}
                >
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
