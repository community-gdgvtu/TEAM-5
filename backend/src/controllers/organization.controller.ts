import { Request, Response } from "express";
import { IssueModel } from "../models/Issue.model";
import { JobModel, JobStage } from "../models/Job.model";
import { CampaignModel } from "../models/Campaign.model";
import { UserModel } from "../models/User.model";
import { DisputeModel } from "../models/Dispute.model";
import { OrganizationModel } from "../models/Organization.model";
import { isMongoConnected } from "../config/db";
import { createFeedPost } from "../services/feed.service";
import {
  demoReports,
  demoJobs,
  demoDisputes,
  demoWorkers,
  demoTeam,
  demoOrganization,
  demoAnalytics,
} from "../config/demoData";

/**
 * 🔵 Teammate B — Organization endpoints.
 * Owns this file + routes/organization.routes.ts.
 *
 * Every handler queries MongoDB through the shared Mongoose models when
 * connected, and falls back to demo data when MongoDB is offline so the
 * demo always runs (same pattern as citizen/worker controllers).
 *
 * Response shapes mirror `src/data/orgMock.ts` on the frontend.
 */

const DEFAULT_GRADIENT = "linear-gradient(135deg,#3b82f6,#6366f1)";

// ---------------------------------------------------------------- mappers

function initials(name: string): string {
  return (name || "MC")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function locLabel(loc: any): string {
  if (!loc) return "—";
  return [loc.city, loc.state, loc.country].filter(Boolean).join(", ") || "—";
}

function mapIssue(doc: any) {
  return {
    id: doc.id,
    title: doc.title || doc.description || "Unnamed issue",
    category: doc.category || doc.issueType || "General",
    emoji: doc.emoji || "📌",
    gradient: doc.gradient || DEFAULT_GRADIENT,
    area: doc.area || doc.location?.city || "—",
    location: locLabel(doc.location),
    citizenName: doc.citizenName || "Citizen",
    citizenAvatar: doc.citizenAvatar || "👤",
    submittedAt: doc.submittedAt || "just now",
    aiEstimate: doc.aiEstimate?.amount ?? 0,
    aiConfidence: doc.aiEstimate?.confidence ?? 0,
    aiFeatures: doc.aiFeatures || [],
    status: doc.reviewStatus || "pending",
    urgency: doc.urgency || "Medium",
    municipalNote: doc.municipalNote || undefined,
  };
}

function mapJob(doc: any) {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category || "General",
    emoji: doc.emoji || "🔧",
    gradient: doc.gradient || DEFAULT_GRADIENT,
    area: doc.area || doc.location?.city || "—",
    location: locLabel(doc.location),
    payout: doc.payout ?? 0,
    raised: doc.raised ?? 0,
    stage: doc.status || "Open",
    worker: doc.workerName,
    workerRating: doc.workerRating,
    bidsCount: doc.bidsCount ?? 0,
    postedAt: doc.postedAt || "just now",
    dueDate: doc.dueDate,
  };
}

function mapUser(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    skill: doc.supplementaryData?.workerSkillCategory || "General Civil Works",
    avatar: initials(doc.name),
    rating: doc.workerRating ?? 4.5,
    jobsDone: doc.workerJobsDone ?? 0,
    verified: doc.workerVerified ?? false,
    license: doc.supplementaryData?.workerLicenseId || "—",
    status: doc.workerStatus || "available",
    location: doc.location?.city || "—",
  };
}

function mapDispute(doc: any) {
  return {
    id: doc.id,
    jobTitle: doc.jobTitle,
    emoji: doc.emoji || "⚠️",
    gradient: doc.gradient || DEFAULT_GRADIENT,
    type: doc.type,
    severity: doc.severity,
    raisedBy: doc.raisedBy,
    raisedAt: doc.raisedAt,
    summary: doc.summary,
    worker: doc.worker,
    status: doc.status,
  };
}

