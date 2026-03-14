import { z } from "zod";

export const inventoryAdjustmentSchema = z.object({
  inventory_item_id: z.string().uuid(),
  quantity_delta: z.number(),
  reason: z.string().min(1),
});
