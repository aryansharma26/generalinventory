import { ProductRepository } from "../repositories/product.repository.js";
import type { createProductSchema } from "../validators/product.validator.js";
import type { z } from "zod";

type ProductInput = z.infer<typeof createProductSchema>;

export class ProductService {
  constructor(private readonly repository = new ProductRepository()) {}

  async list(search?: string) {
    const products = await this.repository.list(search);
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: Number(product.sellingPrice),
      cost: Number(product.purchasePrice),
      stock: product.stock,
      unit: product.unit,
      accent: product.accent,
    }));
  }

  async create(input: ProductInput) {
    const product = await this.repository.create({
      name: input.name,
      sku: input.sku,
      barcode: input.barcode || null,
      category: input.category,
      unit: input.unit,
      sellingPrice: input.price,
      purchasePrice: input.cost,
      stock: input.stock,
      reorderLevel: input.reorderLevel,
      accent: input.accent,
    });
    return { ...product, price: Number(product.sellingPrice), cost: Number(product.purchasePrice) };
  }
}
