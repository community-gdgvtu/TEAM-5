import { Router } from "express";
import { getMyReports, getIssueDetail, createReport, getDonationCampaigns } from "../controllers/citizen.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * 🟢 Teammate A — Citizen routes. Own this file.
 * Mounted at /api/reports, /api/campaigns.
 */
const router = Router();

// Use authMiddleware when ready — uncomment to require a logged-in citizen.
router.get("/reports", getMyReports);
router.get("/reports/:id", getIssueDetail);
router.post("/reports", authMiddleware, createReport);
router.get("/campaigns", getDonationCampaigns);

export default router;
export { router as citizenRouter };