import prisma from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatus } from "@/app/generated/prisma";

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
      wilaya: true,
      customer: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return orders;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/20 text-amber-600 border-amber-500/30";
    case "PROCESSING":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    case "SHIPPED":
      return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
    case "CANCELLED":
      return "bg-red-500/20 text-red-600 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-600 border-gray-500/30";
  }
};

export default async function OrdersPage() {
  const orders = await getOrders();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const processingOrders = orders.filter(
    (o) => o.status === "PROCESSING"
  ).length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider">
                Total Orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/80 backdrop-blur-sm border-amber-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-amber-700">
                Pending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {pendingOrders}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-blue-700">
                Processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {processingOrders}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/80 backdrop-blur-sm border-emerald-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-emerald-700">
                Shipped
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {shippedOrders}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50/80 backdrop-blur-sm border-red-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-red-700">
                Cancelled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {cancelledOrders}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider text-slate-300">
                Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {totalRevenue.toLocaleString()} DA
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No orders found.
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card
                key={order.id}
                className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold flex items-center gap-3">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="space-y-0.5">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span>
                            <span className="font-medium">Customer:</span>{" "}
                            {order.name}
                          </span>
                          <span>
                            <span className="font-medium">Email:</span>{" "}
                            {order.email}
                          </span>
                          <span>
                            <span className="font-medium">Phone:</span>{" "}
                            {order.phone}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Delivery:</span>{" "}
                          {order.wilaya.name} ({order.wilaya.price} DA)
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-2xl font-bold text-slate-900">
                        {order.total.toLocaleString()} DA
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3">
                    Order Items
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">
                          Unit Price
                        </TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100">
                              <Image
                                src={
                                  item.productVariant.product.image ||
                                  "/placeholder.png"
                                }
                                alt={item.productVariant.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.productVariant.product.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.productVariant.color && (
                                <div className="flex items-center gap-1">
                                  <div
                                    className="w-4 h-4 rounded-full border border-slate-300"
                                    style={{
                                      backgroundColor: item.productVariant.color,
                                    }}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {item.productVariant.color}
                                  </span>
                                </div>
                              )}
                              {item.productVariant.size && (
                                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                                  {item.productVariant.size}
                                </span>
                              )}
                              {item.productVariant.unit && (
                                <span className="text-xs text-muted-foreground">
                                  {item.productVariant.unit}
                                </span>
                              )}
                              {!item.productVariant.color &&
                                !item.productVariant.size &&
                                !item.productVariant.unit && (
                                  <span className="text-xs text-muted-foreground">
                                    Default
                                  </span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.priceAtPurchase.toLocaleString()} DA
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {(
                              item.priceAtPurchase * item.quantity
                            ).toLocaleString()}{" "}
                            DA
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
