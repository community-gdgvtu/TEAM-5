import { Request, Response } from "express";
import { IssueModel } from "../models/Issue.model";
import { CampaignModel } from "../models/Campaign.model";
import { estimateCost } from "../services/ai.service";
import { createFeedPost, FeedPostInput } from "../services/feed.service";
import { isMongoConnected } from "../config/db";
import { demoReports, demoCampaigns } from "../config/demoData";

/**
 * 🟢 Citizen endpoints.
 * Owns this file + routes/citizen.routes.ts.
 * Reads MongoDB when connected, falls back to rich demo data otherwise.
 */

function toCitizenReport(issue: any): any {
  const rawLoc =
    typeof issue.location === "string"
      ? { city: issue.location.split(",")[0]?.trim() || "India", state: issue.location.split(",").slice(1).join(",").trim(), country: "India" }
      : issue.location || { city: "India", state: "", country: "India" };
  const numericEstimate = typeof issue.aiEstimate === "number" ? issue.aiEstimate : issue.aiEstimate?.amount;
  const aiEstimate = {
    amount: numericEstimate ?? 0,
    currency: "INR",
    severity: issue.urgency === "High" ? "Critical" : issue.urgency === "Medium" ? "Moderate" : "Minor",
    confidence: issue.aiConfidence ?? 0.8,
    summary: `AI estimate: approx ₹${(numericEstimate ?? 0).toLocaleString("en-IN")}.`,
  };
  return {
    id: issue.id,
    title: issue.title || issue.issueType || "Civic issue",
    category: issue.category || "General",
    issueType: issue.issueType || (issue.category || "other").toLowerCase(),
    description: issue.description || issue.title || "",
    summary: issue.summary || aiEstimate.summary,
    location: rawLoc,
    aiEstimate,
    aiConfidence: issue.aiConfidence ?? 0.8,
    emoji: issue.emoji || "🛠️",
    gradient: issue.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
    area: issue.area || rawLoc.city || "—",
    citizenName: issue.citizenName || "You",
    citizenAvatar: issue.citizenAvatar || "🧑",
    submittedAt: issue.submittedAt || issue.createdAt || "recently",
    status: issue.reviewStatus === "approved" ? "Funding" : issue.reviewStatus === "rejected" ? "Rejected" : issue.reviewStatus === "pending" ? "Pending review" : (issue.status || "pending"),
    urgency: issue.urgency || "Medium",
  };
}

export async function getMyReports(req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ reports: demoReports.map(toCitizenReport) });
    }
    const userId = (req as any).userId;
    const issues = await IssueModel.find(userId ? { reporterId: userId } : {}).lean();
    return res.json({ reports: issues.length ? issues.map(toCitizenReport) : demoReports.map(toCitizenReport) });
  } catch (err) {
    console.error("[CITIZEN] getMyReports:", err);
    return res.json({ reports: demoReports.map(toCitizenReport) });
  }
}

export async function getIssueDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const mock = demoReports.find((r) => r.id === id);
      if (!mock) return res.status(404).json({ error: "Issue not found." });
      return res.json({ report: toCitizenReport(mock) });
    }
    const issue = await IssueModel.findOne({ id }).lean();
    if (!issue) return res.status(404).json({ error: "Issue not found." });
    return res.json({ report: toCitizenReport(issue) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load issue." });
  }
}

export async function createReport(req: Request, res: Response) {
  try {
    const {
      issueType,
      description,
      photoUrl,
      location,
      postType = "issue",
      taggedWorker,
      hashtags,
      title,
      qualityScore,
      userEstimate,
    } = req.body || {};
    const userId = (req as any).userId;

    const aiEstimate = await estimateCost({ photoUrl: photoUrl || "", issueType: issueType || "pothole", description });

    const report = {
      id: `iss_${Date.now()}`,
      reporterId: userId || "user_citizen_001",
      issueType: issueType || "pothole",
      description: description || "New issue reported by citizen",
      photoUrl,
      location: location || { city: "Mumbai", state: "Maharashtra", country: "India" },
      aiEstimate,
      userEstimate: userEstimate ?? null,
      status: postType === "failed" ? "Rejected" : postType === "completed" ? "Done" : "Reported",
    };

    const city = report.location.city || "site";
    const postInput: FeedPostInput = {
      type: postType === "completed" ? "completed" : postType === "failed" ? "failed" : "issue",
      title:
        title ||
        (postType === "completed"
          ? `${report.issueType.charAt(0).toUpperCase()}${report.issueType.slice(1)} fixed — Work Done on ${city}`
          : postType === "failed"
            ? `${report.issueType.charAt(0).toUpperCase()}${report.issueType.slice(1)} not fixed — Work Failed on ${city}`
            : `${report.issueType.charAt(0).toUpperCase()}${report.issueType.slice(1)} reported on ${city}`),
      caption: report.description,
      category: report.issueType,
      emoji:
        report.issueType === "pothole"
          ? "🕳️"
          : report.issueType === "streetlight"
            ? "💡"
            : report.issueType === "tree"
              ? "🌳"
              : postType === "failed"
                ? "⚠️"
                : "🛠️",
      gradient:
        postType === "completed"
          ? "linear-gradient(135deg,#22c55e,#0d9488)"
          : postType === "failed"
            ? "linear-gradient(135deg,#ef4444,#b91c1c)"
            : "linear-gradient(135deg,#f97316,#ef4444)",
      authorId: report.reporterId,
      authorName: (req as any).userName || "You",
      authorAvatar: "🧑",
      authorRole: "citizen",
      authorVerified: true,
      area: city,
      location: `${report.location.city || ""}, ${report.location.state || ""}`.replace(/^,\s*/, "") || "India",
      amount: aiEstimate?.amount ?? userEstimate ?? undefined,
      status: postType === "completed" ? "Completed" : postType === "failed" ? "Work Failed" : "Pending review",
      urgency: aiEstimate?.severity === "Critical" ? "High" : aiEstimate?.severity === "Minor" ? "Low" : "Medium",
      hashtags: hashtags?.length
        ? hashtags
        : ["#CitizenReported", "#FixIt"].concat(postType === "failed" ? ["#WorkFailed"] : postType === "completed" ? ["#WorkDone"] : []),
      issueId: report.id,
      photoUrl,
      taggedWorker,
      qualityScore,
      locationTag: location,
    };

    if (!isMongoConnected()) {
      await createFeedPost(postInput);
      return res.status(201).json({ report });
    }

    const issue = new IssueModel(report);
    await issue.save();

    await createFeedPost(postInput);

    return res.status(201).json({ report });
  } catch (err) {
    console.error("[CITIZEN] createReport:", err);
    return res.status(500).json({ error: "Failed to create report." });
  }
}

export async function getDonationCampaigns(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ campaigns: demoCampaigns });
    }
    const campaigns = await CampaignModel.find().lean();
    return res.json({ campaigns: campaigns.length ? campaigns : demoCampaigns });
  } catch (err) {
    return res.json({ campaigns: demoCampaigns });
  }
}