import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { products } from "../../../db/schema";

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(products).orderBy(desc(products.id));
    return Response.json({ products: rows });
  } catch {
    return Response.json({ products: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<typeof products.$inferInsert>;
    if (!body.name?.trim() || !body.sku?.trim() || !body.category?.trim()) {
      return Response.json({ error: "Name, SKU and category are required." }, { status: 400 });
    }
    const db = getDb();
    const duplicate = await db.select({ id: products.id }).from(products).where(eq(products.sku, body.sku.trim())).limit(1);
    if (duplicate.length) return Response.json({ error: "This SKU already exists." }, { status: 409 });
    const [product] = await db.insert(products).values({
      name: body.name.trim(),
      sku: body.sku.trim().toUpperCase(),
      category: body.category.trim(),
      price: Math.max(0, Number(body.price) || 0),
      cost: Math.max(0, Number(body.cost) || 0),
      stock: Math.max(0, Math.floor(Number(body.stock) || 0)),
      unit: body.unit?.trim() || "unit",
      accent: body.accent || "#6f4ef2",
    }).returning();
    return Response.json({ product }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to save the product." }, { status: 500 });
  }
}