function mapTeamMember(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    level: doc.level,
    avatar: doc.avatar || initials(doc.name),
    lastActive: doc.lastActive || "just added",
  };
}

function mapOrgSettings(doc: any) {
  return {
    orgName: doc.orgName,
    orgType: doc.orgType,
    regId: doc.regId,
    jurisdiction: doc.jurisdiction,
    email: doc.email,
    phone: doc.phone,
    notifNewReport: doc.notifNewReport,
    notifAiFlag: doc.notifAiFlag,
    notifEscrow: doc.notifEscrow,
    notifDispute: doc.notifDispute,
    notifEmailDigest: doc.notifEmailDigest,
    autoApproveLowUrgency: doc.autoApproveLowUrgency,
  };
}

// ------------------------------------------------------------- dashboard

export async function getOrgDashboard(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ analytics: demoAnalytics, reports: demoReports });
    }

    const [issues, jobs, campaigns] = await Promise.all([
      IssueModel.find().sort({ createdAt: -1 }).lean(),
      JobModel.find().sort({ createdAt: -1 }).lean(),
      CampaignModel.find().lean(),
    ]);

    const totalReports = issues.length || demoAnalytics.totalReports;
    const resolved = issues.filter((i: any) => i.reviewStatus === "approved" || i.status === "Verified").length;
    const totalFunded = campaigns.reduce((sum: number, c: any) => sum + (c.raisedAmount || 0), 0);
    const activeJobs = jobs.filter((j: any) => j.status !== "Verified").length;
    const completionRate = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : demoAnalytics.completionRate;

    return res.json({
      analytics: {
        totalReports,
        resolved,
        avgResponseHours: demoAnalytics.avgResponseHours,
        completionRate,
        totalFunded: totalFunded || demoAnalytics.totalFunded,
        activeJobs,
        categoryBreakdown: buildCategoryBreakdown(issues),
        areaHeat: buildAreaHeat(issues),
        monthly: buildMonthly(issues),
      },
      reports: issues.map(mapIssue),
    });
  } catch (err) {
    console.error("[ORG] getOrgDashboard:", err);
    return res.json({ analytics: demoAnalytics, reports: demoReports });
  }
}

// ------------------------------------------------------------- reports

export async function getOrgReports(req: Request, res: Response) {
  const { status = "all" } = req.query as any;
  try {
    if (!isMongoConnected()) {
      const filtered = status === "all" ? demoReports : demoReports.filter((r) => r.status === status);
      return res.json({ reports: filtered });
    }
    const query: any = {};
    if (status !== "all") query.reviewStatus = status;
    const issues = await IssueModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ reports: issues.length ? issues.map(mapIssue) : demoReports });
  } catch (err) {
    console.error("[ORG] getOrgReports:", err);
    return res.json({ reports: demoReports });
  }
}

export async function getOrgReportDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const mock = demoReports.find((r) => r.id === id);
      if (!mock) return res.status(404).json({ error: "Report not found." });
      return res.json({ report: mock });
    }
    const issue = await IssueModel.findOne({ id }).lean();
    if (!issue) return res.status(404).json({ error: "Report not found." });
    return res.json({ report: mapIssue(issue) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load report." });
  }
}

export async function verifyOrgReport(req: Request, res: Response) {
  const { id } = req.params;
  const { decision, note } = req.body || {};
  const verdict: "approved" | "rejected" = decision === "reject" ? "rejected" : "approved";

  try {
    if (!isMongoConnected()) {
      const mock = demoReports.find((r) => r.id === id);
      if (!mock) return res.status(404).json({ error: "Report not found." });
      return res.json({ report: { ...mock, status: verdict, municipalNote: note || mock.municipalNote } });
    }

    const issue = await IssueModel.findOne({ id });
    if (!issue) return res.status(404).json({ error: "Report not found." });

    issue.reviewStatus = verdict;
    issue.municipalNote = note || issue.municipalNote;
    if (verdict === "approved") issue.status = "Verified";
    await issue.save();

    return res.json({ report: mapIssue(issue.toObject()) });
  } catch (err) {
    console.error("[ORG] verifyOrgReport:", err);
    return res.status(500).json({ error: "Failed to update report." });
  }
}

