import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { env } from "./src/config/env";
import { createApp } from "./src/app";

/**
 * Entry point — bootstraps the Express app, wires Vite in dev, serves dist in prod.
 * Kept intentionally thin; all API logic lives in backend/src/.
 */
async function startServer() {
  const app = await createApp();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`\n=======================================================`);
    console.log(`🚀 Civic Fix Express App Running on http://0.0.0.0:${env.port}`);
    console.log(`💬 WhatsApp OTP Verification Gateway Initialized`);
    console.log(`🟢 Citizen · 🔵 Organization · 🟠 Worker · 🟣 Investor`);
    console.log(`=======================================================\n`);
  });
}

startServer();