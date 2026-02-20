import { describe, it, expect, beforeEach, vi } from "vitest";
import prismaMock from "../../mocks/prisma";
import "../../mocks/next-cache";

import { updateOrderStatus } from "@/actions/admin/orders";

describe("Admin Order Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateOrderStatus", () => {
    it("should update order status to PROCESSING", async () => {
      const mockOrder = { id: "order-1", status: "PROCESSING" };
      prismaMock.order.update.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus("order-1", "PROCESSING");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrder);
      expect(prismaMock.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "PROCESSING" },
      });
    });

    it("should update order status to SHIPPED", async () => {
      const mockOrder = { id: "order-1", status: "SHIPPED" };
      prismaMock.order.update.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus("order-1", "SHIPPED");

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe("SHIPPED");
    });

    it("should update order status to CANCELLED", async () => {
      const mockOrder = { id: "order-1", status: "CANCELLED" };
      prismaMock.order.update.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus("order-1", "CANCELLED");

      expect(result.success).toBe(true);
    });

    it("should return error on failure", async () => {
      prismaMock.order.update.mockRejectedValue(new Error("fail"));

      const result = await updateOrderStatus("order-1", "PENDING");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to update order status");
    });
  });
});
