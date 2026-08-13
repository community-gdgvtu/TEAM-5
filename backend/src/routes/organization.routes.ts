import { Router } from "express";
import {
  getPendingReports,
  getOrgJobs,
  getPendingBids,
  verifyReport,
  pushToMarketplace,
} from "../controllers/organization.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🔵 Teammate B — Organization routes. Own this file.
 * Mounted at /api/reports/pending, /api/jobs, /api/bids.
 */
const router = Router();

router.get("/reports/pending", getPendingReports);
router.post("/reports/:id/verify", authMiddleware, verifyReport);
router.post("/marketplace", authMiddleware, pushToMarketplace);
router.get("/jobs", getOrgJobs);
router.get("/bids", getPendingBids);

export default router;
export { router as organizationRouter };