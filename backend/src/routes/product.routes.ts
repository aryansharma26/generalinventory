import { Router } from "express";
import { createProduct, listProducts } from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const productRouter = Router();
productRouter.get("/", asyncHandler(listProducts));
productRouter.post("/", asyncHandler(createProduct));
