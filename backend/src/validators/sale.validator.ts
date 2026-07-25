import { z } from "zod";

export const checkoutSchema = z.object({
  paymentMethod: z.enum(["cash", "upi", "card", "split"]).default("cash"),
  lines: z.array(z.object({
    id: z.coerce.number().int().positive(),
    qty: z.coerce.number().int().positive(),
    price: z.coerce.number().nonnegative(),
  })).min(1),
});
