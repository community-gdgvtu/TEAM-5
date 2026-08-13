import { Request, Response } from "express";
import { CampaignModel } from "../models/Campaign.model";
import { TransactionModel } from "../models/Transaction.model";
import { isMongoConnected } from "../config/db";
import {
  demoCampaigns,
  demoRegionalImpact,
  demoImpactAnalytics,
  DemoCampaign,
} from "../config/demoData";

/**
 * 🟣 Investor endpoints.
 * Owns this file + routes/investor.routes.ts.
 * Reads MongoDB when connected, falls back to rich demo data otherwise so the
 * investor portfolio and impact dashboards always render.
 */

function enrichFromDemo(campaign: any, demo: DemoCampaign | undefined): any {
  return {
    ...campaign,
    title: campaign.title || demo?.title || "Civic impact campaign",
    category: campaign.category || demo?.category || "Civic",
    emoji: campaign.emoji || demo?.emoji || "🏗️",
    gradient: campaign.gradient || demo?.gradient || "linear-gradient(135deg,#a855f7,#6366f1)",
    org: campaign.org || demo?.org || "Municipal Corporation",
    orgVerified: campaign.orgVerified ?? demo?.orgVerified ?? true,
    location: campaign.location || demo?.location || "India",
    area: campaign.area || demo?.area || "—",
    description: campaign.description || demo?.description || "",
    targetAmount: campaign.targetAmount ?? demo?.targetAmount ?? 0,
    raisedAmount: campaign.raisedAmount ?? demo?.raisedAmount ?? 0,
    currency: campaign.currency || "INR",
    backers: campaign.backers ?? demo?.backers ?? 0,
    likes: campaign.likes ?? demo?.likes ?? 0,
    shares: campaign.shares ?? demo?.shares ?? 0,
    comments: campaign.comments ?? demo?.comments ?? [],
    aiConfidence: campaign.aiConfidence ?? demo?.aiConfidence ?? 0.9,
    workerRating: campaign.workerRating ?? demo?.workerRating ?? 4.5,
    impactScore: campaign.impactScore ?? demo?.impactScore ?? 80,
    status: campaign.status || demo?.status || "Funding",
    workerBids: campaign.workerBids ?? demo?.workerBids ?? [],
    createdAt: campaign.createdAt || demo?.createdAt || new Date().toISOString().slice(0, 10),
    hashtags: campaign.hashtags ?? demo?.hashtags ?? [],
    beforeAfter: campaign.beforeAfter ?? demo?.beforeAfter,
    payout: campaign.payout ?? demo?.payout,
    impactSummary: campaign.impactSummary ?? demo?.impactSummary,
  };
}

export async function getInvestorFeed(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ campaigns: demoCampaigns.filter((c) => c.status === "Funding" || c.status === "InProgress") });
    }
    const campaigns = await CampaignModel.find({ status: { $in: ["Active", "Funded"] } }).lean();
    if (!campaigns.length) return res.json({ campaigns: demoCampaigns.filter((c) => c.status === "Funding" || c.status === "InProgress") });
    return res.json({
      campaigns: campaigns.map((c) =>
        enrichFromDemo(c, demoCampaigns.find((d) => d.id === c.id))
      ),
    });
  } catch (err) {
    return res.json({ campaigns: demoCampaigns.filter((c) => c.status === "Funding" || c.status === "InProgress") });
  }
}

export async function getFundedProjects(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ funded: demoCampaigns.map((c) => enrichFromDemo({}, c)) });
    }
    const campaigns = await CampaignModel.find().lean();
    return res.json({
      funded: (campaigns.length ? campaigns : demoCampaigns).map((c) =>
        enrichFromDemo(c, demoCampaigns.find((d) => d.id === c.id))
      ),
    });
  } catch (err) {
    return res.json({ funded: demoCampaigns.map((c) => enrichFromDemo({}, c)) });
  }
}

export async function getCampaignDetail(req: Request, res: Response) {
  const { id } = req.params;
  const demo = demoCampaigns.find((c) => c.id === id);
  try {
    if (!isMongoConnected()) {
      if (!demo) return res.status(404).json({ error: "Campaign not found." });
      return res.json(demo);
    }
    const campaign = await CampaignModel.findOne({ id }).lean();
    if (!campaign && !demo) return res.status(404).json({ error: "Campaign not found." });
    return res.json(campaign ? enrichFromDemo(campaign, demo) : demo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load campaign." });
  }
}

export async function getPortfolio(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ campaigns: demoCampaigns.map((c) => enrichFromDemo({}, c)) });
    }
    const campaigns = await CampaignModel.find().lean();
    return res.json({
      campaigns: (campaigns.length ? campaigns : demoCampaigns).map((c) =>
        enrichFromDemo(c, demoCampaigns.find((d) => d.id === c.id))
      ),
    });
  } catch (err) {
    return res.json({ campaigns: demoCampaigns.map((c) => enrichFromDemo({}, c)) });
  }
}

export async function getImpactAnalytics(_req: Request, res: Response) {
  return res.json({ impact: demoImpactAnalytics });
}

export async function getRegionalImpact(_req: Request, res: Response) {
  return res.json({ impact: demoRegionalImpact });
}

export async function getTrustScore(req: Request, res: Response) {
  const { id } = req.params;
  const demo = demoCampaigns.find((c) => c.id === id);
  try {
    if (!isMongoConnected()) {
      if (!demo) return res.status(404).json({ error: "Campaign not found." });
      return res.json(demo);
    }
    const campaign = await CampaignModel.findOne({ id }).lean();
    if (!campaign && !demo) return res.status(404).json({ error: "Campaign not found." });
    return res.json(campaign ? enrichFromDemo(campaign, demo) : demo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load trust data." });
  }
}

export async function getCompletionReport(req: Request, res: Response) {
  const { id } = req.params;
  const demo = demoCampaigns.find((c) => c.id === id);
  try {
    if (!isMongoConnected()) {
      if (!demo) return res.status(404).json({ error: "Campaign not found." });
      return res.json(demo);
    }
    const campaign = await CampaignModel.findOne({ id }).lean();
    if (!campaign && !demo) return res.status(404).json({ error: "Campaign not found." });
    return res.json(campaign ? enrichFromDemo(campaign, demo) : demo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load completion report." });
  }
}

export async function getPayout(req: Request, res: Response) {
  const { id } = req.params;
  const demo = demoCampaigns.find((c) => c.id === id);
  try {
    if (!isMongoConnected()) {
      if (!demo) return res.status(404).json({ error: "Campaign not found." });
      return res.json(demo);
    }
    const campaign = await CampaignModel.findOne({ id }).lean();
    if (!campaign && !demo) return res.status(404).json({ error: "Campaign not found." });
    return res.json(campaign ? enrichFromDemo(campaign, demo) : demo);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load payout info." });
  }
}

export async function fundCampaign(req: Request, res: Response) {
  const { campaignId, amount } = req.body || {};
  const userId = (req as any).userId || "user_demo_investor_001";
  const txn = {
    id: `txn_${Date.now()}`,
    campaignId,
    payerId: userId,
    amount: Number(amount) || 0,
    currency: "INR",
    method: "upi",
    reference: `rzp_${Date.now()}`,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  if (!isMongoConnected()) {
    return res.status(201).json({ transaction: txn });
  }

  try {
    await TransactionModel.create(txn);
    if (campaignId) {
      await CampaignModel.updateOne({ id: campaignId }, { $inc: { raisedAmount: txn.amount } });
    }
    return res.status(201).json({ transaction: txn });
  } catch (err) {
    return res.status(500).json({ error: "Failed to process funding." });
  }
}
