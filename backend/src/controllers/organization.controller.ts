import { Request, Response } from "express";

/**
 * 🔵 Teammate B — Organization endpoints.
 * Owns this file + routes/organization.routes.ts.
 * Stubs return mock data so the app runs end-to-end before DB flow is complete.
 */

export async function getPendingReports(_req: Request, res: Response) {
  return res.json({ reports: MOCK_PENDING });
}

export async function getOrgJobs(_req: Request, res: Response) {
  return res.json({ jobs: MOCK_JOBS });
}

export async function getPendingBids(_req: Request, res: Response) {
  return res.json({ bids: MOCK_BIDS });
}

export async function verifyReport(req: Request, res: Response) {
  const { id } = req.params;
  return res.json({ reportId: id, status: "Verified", note: "Marked verified (stub)" });
}

export async function pushToMarketplace(req: Request, res: Response) {
  const { issueId } = req.body || {};
  return res.status(201).json({ job: { id: `job_${Date.now()}`, issueId, status: "Open" } });
}

const MOCK_PENDING = [
  { id: "iss_002", issueType: "streetlight", location: { city: "Delhi", state: "Delhi NCR" }, status: "Reported" },
  { id: "iss_003", issueType: "cleaning", location: { city: "Bengaluru", state: "Karnataka" }, status: "Reported" },
];

const MOCK_JOBS = [
  { id: "job_001", title: "Andheri Flyover Pothole Emergency Resurfacing", status: "InProgress", worker: "Rajesh Verma", payout: 85000 },
  { id: "job_002", title: "Sector 14 Streetlight LED Grid Replacement", status: "Open", worker: "Unassigned", payout: 120000 },
];

const MOCK_BIDS = [
  { id: "bid_001", contractorName: "Rajesh Verma", rating: 4.9, jobId: "job_001", status: "Pending" },
  { id: "bid_002", contractorName: "Sunil Kumar", rating: 4.5, jobId: "job_001", status: "Pending" },
];