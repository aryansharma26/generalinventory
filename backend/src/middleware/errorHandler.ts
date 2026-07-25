import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const notFound: RequestHandler = (request, _response, next) => {
  next(new AppError(`Route ${request.method} ${request.path} not found`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: "Validation failed", details: error.flatten() });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message, details: error.details });
    return;
  }
  response.status(500).json({ error: "Internal server error" });
};
