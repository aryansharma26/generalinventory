import type { Request, Response } from "express";
import { SaleService } from "../services/sale.service.js";
import { checkoutSchema } from "../validators/sale.validator.js";

const service = new SaleService();

export const checkout = async (request: Request, response: Response) => {
  const sale = await service.checkout(checkoutSchema.parse(request.body));
  response.status(201).json({ sale });
};