// ----------------------------------------------------- push to marketplace

export async function publishOrgJob(req: Request, res: Response) {
  const { id } = req.params;
  const { payout, urgency } = req.body || {};

  const buildJob = (issue: any, jobId: string) => ({
    id: jobId,
    title: issue.title || "Civic repair job",
    category: issue.category || issue.issueType || "General",
    emoji: issue.emoji || "🔧",
    gradient: issue.gradient || DEFAULT_GRADIENT,
    area: issue.area || issue.location?.city || "—",
    location: locLabel(issue.location),
    payout: Number(payout) || issue.aiEstimate?.amount || 0,
    raised: 0,
    stage: "Open",
    bidsCount: 0,
    postedAt: "just now",
    dueDate: urgency === "High" ? "Aug 18" : urgency === "Medium" ? "Aug 22" : "Aug 30",
  });

  try {
    if (!isMongoConnected()) {
      const mock = demoReports.find((r) => r.id === id);
      if (!mock) return res.status(404).json({ error: "Report not found." });
      const job = buildJob(mock, `job_${Date.now()}`);
      await createFeedPost({
        type: "job",
        title: job.title,
        caption: `${job.category} work now open for contractor bids. Verified by ${demoOrganization.orgName}.`,
        category: job.category,
        emoji: job.emoji,
        gradient: job.gradient,
        authorId: "org_mumbai_001",
        authorName: demoOrganization.orgName,
        authorAvatar: "🏛️",
        authorRole: "organization",
        authorVerified: true,
        area: job.area,
        location: job.location,
        amount: job.payout,
        raisedAmount: 0,
        backers: 0,
        status: "Open for bids",
        urgency,
        hashtags: ["#Marketplace", "#OpenForBids", `#${job.category.replace(/\s+/g, "")}`],
        issueId: id,
        jobId: job.id,
      });
      return res.status(201).json({ job });
    }

    const issue = await IssueModel.findOne({ id });
    if (!issue) return res.status(404).json({ error: "Report not found." });

    const jobId = `job_${Date.now()}`;
    const job = new JobModel({
      id: jobId,
      campaignId: `cmp_${Date.now()}`,
      issueId: issue.id,
      title: issue.title || issue.description || "Civic repair job",
      description: issue.description || "",
      payout: Number(payout) || issue.aiEstimate?.amount || 0,
      currency: "INR",
      status: "Open",
      category: issue.category || issue.issueType || "General",
      emoji: issue.emoji || "🔧",
      gradient: issue.gradient || DEFAULT_GRADIENT,
      area: issue.area || issue.location?.city || "—",
      location: issue.location || {},
      raised: 0,
      bidsCount: 0,
      postedAt: "just now",
      dueDate: urgency === "High" ? "Aug 18" : urgency === "Medium" ? "Aug 22" : "Aug 30",
    });
    await job.save();

    issue.reviewStatus = "approved";
    await issue.save();

    const campaign = new CampaignModel({
      id: `cmp_${Date.now()}`,
      issueId: issue.id,
      title: `${issue.title || "Civic repair"} — ₹${job.payout.toLocaleString("en-IN")} target`,
      targetAmount: job.payout,
      raisedAmount: 0,
      currency: "INR",
      status: "Active",
      escrowState: "Holding",
    });
    await campaign.save();

    await createFeedPost({
      type: "job",
      title: job.title,
      caption: `${job.category} work now open for contractor bids. Verified by ${demoOrganization.orgName}.`,
      category: job.category,
      emoji: job.emoji,
      gradient: job.gradient,
      authorId: "org_mumbai_001",
      authorName: demoOrganization.orgName,
      authorAvatar: "🏛️",
      authorRole: "organization",
      authorVerified: true,
      area: job.area,
      location: typeof job.location === "string" ? job.location : `${issue.location?.city || ""}, ${issue.location?.state || ""}`.replace(/^,\s*/, "") || "India",
      amount: job.payout,
      raisedAmount: 0,
      backers: 0,
      status: "Open for bids",
      urgency,
      hashtags: ["#Marketplace", "#OpenForBids", `#${job.category.replace(/\s+/g, "")}`],
      issueId: issue.id,
      jobId: job.id,
      campaignId: campaign.id,
    });

    return res.status(201).json({ job: mapJob(job.toObject()) });
  } catch (err) {
    console.error("[ORG] publishOrgJob:", err);
    return res.status(500).json({ error: "Failed to publish job." });
  }
}

