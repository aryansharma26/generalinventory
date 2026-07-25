import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sku: z.string().trim().min(2).max(40).transform((value) => value.toUpperCase()),
  barcode: z.string().trim().max(80).optional(),
  category: z.string().trim().min(2).max(80),
  unit: z.string().trim().min(1).max(30),
  price: z.coerce.number().nonnegative(),
  cost: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  reorderLevel: z.coerce.number().int().nonnegative().default(10),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i).default("#6f4ef2"),
});
