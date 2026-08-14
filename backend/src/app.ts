import express from "express";
import { connectMongoDB } from "./config/db";
import apiRouter from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

/**
 * Express app assembly. No networking here — that lives in server.ts.
 * Touched only when adding global middleware — otherwise stays out of the way.
 */
export async function createApp(): Promise<express.Express> {
  await connectMongoDB();

  const app = express();

  app.use(express.json({ limit: "20mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Civic Fix AI" });
  });

  app.use("/api", apiRouter);

  // Middleware must come after routes
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}