import { Router } from "express";
import {
  getFundedProjects,
  getImpactAnalytics,
  fundCampaign,
  getCampaignDetail,
} from "../controllers/investor.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🟣 Teammate D — Investor routes. Own this file.
 * Mounted at /api/investor/*.
 */
const router = Router();

router.get("/investor/funded", getFundedProjects);
router.get("/investor/impact", getImpactAnalytics);
router.get("/investor/campaigns/:id", getCampaignDetail);
router.post("/investor/fund", authMiddleware, fundCampaign);

export default router;
export { router as investorRouter };