import { IssueModel } from "../models/Issue.model";
import { JobModel } from "../models/Job.model";
import { CampaignModel } from "../models/Campaign.model";
import { BidModel } from "../models/Bid.model";
import { PostModel } from "../models/Post.model";
import { ThreadModel } from "../models/Message.model";
import { UserModel } from "../models/User.model";
import { DisputeModel } from "../models/Dispute.model";
import { OrganizationModel } from "../models/Organization.model";
import { buildDemoPosts } from "../services/feed.service";
import { buildDemoThreads } from "../services/messages.service";
import {
  demoReports,
  demoJobs,
  demoDisputes,
  demoWorkers,
  demoOrganization,
  demoCampaigns,
  demoBids,
} from "./demoData";

/**
 * 🟢🟠🟣 Seeds the demo data for all roles into MongoDB.
 * Idempotent — only inserts into collections that are empty, so a running
 * civic-fix database keeps its own state. Called once after a successful
 * MongoDB connection in db.ts.
 */

const C = "INR";

/** Splits a "City, State" string into its parts (demo data uses both). */
function splitLocation(loc: string): { city: string; state: string } {
  const [city = loc, ...rest] = String(loc || "").split(",");
  const state = rest.join(",").trim() || CITY_STATE[city.trim().toLowerCase()] || "Maharashtra";
  return { city: city.trim(), state };
}

/** Demo worker entries only list city names — resolve the state here. */
const CITY_STATE: Record<string, string> = {
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  kolkata: "West Bengal",
  chandigarh: "Chandigarh",
  hyderabad: "Telangana",
  chennai: "Tamil Nadu",
  indore: "Madhya Pradesh",
};

async function seedIssues() {
  const count = await IssueModel.countDocuments();
  if (count > 0) return;
  await IssueModel.insertMany(
    demoReports.map((r, i) => ({
      id: r.id,
      reporterId: `citizen_${i + 1}`,
      issueType: r.issueType || r.category.toLowerCase(),
      description: r.description || r.title,
      location: { city: splitLocation(r.area).city, state: splitLocation(r.area).state, country: "India" },
      aiEstimate: {
        amount: r.aiEstimate,
        currency: C,
        severity: r.urgency === "High" ? "Critical" : r.urgency === "Medium" ? "Moderate" : "Minor",
        confidence: r.aiConfidence,
        summary: `AI estimate for ${r.category}: approx ₹${r.aiEstimate.toLocaleString("en-IN")}.`,
      },
      status: "Reported",
      title: r.title,
      category: r.category,
      emoji: r.emoji,
      gradient: r.gradient,
      area: r.area,
      citizenName: r.citizenName,
      citizenAvatar: r.citizenAvatar,
      urgency: r.urgency,
      aiFeatures: r.aiFeatures,
      reviewStatus: r.status,
      municipalNote: r.municipalNote || "",
      submittedAt: r.submittedAt,
      createdAt: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
    }))
  );
}

async function seedJobs() {
  const count = await JobModel.countDocuments();
  if (count > 0) return;
  await JobModel.insertMany(
    demoJobs.map((j, i) => ({
      id: j.id,
      campaignId: `cmp_${j.id.replace("job_", "")}`,
      issueId: `rep_${j.id.replace("job_", "")}`,
      title: j.title,
      description: j.description || j.title,
      payout: j.payout,
      currency: C,
      status: j.stage,
      category: j.category,
      emoji: j.emoji,
      gradient: j.gradient,
      area: j.area,
      location: { city: splitLocation(j.area).city, state: splitLocation(j.area).state, country: "India" },
      workerName: j.worker,
      workerRating: j.workerRating,
      raised: j.raised,
      bidsCount: j.bidsCount,
      postedAt: j.postedAt,
      dueDate: j.dueDate,
      createdAt: new Date(Date.now() - (i + 1) * 86400 * 1000).toISOString(),
    }))
  );
}

