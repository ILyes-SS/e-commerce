import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getUserOrders } from "@/actions/order";
import OrderHistory from "@/components/OrderHistory";

export default async function HistoryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getUserOrders(user.id, user.email);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <OrderHistory orders={orders} />
    </div>
  );
}
