import { Router } from "express";
import { listThreads, getThread, sendMessage } from "../controllers/messages.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 💬 Messages inbox (IG-DM style, threads per issue/job/campaign).
 * Mounted at /api/messages. Every role reads its own inbox.
 */
const router = Router();

router.get("/messages", authMiddleware, listThreads);
router.get("/messages/:id", authMiddleware, getThread);
router.post("/messages/:id/send", authMiddleware, sendMessage);

export default router;
export { router as messagesRouter };