async function seedCampaigns() {
  const count = await CampaignModel.countDocuments();
  if (count > 0) return;
  await CampaignModel.insertMany(
    demoCampaigns.map((c) => ({
      id: c.id,
      issueId: c.id.replace("cmp_", "rep_"),
      title: c.title,
      targetAmount: c.targetAmount,
      raisedAmount: c.raisedAmount,
      currency: c.currency,
      status: c.status === "Funding" ? "Active" : c.status === "Completed" ? "Completed" : "Funded",
      escrowState: c.payout ? "Released" : "Holding",
      category: c.category,
      emoji: c.emoji,
      gradient: c.gradient,
      org: c.org,
      orgVerified: c.orgVerified,
      location: c.location,
      area: c.area,
      description: c.description,
      backers: c.backers,
      likes: c.likes,
      shares: c.shares,
      comments: c.comments,
      aiConfidence: c.aiConfidence,
      workerRating: c.workerRating,
      impactScore: c.impactScore,
      workerBids: c.workerBids,
      hashtags: c.hashtags,
      beforeAfter: c.beforeAfter,
      payout: c.payout,
      impactSummary: c.impactSummary,
      createdAt: c.createdAt,
    }))
  );
}

async function seedBids() {
  const count = await BidModel.countDocuments();
  if (count > 0) return;
  await BidModel.insertMany(
    demoBids.map((b, i) => ({
      id: b.id,
      jobId: b.jobId,
      workerId: `worker_${i + 1}`,
      amount: b.quoted,
      timeline: `${b.timelineDays} days`,
      message: b.message,
      status: b.status === "awarded" ? "Awarded" : b.status === "rejected" ? "Rejected" : "Pending",
      createdAt: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
    }))
  );
}

async function seedWorkers() {
  const count = await UserModel.countDocuments({ role: "worker" });
  if (count > 0) return;
  await UserModel.insertMany(
    demoWorkers.map((w, i) => ({
      id: w.id,
      name: w.name,
      mobile: w.mobile || `9876${String(50000 + i).padStart(5, "0")}`,
      countryCode: "+91",
      email: w.email || `worker${i + 1}@contractor.in`,
      age: 30 + i,
      location: { city: splitLocation(w.location).city, state: splitLocation(w.location).state, country: "India" },
      role: "worker",
      supplementaryData: {
        workerSkillCategory: w.skill,
        workerLicenseId: w.license,
      },
      verifiedWhatsApp: true,
      verifiedAt: new Date().toISOString(),
      workerStatus: w.status,
      workerRating: w.rating,
      workerJobsDone: w.jobsDone,
      workerVerified: w.verified,
      createdAt: new Date(Date.now() - (i + 1) * 86400 * 1000).toISOString(),
    }))
  );
}

async function seedDisputes() {
  const count = await DisputeModel.countDocuments();
  if (count > 0) return;
  await DisputeModel.insertMany(
    demoDisputes.map((d) => ({
      id: d.id,
      jobId: d.jobId || "",
      jobTitle: d.jobTitle,
      emoji: d.emoji,
      gradient: d.gradient,
      type: d.type,
      severity: d.severity,
      raisedBy: d.raisedBy,
      raisedAt: d.raisedAt,
      summary: d.summary,
      worker: d.worker,
      status: d.status,
    }))
  );
}

async function seedPosts() {
  const count = await PostModel.countDocuments();
  if (count > 0) return;
  await PostModel.insertMany(buildDemoPosts());
}

async function seedThreads() {
  const all = [
    ...buildDemoThreads("citizen"),
    ...buildDemoThreads("worker"),
    ...buildDemoThreads("organization"),
    ...buildDemoThreads("investor"),
  ];
  const existing = new Set((await ThreadModel.find({}, { id: 1 }).lean()).map((t) => t.id));
  const missing = all.filter((t) => !existing.has(t.id));
  if (missing.length) await ThreadModel.insertMany(missing);
}

async function seedOrganization() {
  const count = await OrganizationModel.countDocuments();
  if (count > 0) return;
  await OrganizationModel.create(demoOrganization);
}

export async function seedDatabase() {
  try {
    await seedIssues();
    await seedJobs();
    await seedCampaigns();
    await seedBids();
    await seedWorkers();
    await seedDisputes();
    await seedOrganization();
    await seedPosts();
    await seedThreads();
    console.log("🌱 MongoDB seeded with demo data (citizen · org · worker · investor · feed · messages)");
  } catch (err) {
    console.warn("⚠️ Seed skipped:", (err as Error).message);
  }
}
