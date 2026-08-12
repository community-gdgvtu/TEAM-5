import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { askCivicosAI, CivicosRequestPayload } from "./src/lib/civicosService";

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Civic Fix Platform API" });
  });

  app.post("/api/civicos", async (req, res) => {
    try {
      const payload: CivicosRequestPayload = req.body;
      const result = await askCivicosAI(payload);
      res.json(result);
    } catch (err: any) {
      console.error("CIVICOS API error:", err);
      res.status(500).json({
        reply: "CIVICOS encountered a temporary error connecting to the neural model. Please try again shortly.",
        draft: undefined,
        actionShortcut: undefined
      });
    }
  });

  // Vite Middleware in Dev Mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Civic Fix Server running on http://localhost:${PORT}`);
  });
}

startServer();
