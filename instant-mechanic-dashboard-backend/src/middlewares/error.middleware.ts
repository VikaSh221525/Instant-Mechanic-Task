import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Mongoose validation / cast errors
  if (err && typeof err === "object" && "name" in err) {
    const name = (err as { name: string }).name;
    if (name === "ValidationError" || name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        details: (err as Error).message,
      });
    }
  }

  console.error("[error]", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(env.isProduction ? {} : { stack: (err as Error)?.stack }),
  });
}
