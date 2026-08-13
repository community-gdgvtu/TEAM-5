import { Router } from "express";
import { getOpenJobs, getJobDetail, getMyBids, submitBid, uploadProof } from "../controllers/worker.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🟠 Teammate C — Worker routes. Own this file.
 * Mounted at /api/jobs, /api/bids.
 */
const router = Router();

router.get("/jobs", getOpenJobs);
router.get("/jobs/:id", getJobDetail);
router.post("/jobs/:jobId/bids", authMiddleware, submitBid);
router.get("/bids", getMyBids);
router.post("/jobs/:jobId/proof", authMiddleware, uploadProof);

export default router;
export { router as workerRouter };