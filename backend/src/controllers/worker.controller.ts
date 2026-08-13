import { Request, Response } from "express";
import { JobModel } from "../models/Job.model";
import { BidModel } from "../models/Bid.model";
import { isMongoConnected } from "../config/db";

/**
 * 🟠 Teammate C — Worker endpoints.
 * Owns this file + routes/worker.routes.ts.
 * Falls back to mock data when MongoDB is offline so the demo always runs.
 */

export async function getOpenJobs(req: Request, res: Response) {
  const { status = "open" } = req.query as any;
  try {
    if (!isMongoConnected()) {
      return res.json({ jobs: MOCK_JOBS });
    }
    const jobs = await JobModel.find({ status }).lean();
    return res.json({ jobs: jobs.length ? jobs : MOCK_JOBS });
  } catch (err) {
    return res.json({ jobs: MOCK_JOBS });
  }
}

export async function getJobDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const mock = MOCK_JOBS.find((j) => j.id === id);
      if (!mock) return res.status(404).json({ error: "Job not found." });
      return res.json(mock);
    }
    const job = await JobModel.findOne({ id }).lean();
    if (!job) return res.status(404).json({ error: "Job not found." });
    return res.json(job);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load job." });
  }
}

export async function getMyBids(req: Request, res: Response) {
  const userId = (req as any).userId;
  try {
    if (!isMongoConnected()) {
      return res.json({ bids: MOCK_BIDS });
    }
    const bids = await BidModel.find({ workerId: userId }).lean();
    return res.json({ bids: bids.length ? bids : MOCK_BIDS });
  } catch (err) {
    return res.json({ bids: MOCK_BIDS });
  }
}

export async function submitBid(req: Request, res: Response) {
  const { jobId } = req.params;
  const { amount, timeline, message } = req.body || {};
  const userId = (req as any).userId;

  const bid = {
    id: `bid_${Date.now()}`,
    jobId,
    workerId: userId || "user_worker_002",
    amount: Number(amount) || 100,
    timeline: timeline || "3 days",
    message: message || "",
    status: "Pending",
  };

  if (!isMongoConnected()) {
    return res.status(201).json({ bid });
  }

  try {
    const doc = new BidModel(bid);
    await doc.save();
    return res.status(201).json({ bid: doc });
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit bid." });
  }
}

export async function uploadProof(req: Request, res: Response) {
  const { jobId } = req.params;
  const { afterPhotoUrl } = req.body || {};
  return res.json({ jobId, status: "Submitted", afterPhotoUrl });
}

const MOCK_JOBS = [
  {
    id: "job_001",
    title: "Andheri Flyover Pothole Emergency Resurfacing",
    issueType: "pothole",
    location: { city: "Mumbai", state: "Maharashtra" },
    payout: 85000,
    status: "Open",
    photoUrl: "https://example.com/pothole.png",
  },
  {
    id: "job_002",
    title: "Sector 14 Streetlight LED Grid Replacement",
    issueType: "streetlight",
    location: { city: "Delhi", state: "Delhi NCR" },
    payout: 120000,
    status: "Open",
    photoUrl: "https://example.com/streetlight.png",
  },
];

const MOCK_BIDS = [
  { id: "bid_001", jobTitle: "Andheri Flyover Pothole Emergency Resurfacing", status: "Pending", amount: 84000 },
];