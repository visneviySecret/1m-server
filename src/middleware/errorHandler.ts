import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  _err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500).json({ error: "Internal server error" });
}