// ------------------------------------------------------------- jobs

export async function getOrgJobs(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ jobs: demoJobs });
    }
    const jobs = await JobModel.find().sort({ createdAt: -1 }).lean();
    return res.json({ jobs: jobs.length ? jobs.map(mapJob) : demoJobs });
  } catch (err) {
    console.error("[ORG] getOrgJobs:", err);
    return res.json({ jobs: demoJobs });
  }
}

export async function advanceOrgJob(req: Request, res: Response) {
  const { id } = req.params;
  const { stage } = req.body || {};

  const STAGE_ORDER = ["Open", "Claimed", "InProgress", "Submitted", "Verified"] as JobStage[];

  try {
    if (!isMongoConnected()) {
      const mock = demoJobs.find((j) => j.id === id);
      if (!mock) return res.status(404).json({ error: "Job not found." });
      const nextStage = stage || STAGE_ORDER[Math.min(STAGE_ORDER.indexOf(mock.stage) + 1, STAGE_ORDER.length - 1)];
      return res.json({ job: { ...mock, stage: nextStage } });
    }

    const job = await JobModel.findOne({ id });
    if (!job) return res.status(404).json({ error: "Job not found." });

    if (stage && STAGE_ORDER.includes(stage)) {
      job.status = stage;
    } else {
      const idx = STAGE_ORDER.indexOf(job.status);
      job.status = STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)];
    }
    await job.save();

    return res.json({ job: mapJob(job.toObject()) });
  } catch (err) {
    console.error("[ORG] advanceOrgJob:", err);
    return res.status(500).json({ error: "Failed to advance job." });
  }
}

// ------------------------------------------------------------- disputes

export async function getOrgDisputes(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ disputes: demoDisputes });
    }
    const disputes = await DisputeModel.find().sort({ createdAt: -1 }).lean();
    return res.json({ disputes: disputes.length ? disputes.map(mapDispute) : demoDisputes });
  } catch (err) {
    console.error("[ORG] getOrgDisputes:", err);
    return res.json({ disputes: demoDisputes });
  }
}

export async function resolveOrgDispute(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const mock = demoDisputes.find((d) => d.id === id);
      if (!mock) return res.status(404).json({ error: "Dispute not found." });
      return res.json({ dispute: { ...mock, status: "resolved" } });
    }
    const dispute = await DisputeModel.findOne({ id });
    if (!dispute) return res.status(404).json({ error: "Dispute not found." });
    dispute.status = "resolved";
    await dispute.save();
    return res.json({ dispute: mapDispute(dispute.toObject()) });
  } catch (err) {
    console.error("[ORG] resolveOrgDispute:", err);
    return res.status(500).json({ error: "Failed to resolve dispute." });
  }
}

// ------------------------------------------------------------- workers

export async function getOrgWorkers(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ workers: demoWorkers });
    }
    const users = await UserModel.find({ role: "worker" }).lean();
    return res.json({ workers: users.length ? users.map(mapUser) : demoWorkers });
  } catch (err) {
    console.error("[ORG] getOrgWorkers:", err);
    return res.json({ workers: demoWorkers });
  }
}

