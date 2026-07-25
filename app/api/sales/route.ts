import { getDb } from "../../../db";
import { inventoryMovements, saleItems, sales } from "../../../db/schema";

type CheckoutLine = { id: number; qty: number; price: number };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { lines?: CheckoutLine[]; paymentMethod?: string };
    const lines = body.lines?.filter((line) => line.id > 0 && line.qty > 0) ?? [];
    if (!lines.length) return Response.json({ error: "The cart is empty." }, { status: 400 });
    const db = getDb();
    const invoiceNumber = `INV-${Date.now().toString().slice(-7)}`;
    const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const [sale] = await db.insert(sales).values({ invoiceNumber, total, paymentMethod: body.paymentMethod || "cash" }).returning();
    await db.batch(lines.flatMap((line) => [
      db.insert(saleItems).values({ saleId: sale.id, productId: line.id, quantity: line.qty, unitPrice: line.price }),
      db.insert(inventoryMovements).values({ productId: line.id, quantity: -line.qty, reason: `Sale ${invoiceNumber}` }),
    ]));
    return Response.json({ sale }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to complete the sale." }, { status: 500 });
  }
}
