import { Router } from "express";
import { productRouter } from "./product.routes.js";
import { saleRouter } from "./sale.routes.js";

export const apiRouter = Router();
apiRouter.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "slate-inventory-api" });
});
apiRouter.use("/products", productRouter);
apiRouter.use("/sales", saleRouter);
