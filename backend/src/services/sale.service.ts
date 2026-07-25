import { PaymentMethod, Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import type { checkoutSchema } from "../validators/sale.validator.js";
import type { z } from "zod";

type CheckoutInput = z.infer<typeof checkoutSchema>;

const paymentMethods: Record<CheckoutInput["paymentMethod"], PaymentMethod> = {
  cash: "CASH",
  upi: "UPI",
  card: "CARD",
  split: "SPLIT",
};

export class SaleService {
  async checkout(input: CheckoutInput) {
    return prisma.$transaction(async (transaction) => {
      const products = await transaction.product.findMany({
        where: { id: { in: input.lines.map((line) => line.id) }, active: true },
      });
      if (products.length !== input.lines.length) throw new AppError("One or more products are unavailable", 400);

      for (const line of input.lines) {
        const product = products.find((item) => item.id === line.id);
        if (!product || product.stock < line.qty) {
          throw new AppError(`Insufficient stock for ${product?.name ?? "product"}`, 409);
        }
      }

      const subtotal = input.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
      const tax = subtotal * 0.05;
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
      const sale = await transaction.sale.create({
        data: {
          invoiceNumber,
          subtotal: new Prisma.Decimal(subtotal),
          tax: new Prisma.Decimal(tax),
          total: new Prisma.Decimal(subtotal),
          paymentMethod: paymentMethods[input.paymentMethod],
          items: {
            create: input.lines.map((line) => ({
              productId: line.id,
              quantity: line.qty,
              unitPrice: new Prisma.Decimal(line.price),
            })),
          },
        },
      });

      for (const line of input.lines) {
        await transaction.product.update({ where: { id: line.id }, data: { stock: { decrement: line.qty } } });
        await transaction.inventoryMovement.create({
          data: { productId: line.id, quantity: -line.qty, reason: `Sale ${invoiceNumber}` },
        });
      }
      return { ...sale, subtotal: Number(sale.subtotal), tax: Number(sale.tax), total: Number(sale.total) };
    });
  }
}
