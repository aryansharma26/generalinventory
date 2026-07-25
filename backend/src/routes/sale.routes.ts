import { Router } from "express";
import { checkout } from "../controllers/sale.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const saleRouter = Router();
saleRouter.post("/", asyncHandler(checkout));
