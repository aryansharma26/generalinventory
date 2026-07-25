import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: "draft-8" }));
app.use(pinoHttp());
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);
