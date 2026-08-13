import { Router } from "express";
import {
  getOpenJobs,
  getJobDetail,
  getMyBids,
  submitBid,
  uploadProof,
  getActiveJobs,
  getWallet,
  getWorkerProfile,
  getWorkerReviews,
} from "../controllers/worker.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🟠 Worker routes. Mounted at /api/jobs, /api/bids.
 * Read endpoints are open so the marketplace always renders in the demo;
 * write endpoints verify the session token.
 */
const router = Router();

router.get("/jobs", getOpenJobs);
router.get("/jobs/:id", getJobDetail);
router.post("/jobs/:jobId/bids", authMiddleware, submitBid);
router.get("/bids", getMyBids);
router.post("/jobs/:jobId/proof", authMiddleware, uploadProof);

router.get("/jobs/active/all", getActiveJobs);
router.get("/wallet", getWallet);
router.get("/worker/profile", getWorkerProfile);
router.get("/worker/reviews", getWorkerReviews);

export default router;
export { router as workerRouter };