export async function setWorkerStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body || {};
  try {
    if (!isMongoConnected()) {
      const mock = demoWorkers.find((w) => w.id === id);
      if (!mock) return res.status(404).json({ error: "Worker not found." });
      return res.json({ worker: { ...mock, status: status || "available" } });
    }
    const worker = await UserModel.findOne({ id });
    if (!worker) return res.status(404).json({ error: "Worker not found." });
    worker.workerStatus = status || "available";
    await worker.save();
    return res.json({ worker: mapUser(worker.toObject()) });
  } catch (err) {
    console.error("[ORG] setWorkerStatus:", err);
    return res.status(500).json({ error: "Failed to update worker." });
  }
}

export async function setWorkerVerified(req: Request, res: Response) {
  const { id } = req.params;
  const { verified } = req.body || {};
  try {
    if (!isMongoConnected()) {
      const mock = demoWorkers.find((w) => w.id === id);
      if (!mock) return res.status(404).json({ error: "Worker not found." });
      return res.json({ worker: { ...mock, verified: !!verified } });
    }
    const worker = await UserModel.findOne({ id });
    if (!worker) return res.status(404).json({ error: "Worker not found." });
    worker.workerVerified = !!verified;
    await worker.save();
    return res.json({ worker: mapUser(worker.toObject()) });
  } catch (err) {
    console.error("[ORG] setWorkerVerified:", err);
    return res.status(500).json({ error: "Failed to update worker." });
  }
}

// ------------------------------------------------------------- analytics

export async function getOrgAnalytics(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ analytics: demoAnalytics });
    }
    const [issues, campaigns, jobs] = await Promise.all([
      IssueModel.find().lean(),
      CampaignModel.find().lean(),
      JobModel.find().lean(),
    ]);

    const totalReports = issues.length || demoAnalytics.totalReports;
    const resolved = issues.filter((i: any) => i.reviewStatus === "approved" || i.status === "Verified").length;
    const totalFunded = campaigns.reduce((sum: number, c: any) => sum + (c.raisedAmount || 0), 0);
    const activeJobs = jobs.filter((j: any) => j.status !== "Verified").length;
    const completionRate = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : demoAnalytics.completionRate;

    return res.json({
      analytics: {
        totalReports,
        resolved,
        avgResponseHours: demoAnalytics.avgResponseHours,
        completionRate,
        totalFunded: totalFunded || demoAnalytics.totalFunded,
        activeJobs,
        categoryBreakdown: buildCategoryBreakdown(issues),
        areaHeat: buildAreaHeat(issues),
        monthly: buildMonthly(issues),
      },
    });
  } catch (err) {
    console.error("[ORG] getOrgAnalytics:", err);
    return res.json({ analytics: demoAnalytics });
  }
}

function buildCategoryBreakdown(issues: any[]): { category: string; count: number; emoji: string }[] {
  if (!issues.length) return demoAnalytics.categoryBreakdown;
  const map = new Map<string, { count: number; emoji: string }>();
  for (const i of issues) {
    const category = i.category || i.issueType || "General";
    const emoji = i.emoji || "📌";
    const entry = map.get(category) || { count: 0, emoji };
    entry.count += 1;
    map.set(category, entry);
  }
  return Array.from(map.entries())
    .map(([category, { count, emoji }]) => ({ category, count, emoji }))
    .sort((a, b) => b.count - a.count);
}

