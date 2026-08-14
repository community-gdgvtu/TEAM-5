import { Router } from "express";
import {
  getOrgDashboard,
  getOrgReports,
  getOrgReportDetail,
  verifyOrgReport,
  publishOrgJob,
  getOrgJobs,
  advanceOrgJob,
  getOrgDisputes,
  resolveOrgDispute,
  aiReviewOrgDispute,
  getOrgWorkers,
  setWorkerStatus,
  setWorkerVerified,
  getOrgAnalytics,
  getOrgTeam,
  addOrgTeamMember,
  updateOrgTeamMember,
  getOrgSettings,
  updateOrgSettings,
} from "../controllers/organization.controller";

/**
 * 🔵 Teammate B — Organization routes. Own this file.
 * All endpoints live under /api/organization/* so they never collide with the
 * citizen (/api/reports), worker (/api/jobs, /api/bids) or investor routers.
 */
const router = Router();

// Dashboard
router.get("/organization/dashboard", getOrgDashboard);

// Reports queue + verification
router.get("/organization/reports", getOrgReports);
router.get("/organization/reports/:id", getOrgReportDetail);
router.post("/organization/reports/:id/verify", verifyOrgReport);
router.post("/organization/reports/:id/publish", publishOrgJob);

// Jobs (kanban tracker)
router.get("/organization/jobs", getOrgJobs);
router.post("/organization/jobs/:id/advance", advanceOrgJob);

// Disputes
router.get("/organization/disputes", getOrgDisputes);
router.post("/organization/disputes/:id/ai-review", aiReviewOrgDispute);
router.post("/organization/disputes/:id/resolve", resolveOrgDispute);

// Worker directory
router.get("/organization/workers", getOrgWorkers);
router.post("/organization/workers/:id/status", setWorkerStatus);
router.post("/organization/workers/:id/verify", setWorkerVerified);

// Analytics
router.get("/organization/analytics", getOrgAnalytics);

// Team & access management
router.get("/organization/team", getOrgTeam);
router.post("/organization/team", addOrgTeamMember);
router.put("/organization/team/:id", updateOrgTeamMember);

// Settings
router.get("/organization/settings", getOrgSettings);
router.put("/organization/settings", updateOrgSettings);

export default router;
export { router as organizationRouter };
