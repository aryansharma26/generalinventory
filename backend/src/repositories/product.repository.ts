import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";

export class ProductRepository {
  list(search?: string) {
    return prisma.product.findMany({
      where: search ? {
        active: true,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      } : { active: true },
      orderBy: { createdAt: "desc" },
    });
  }

  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }
}
