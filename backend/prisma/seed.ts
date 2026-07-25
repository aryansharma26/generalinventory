import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  ["Aashirvaad Atta", "GR-1008", "Grains", 310, 274, 42, "5 kg", "#e9a84c"],
  ["Tata Salt", "GR-1012", "Essentials", 28, 23, 8, "1 kg", "#5d91e7"],
  ["Fortune Sunflower Oil", "GR-1021", "Cooking", 158, 143, 17, "1 L", "#eac848"],
  ["Amul Taaza Milk", "GR-1034", "Dairy", 58, 52, 6, "1 L", "#56a9dc"],
  ["Brooke Bond Red Label", "GR-1041", "Beverages", 275, 244, 24, "500 g", "#d7554e"],
  ["Surf Excel Matic", "GR-1057", "Household", 245, 218, 0, "1 kg", "#3e8fd4"],
] as const;

async function main() {
  await prisma.user.upsert({
    where: { email: "owner@slate.local" },
    update: {},
    create: {
      name: "Store Owner",
      email: "owner@slate.local",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
      role: Role.OWNER,
    },
  });
  for (const [name, sku, category, sellingPrice, purchasePrice, stock, unit, accent] of products) {
    await prisma.product.upsert({
      where: { sku },
      update: {},
      create: { name, sku, category, sellingPrice, purchasePrice, stock, unit, accent },
    });
  }
}

main().finally(async () => prisma.$disconnect());
