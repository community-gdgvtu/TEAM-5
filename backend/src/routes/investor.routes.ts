import { Router } from "express";
import {
  getFundedProjects,
  getImpactAnalytics,
  fundCampaign,
  getCampaignDetail,
  getInvestorFeed,
  getPortfolio,
  getRegionalImpact,
  getTrustScore,
  getCompletionReport,
  getPayout,
} from "../controllers/investor.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🟣 Investor routes. Mounted at /api/investor/*.
 * Read endpoints are open so the feed/portfolio always render in the demo;
 * write endpoints verify the session token.
 */
const router = Router();

router.get("/investor/funded", getFundedProjects);
router.get("/investor/impact", getImpactAnalytics);
router.get("/investor/campaigns/:id", getCampaignDetail);
router.post("/investor/fund", authMiddleware, fundCampaign);

router.get("/investor/feed", getInvestorFeed);
router.get("/investor/portfolio", getPortfolio);
router.get("/investor/regional", getRegionalImpact);
router.get("/investor/trust/:id", getTrustScore);
router.get("/investor/report/:id", getCompletionReport);
router.get("/investor/payout/:id", getPayout);

export default router;
export { router as investorRouter };