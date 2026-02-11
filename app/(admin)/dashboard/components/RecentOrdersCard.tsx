import { OrderStatus } from "@/app/generated/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Truck, XCircle, Package } from "lucide-react";

type Order = {
  id: string;
  name: string;
  total: number;
  status: OrderStatus;
};

type RecentOrdersCardProps = {
  orders: Order[];
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4 text-yellow-500" />,
  PROCESSING: <Package className="h-4 w-4 text-blue-500" />,
  SHIPPED: <Truck className="h-4 w-4 text-green-500" />,
  CANCELLED: <XCircle className="h-4 w-4 text-red-500" />,
};

export default function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quick View</CardTitle>
        <CardDescription>Latest orders at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background shadow-sm">
                  {statusIcons[order.status]}
                </div>
                <div>
                  <p className="font-medium text-sm">{order.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {order.total.toLocaleString()} DA
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {order.status.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No recent orders
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
