"use client";

import React, { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { OrderStatus } from "@/app/generated/prisma";
import { updateOrderStatus } from "@/actions/admin/orders";
import { toast } from "sonner";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-300 focus-visible:ring-amber-400",
  PROCESSING:
    "bg-blue-50 text-blue-700 border-blue-300 focus-visible:ring-blue-400",
  SHIPPED:
    "bg-emerald-50 text-emerald-700 border-emerald-300 focus-visible:ring-emerald-400",
  CANCELLED:
    "bg-red-50 text-red-700 border-red-300 focus-visible:ring-red-400",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  return (
    <Select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`w-[150px] text-xs font-semibold cursor-pointer ${
        statusStyles[currentStatus]
      } ${isPending ? "opacity-50 cursor-wait" : ""}`}
    >
      <option value="PENDING">⏳ Pending</option>
      <option value="PROCESSING">🔄 Processing</option>
      <option value="SHIPPED">✅ Shipped</option>
      <option value="CANCELLED">❌ Cancelled</option>
    </Select>
  );
}
