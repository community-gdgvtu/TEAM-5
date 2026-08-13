import { Request, Response } from "express";
import { CampaignModel } from "../models/Campaign.model";
import { isMongoConnected } from "../config/db";

/**
 * 🟣 Teammate D — Investor endpoints.
 * Owns this file + routes/investor.routes.ts.
 * Falls back to mock data when MongoDB is offline so the demo always runs.
 */

export async function getFundedProjects(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ funded: MOCK_FUNDED });
    }
    const campaigns = await CampaignModel.find().lean();
    return res.json({ funded: campaigns.length ? campaigns : MOCK_FUNDED });
  } catch (err) {
    return res.json({ funded: MOCK_FUNDED });
  }
}

export async function getImpactAnalytics(_req: Request, res: Response) {
  return res.json({ impact: MOCK_IMPACT });
}

export async function fundCampaign(req: Request, res: Response) {
  const { campaignId, amount } = req.body || {};
  return res.status(201).json({
    transaction: { id: `txn_${Date.now()}`, campaignId, amount, status: "Pending" },
  });
}

export async function getCampaignDetail(req: Request, res: Response) {
  const { id } = req.params;
  return res.json({
    id,
    title: "Fix the pothole on Main St",
    targetAmount: 45,
    raisedAmount: 12,
    aiConfidence: 0.92,
    workerRating: 4.9,
  });
}

const MOCK_FUNDED = [
  {
    id: "cmp_001",
    title: "Andheri Flyover Pothole Emergency Resurfacing",
    socialImpact: "High",
    roi: 14.2,
    status: "InProgress",
  },
  {
    id: "cmp_002",
    title: "Koramangala 4th Block Drain Clearing",
    socialImpact: "Medium",
    roi: 9.8,
    status: "Verified",
  },
];

const MOCK_IMPACT = [
  { id: "imp_001", title: "Andheri Flyover Resurfacing", jobsCreated: 6, socialImpact: "2,000+ daily commuters" },
];