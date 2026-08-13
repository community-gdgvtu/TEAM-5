import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  } else {
    next();
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("[ERROR]", err);
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ error: err?.message || "Internal server error." });
}