function buildAreaHeat(issues: any[]): { area: string; count: number }[] {
  if (!issues.length) return demoAnalytics.areaHeat;
  const map = new Map<string, number>();
  for (const i of issues) {
    const area = i.area || i.location?.city || "Other";
    map.set(area, (map.get(area) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function buildMonthly(issues: any[]): { month: string; reports: number; resolved: number }[] {
  if (!issues.length) return demoAnalytics.monthly;
  const months = ["May", "Jun", "Jul", "Aug"];
  const buckets = new Map<string, { reports: number; resolved: number }>();
  for (const m of months) buckets.set(m, { reports: 0, resolved: 0 });

  const now = new Date();
  for (const i of issues) {
    const d = new Date(i.createdAt || Date.now());
    const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    const idx = 3 + diffMonths;
    const m = months[idx] || "Aug";
    const bucket = buckets.get(m) || { reports: 0, resolved: 0 };
    bucket.reports += 1;
    if (i.reviewStatus === "approved" || i.status === "Verified") bucket.resolved += 1;
    buckets.set(m, bucket);
  }
  return months.map((month) => ({ month, ...(buckets.get(month) || { reports: 0, resolved: 0 }) }));
}

// ------------------------------------------------------------- team

export async function getOrgTeam(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ team: demoTeam });
    }
    const org = await OrganizationModel.findOne().sort({ createdAt: -1 }).lean();
    return res.json({ team: org?.team?.length ? org.team.map(mapTeamMember) : demoTeam });
  } catch (err) {
    console.error("[ORG] getOrgTeam:", err);
    return res.json({ team: demoTeam });
  }
}

export async function addOrgTeamMember(req: Request, res: Response) {
  const { name, email, level } = req.body || {};
  const member = {
    id: `tm_${Date.now()}`,
    name: name || "New Member",
    email: email || "",
    level: level || "Viewer",
    avatar: initials(name || "NM"),
    lastActive: "just added",
  };
  try {
    if (!isMongoConnected()) {
      return res.status(201).json({ team: [...demoTeam, member] });
    }
    const org = await OrganizationModel.findOne().sort({ createdAt: -1 });
    if (org) {
      org.team.push(member);
      await org.save();
      return res.status(201).json({ team: org.team.map(mapTeamMember) });
    }
    return res.status(201).json({ team: [member] });
  } catch (err) {
    console.error("[ORG] addOrgTeamMember:", err);
    return res.status(500).json({ error: "Failed to add team member." });
  }
}

export async function updateOrgTeamMember(req: Request, res: Response) {
  const { id } = req.params;
  const { level } = req.body || {};
  const updateLevel = (team: any[]) => team.map((m) => (m.id === id ? { ...m, level: level || m.level } : m));
  try {
    if (!isMongoConnected()) {
      return res.json({ team: updateLevel(demoTeam) });
    }
    const org = await OrganizationModel.findOne().sort({ createdAt: -1 });
    if (!org) return res.status(404).json({ error: "Organization not found." });
    org.team = updateLevel(org.team);
    await org.save();
    return res.json({ team: org.team.map(mapTeamMember) });
  } catch (err) {
    console.error("[ORG] updateOrgTeamMember:", err);
    return res.status(500).json({ error: "Failed to update team member." });
  }
}

// ------------------------------------------------------------- settings

export async function getOrgSettings(_req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ settings: mapOrgSettings(demoOrganization) });
    }
    const org = await OrganizationModel.findOne().sort({ createdAt: -1 }).lean();
    return res.json({ settings: mapOrgSettings(org || demoOrganization) });
  } catch (err) {
    console.error("[ORG] getOrgSettings:", err);
    return res.json({ settings: mapOrgSettings(demoOrganization) });
  }
}

export async function updateOrgSettings(req: Request, res: Response) {
  const patch = req.body || {};
  try {
    if (!isMongoConnected()) {
      return res.json({ settings: { ...mapOrgSettings(demoOrganization), ...patch } });
    }
    let org = await OrganizationModel.findOne().sort({ createdAt: -1 });
    if (!org) {
      org = new OrganizationModel({ ...demoOrganization, ...patch });
    } else {
      Object.assign(org, patch);
    }
    await org.save();
    return res.json({ settings: mapOrgSettings(org.toObject()) });
  } catch (err) {
    console.error("[ORG] updateOrgSettings:", err);
    return res.status(500).json({ error: "Failed to update settings." });
  }
}
