import { Router } from "express";
import { getFeed, createPost, likePost, commentPost, sharePost, getWorkTracking } from "../controllers/feed.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🌐 Unified community feed. Mounted at /api/feed.
 * Read is open so every role's feed renders in the demo; writes verify the
 * session token (and the auth middleware attaches req.userId).
 */
const router = Router();

router.get("/feed", getFeed);
router.get("/tracking/:id", getWorkTracking);
router.post("/feed", authMiddleware, createPost);
router.post("/feed/:id/like", authMiddleware, likePost);
router.post("/feed/:id/comment", authMiddleware, commentPost);
router.post("/feed/:id/share", authMiddleware, sharePost);

export default router;
export { router as feedRouter };
