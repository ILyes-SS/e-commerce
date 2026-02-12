import prisma from "@/lib/prisma";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from "./components/OrdersTable";

async function getDashboardStats() {
  // Get total revenue (sum of all order totals)
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
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

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalProducts,
    lowStockProducts,
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

      {/* Recent Orders Section */}
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
  );
}
