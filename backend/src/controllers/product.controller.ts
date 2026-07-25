import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { createProductSchema } from "../validators/product.validator.js";

const service = new ProductService();

export const listProducts = async (request: Request, response: Response) => {
  const products = await service.list(typeof request.query.search === "string" ? request.query.search : undefined);
  response.json({ products });
};

export const createProduct = async (request: Request, response: Response) => {
  const product = await service.create(createProductSchema.parse(request.body));
  response.status(201).json({ product });
};
