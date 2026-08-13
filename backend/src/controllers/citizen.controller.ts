import { Request, Response } from "express";
import { IssueModel } from "../models/Issue.model";
import { estimateCost } from "../services/ai.service";
import { isMongoConnected } from "../config/db";

/**
 * 🟢 Teammate A — Citizen endpoints.
 * Owns this file + routes/citizen.routes.ts.
 * Falls back to mock data when MongoDB is offline so the demo always runs.
 */

export async function getMyReports(req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ reports: MOCK_REPORTS });
    }
    const userId = (req as any).userId;
    const issues = await IssueModel.find({ reporterId: userId }).lean();
    return res.json({ reports: issues.length ? issues : MOCK_REPORTS });
  } catch (err) {
    console.error("[CITIZEN] getMyReports:", err);
    return res.json({ reports: MOCK_REPORTS });
  }
}

export async function getIssueDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const mock = MOCK_REPORTS.find((r) => r.id === id);
      if (!mock) return res.status(404).json({ error: "Issue not found." });
      return res.json(mock);
    }
    const issue = await IssueModel.findOne({ id }).lean();
    if (!issue) return res.status(404).json({ error: "Issue not found." });
    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load issue." });
  }
}

export async function createReport(req: Request, res: Response) {
  try {
    const { issueType, description, photoUrl, location } = req.body || {};
    const userId = (req as any).userId;

    const aiEstimate = await estimateCost({ photoUrl: photoUrl || "", issueType: issueType || "pothole", description });

    if (!isMongoConnected()) {
      return res.status(201).json({
        report: {
          id: `iss_${Date.now()}`,
          reporterId: userId || "user_citizen_001",
          issueType: issueType || "pothole",
          description: description || "New issue reported by citizen",
          photoUrl,
          location: location || { city: "Mumbai", state: "Maharashtra", country: "India" },
          aiEstimate,
          status: "Reported",
        },
      });
    }

    const issue = new IssueModel({
      id: `iss_${Date.now()}`,
      reporterId: userId || "user_citizen_001",
      issueType: issueType || "pothole",
      description: description || "New issue reported by citizen",
      photoUrl,
      location: location || { city: "Mumbai", state: "Maharashtra", country: "India" },
      aiEstimate,
      status: "Reported",
    });
    await issue.save();

    return res.status(201).json({ report: issue });
  } catch (err) {
    console.error("[CITIZEN] createReport:", err);
    return res.status(500).json({ error: "Failed to create report." });
  }
}

export async function getDonationCampaigns(req: Request, res: Response) {
  return res.json({ campaigns: MOCK_CAMPAIGNS });
}

const MOCK_REPORTS = [
  {
    id: "iss_001",
    issueType: "pothole",
    description: "Deep pothole on Main St near bus stop",
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    aiEstimate: { amount: 45, currency: "INR", severity: "Moderate", confidence: 0.72 },
    status: "Funding",
  },
  {
    id: "iss_002",
    issueType: "streetlight",
    description: "Streetlight flickering for 2 weeks",
    location: { city: "Delhi", state: "Delhi NCR", country: "India" },
    aiEstimate: { amount: 150, currency: "INR", severity: "Minor", confidence: 0.8 },
    status: "Reported",
  },
];

const MOCK_CAMPAIGNS = [
  { id: "cmp_001", title: "Fix the pothole on Main St — ₹45 target", targetAmount: 45, raisedAmount: 12 },
  { id: "cmp_002", title: "Replace flickering streetlight — ₹150 target", targetAmount: 150, raisedAmount: 0 },
];