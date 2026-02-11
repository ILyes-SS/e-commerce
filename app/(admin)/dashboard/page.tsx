import prisma from "@/lib/prisma";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus } from "@/app/generated/prisma";
import OrdersTable from "./components/OrdersTable";
import RecentOrdersCard from "./components/RecentOrdersCard";

async function getDashboardStats() {
  // Get total revenue (sum of all order totals)
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  // Get order counts by status
  const orderCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });

  // Get total orders
  const totalOrders = await prisma.order.count();

  // Get total products
  const totalProducts = await prisma.product.count();

  // Get low stock products count
  const lowStockProducts = await prisma.productVariant.count({
    where: {
      stock: {
        qty: {
          lte: 5,
        },
      },
    },
  });

  // Get today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayOrders = await prisma.order.count({
    where: {
      // Note: You might need to add createdAt field to Order model
      // For now, we'll use a placeholder
    },
  });

  // Get recent orders with related data
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: {
      id: 'desc',
    },
    include: {
      wilaya: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  // Calculate stats by status
  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0,
  };

  orderCounts.forEach((item) => {
    statusCounts[item.status.toLowerCase() as keyof typeof statusCounts] = item._count;
  });

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalProducts,
    lowStockProducts,
    statusCounts,
    recentOrders,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statsCards = [
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toLocaleString()} DA`,
      description: "Total sales revenue",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      description: "All time orders",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      description: "Products in catalog",
      icon: Package,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts.toString(),
      description: "Products needing restock",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const orderStatusCards = [
    {
      title: "Pending",
      value: stats.statusCounts.pending.toString(),
      icon: Clock,
      color: "text-yellow-500 bg-yellow-500/10",
    },
    {
      title: "Processing",
      value: stats.statusCounts.processing.toString(),
      icon: Package,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Shipped",
      value: stats.statusCounts.shipped.toString(),
      icon: Truck,
      color: "text-green-500 bg-green-500/10",
    },
    {
      title: "Cancelled",
      value: stats.statusCounts.cancelled.toString(),
      icon: XCircle,
      color: "text-red-500 bg-red-500/10",
    },
  ];

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store&apos;s performance and recent activity.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderStatusCards.map((status) => (
            <Card key={status.title} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-xl ${status.color}`}>
                  <status.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{status.value}</p>
                  <p className="text-sm text-muted-foreground">{status.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest 10 orders from your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={stats.recentOrders} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Sidebar - Takes 1/3 of the space */}
        <div className="space-y-6">
          <RecentOrdersCard orders={stats.recentOrders.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
