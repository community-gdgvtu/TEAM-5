/**
 * 🔵 Organization mock data — rich, live-feeling content for the Org role demo.
 * Includes a "dynamic feature detection" pipeline: each report carries AI-detected
 * site features that populate the estimate live on the verification screen.
 */

export const C = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export type ReportStatus = "pending" | "approved" | "rejected";
export type JobStage = "Open" | "Claimed" | "InProgress" | "Submitted" | "Verified";

export interface AiFeature {
  label: string;
  confidence: number;
}

export interface OrgReport {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  area: string;
  location: string;
  citizenName: string;
  citizenAvatar: string;
  submittedAt: string;
  aiEstimate: number;
  aiConfidence: number;
  aiFeatures: AiFeature[];
  status: ReportStatus;
  urgency: "High" | "Medium" | "Low";
  municipalNote?: string;
  /** AI pre-screening verdict surfaced on the verify screen. */
  aiPrescreen?: {
    is_valid: boolean;
    is_duplicate: boolean;
    flag_reason: string | null;
  };
}

const reports: OrgReport[] = [
  {
    id: "rep_001",
    title: "Deep pothole on 100ft Road, Andheri",
    category: "Road",
    emoji: "🕳️",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    area: "Andheri West",
    location: "Mumbai, Maharashtra",
    citizenName: "Priya M.",
    citizenAvatar: "🧕",
    submittedAt: "12 min ago",
    aiEstimate: 85000,
    aiConfidence: 0.94,
    aiFeatures: [
      { label: "Asphalt pothole (0.9 m dia)", confidence: 0.96 },
      { label: "Surface crack network", confidence: 0.89 },
      { label: "High-traffic lane", confidence: 0.91 },
      { label: "Drainage nearby", confidence: 0.78 },
    ],
    status: "pending",
    urgency: "High",
  },
  {
    id: "rep_002",
    title: "Streetlight cluster dead — Sector 17",
    category: "Streetlight",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    area: "Sector 17",
    location: "Chandigarh, Punjab",
    citizenName: "Simran D.",
    citizenAvatar: "👧",
    submittedAt: "1h ago",
    aiEstimate: 38000,
    aiConfidence: 0.89,
    aiFeatures: [
      { label: "8 non-functional fixtures", confidence: 0.93 },
      { label: "Exposed wiring junction", confidence: 0.82 },
      { label: "Pedestrian zone", confidence: 0.95 },
    ],
    status: "pending",
    urgency: "High",
  },
  {
    id: "rep_003",
    title: "Blocked storm drain — Koramangala",
    category: "Drainage",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    area: "Koramangala",
    location: "Bengaluru, Karnataka",
    citizenName: "Anita K.",
    citizenAvatar: "👩",
    submittedAt: "3h ago",
    aiEstimate: 54000,
    aiConfidence: 0.91,
    aiFeatures: [
      { label: "Silt / debris blockage", confidence: 0.94 },
      { label: "Waterlogging risk", confidence: 0.97 },
      { label: "Garbage accumulation", confidence: 0.85 },
    ],
    status: "pending",
    urgency: "High",
  },
  {
    id: "rep_004",
    title: "Broken footbridge railing near school",
    category: "Safety",
    emoji: "🌉",
    gradient: "linear-gradient(135deg,#e11d48,#be123c)",
    area: "Salt Lake",
    location: "Kolkata, West Bengal",
    citizenName: "Debajyoti R.",
    citizenAvatar: "🧔",
    submittedAt: "5h ago",
    aiEstimate: 33000,
    aiConfidence: 0.95,
    aiFeatures: [
      { label: "Rusted railing gaps", confidence: 0.95 },
      { label: "Sharp exposed edges", confidence: 0.88 },
      { label: "School-zone proximity", confidence: 0.96 },
    ],
    status: "pending",
    urgency: "High",
  },
  {
    id: "rep_005",
    title: "Park garden turning barren",
    category: "Green",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    area: "Koregaon Park",
    location: "Pune, Maharashtra",
    citizenName: "Meera P.",
    citizenAvatar: "🧓",
    submittedAt: "8h ago",
    aiEstimate: 72000,
    aiConfidence: 0.86,
    aiFeatures: [
      { label: "Dead lawn coverage 70%", confidence: 0.9 },
      { label: "Bare soil erosion", confidence: 0.83 },
      { label: "Broken play equipment", confidence: 0.77 },
    ],
    status: "pending",
    urgency: "Low",
  },
  {
    id: "rep_006",
    title: "Public toilet unusable — IT corridor",
    category: "Sanitation",
    emoji: "🚻",
    gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
    area: "Gachibowli",
    location: "Hyderabad, Telangana",
    citizenName: "Ravi T.",
    citizenAvatar: "🧑",
    submittedAt: "11h ago",
    aiEstimate: 41000,
    aiConfidence: 0.88,
    aiFeatures: [
      { label: "Sanitary fixture damage", confidence: 0.84 },
      { label: "Unhygienic condition", confidence: 0.92 },
      { label: "High footfall area", confidence: 0.9 },
    ],
    status: "pending",
    urgency: "Medium",
  },
];

export function getReports(): Promise<OrgReport[]> {
  return delay(reports);
}

export function getReport(id: string): Promise<OrgReport | undefined> {
  return delay(reports.find((r) => r.id === id));
}

export interface OrgJob {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  area: string;
  location: string;
  payout: number;
  raised: number;
  stage: JobStage;
  worker?: string;
  workerRating?: number;
  bidsCount: number;
  postedAt: string;
  dueDate?: string;
}

const jobs: OrgJob[] = [
  {
    id: "job_001",
    title: "Andheri Flyover Pothole Emergency Resurfacing",
    category: "Road",
    emoji: "🕳️",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    area: "Andheri West",
    location: "Mumbai, Maharashtra",
    payout: 85000,
    raised: 61200,
    stage: "Open",
    bidsCount: 3,
    postedAt: "2h ago",
    dueDate: "Aug 18",
  },
  {
    id: "job_002",
    title: "Sector 17 Streetlight LED Grid Replacement",
    category: "Streetlight",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    area: "Sector 17",
    location: "Chandigarh, Punjab",
    payout: 38000,
    raised: 21900,
    stage: "Open",
    bidsCount: 2,
    postedAt: "5h ago",
    dueDate: "Aug 20",
  },
  {
    id: "job_003",
    title: "Koregaon Park Garden Replanting Drive",
    category: "Green",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    area: "Koregaon Park",
    location: "Pune, Maharashtra",
    payout: 72000,
    raised: 48000,
    stage: "Claimed",
    worker: "Green Roots Nursery",
    workerRating: 4.5,
    bidsCount: 5,
    postedAt: "1d ago",
    dueDate: "Aug 24",
  },
  {
    id: "job_004",
    title: "T. Nagar Footpath Accessibility Ramp Build",
    category: "Accessibility",
    emoji: "♿",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    area: "T. Nagar",
    location: "Chennai, Tamil Nadu",
    payout: 46000,
    raised: 46000,
    stage: "Claimed",
    worker: "Southern Civic Builders",
    workerRating: 4.9,
    bidsCount: 4,
    postedAt: "2d ago",
    dueDate: "Aug 21",
  },
  {
    id: "job_005",
    title: "Salt Lake Bridge Railing Welding",
    category: "Safety",
    emoji: "🌉",
    gradient: "linear-gradient(135deg,#e11d48,#be123c)",
    area: "Salt Lake",
    location: "Kolkata, West Bengal",
    payout: 33000,
    raised: 33000,
    stage: "InProgress",
    worker: "Eastern Metal Works",
    workerRating: 4.8,
    bidsCount: 6,
    postedAt: "3d ago",
    dueDate: "Aug 19",
  },
  {
    id: "job_006",
    title: "Koramangala Block 4 Drain Clearing",
    category: "Drainage",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    area: "Koramangala",
    location: "Bengaluru, Karnataka",
    payout: 54000,
    raised: 54000,
    stage: "Submitted",
    worker: "Rahul Deshmukh",
    workerRating: 4.9,
    bidsCount: 6,
    postedAt: "1d ago",
    dueDate: "Aug 17",
  },
  {
    id: "job_007",
    title: "Public Toilet Sanitation Drive — Gachibowli",
    category: "Sanitation",
    emoji: "🚻",
    gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
    area: "Gachibowli",
    location: "Hyderabad, Telangana",
    payout: 41000,
    raised: 41000,
    stage: "Verified",
    worker: "Sahas Sanitation",
    workerRating: 4.6,
    bidsCount: 3,
    postedAt: "5d ago",
  },
];

export function getJobs(): Promise<OrgJob[]> {
  return delay(jobs);
}

export interface Dispute {
  id: string;
  jobTitle: string;
  emoji: string;
  gradient: string;
  type: "Bad work quality" | "Wrong worker" | "Funding issue" | "Verification fail";
  severity: "High" | "Medium" | "Low";
  raisedBy: string;
  raisedAt: string;
  summary: string;
  worker: string;
  status: "open" | "resolved";
}

const disputes: Dispute[] = [
  {
    id: "dsp_001",
    jobTitle: "Koregaon Park Garden Replanting Drive",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    type: "Bad work quality",
    severity: "Medium",
    raisedBy: "Citizen Meera P.",
    raisedAt: "1h ago",
    summary: "Citizen reports 12 saplings planted upside-down and the lawn patch uneven after handover.",
    worker: "Green Roots Nursery",
    status: "open",
  },
  {
    id: "dsp_002",
    jobTitle: "Sector 17 Streetlight LED Grid Replacement",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    type: "Verification fail",
    severity: "High",
    raisedBy: "AI Verification Bot",
    raisedAt: "4h ago",
    summary: "Before/after photo match scored 42%. Worker uploaded a photo from a different street.",
    worker: "Northern Electricals",
    status: "open",
  },
  {
    id: "dsp_003",
    jobTitle: "Salt Lake Bridge Railing Welding",
    emoji: "🌉",
    gradient: "linear-gradient(135deg,#e11d48,#be123c)",
    type: "Wrong worker",
    severity: "Low",
    raisedBy: "Org field officer",
    raisedAt: "1d ago",
    summary: "Claimed by Eastern Metal Works but sublet to an unlisted crew. Verified after inspection.",
    worker: "Eastern Metal Works",
    status: "resolved",
  },
];

export function getDisputes(): Promise<Dispute[]> {
  return delay(disputes);
}

export interface OrgWorker {
  id: string;
  name: string;
  skill: string;
  avatar: string;
  rating: number;
  jobsDone: number;
  verified: boolean;
  license: string;
  status: "available" | "on-job" | "suspended";
  location: string;
}

const directory: OrgWorker[] = [
  { id: "w_001", name: "Rahul Deshmukh", skill: "Sanitation & Drainage", avatar: "RD", rating: 4.9, jobsDone: 137, verified: true, license: "TR-5582910", status: "available", location: "Bengaluru" },
  { id: "w_002", name: "Green Roots Nursery", skill: "Park Maintenance & Horticulture", avatar: "GR", rating: 4.5, jobsDone: 33, verified: false, license: "TR-991203", status: "on-job", location: "Pune" },
  { id: "w_003", name: "Eastern Metal Works", skill: "General Civil Works", avatar: "EM", rating: 4.8, jobsDone: 58, verified: true, license: "TR-451778", status: "on-job", location: "Kolkata" },
  { id: "w_004", name: "Northern Electricals", skill: "Electrical & Streetlight Fixes", avatar: "NE", rating: 4.7, jobsDone: 51, verified: true, license: "TR-309455", status: "suspended", location: "Chandigarh" },
  { id: "w_005", name: "Sahas Sanitation", skill: "Sanitation & Drainage", avatar: "SS", rating: 4.6, jobsDone: 44, verified: true, license: "TR-227180", status: "available", location: "Hyderabad" },
  { id: "w_006", name: "Southern Civic Builders", skill: "General Civil Works", avatar: "SC", rating: 4.9, jobsDone: 72, verified: true, license: "TR-871554", status: "available", location: "Chennai" },
];

export function getWorkers(): Promise<OrgWorker[]> {
  return delay(directory);
}

export interface OrgTeamMember {
  id: string;
  name: string;
  email: string;
  level: "Admin" | "Verifier" | "Field Officer" | "Viewer";
  avatar: string;
  lastActive: string;
}

const team: OrgTeamMember[] = [
  { id: "tm_001", name: "Priya Sharma", email: "priya@municipal.gov", level: "Admin", avatar: "PS", lastActive: "now" },
  { id: "tm_002", name: "Arjun Nair", email: "arjun@municipal.gov", level: "Verifier", avatar: "AN", lastActive: "12 min ago" },
  { id: "tm_003", name: "Lakshmi Rao", email: "lakshmi@municipal.gov", level: "Field Officer", avatar: "LR", lastActive: "1h ago" },
  { id: "tm_004", name: "Imran Khan", email: "imran@municipal.gov", level: "Viewer", avatar: "IK", lastActive: "3h ago" },
];

export function getTeam(): Promise<OrgTeamMember[]> {
  return delay(team);
}

export interface OrgAnalytics {
  totalReports: number;
  resolved: number;
  avgResponseHours: number;
  completionRate: number;
  totalFunded: number;
  activeJobs: number;
  categoryBreakdown: { category: string; count: number; emoji: string }[];
  areaHeat: { area: string; count: number }[];
  monthly: { month: string; reports: number; resolved: number }[];
}

export const analytics: OrgAnalytics = {
  totalReports: 1284,
  resolved: 1103,
  avgResponseHours: 3.4,
  completionRate: 86,
  totalFunded: 4820000,
  activeJobs: 34,
  categoryBreakdown: [
    { category: "Road", count: 512, emoji: "🕳️" },
    { category: "Drainage", count: 322, emoji: "💧" },
    { category: "Streetlight", count: 264, emoji: "💡" },
    { category: "Sanitation", count: 98, emoji: "🚻" },
    { category: "Green", count: 88, emoji: "🌳" },
  ],
  areaHeat: [
    { area: "Andheri", count: 210 },
    { area: "Koramangala", count: 174 },
    { area: "Sector 17", count: 132 },
    { area: "Salt Lake", count: 96 },
    { area: "Gachibowli", count: 71 },
    { area: "T. Nagar", count: 54 },
  ],
  monthly: [
    { month: "May", reports: 210, resolved: 160 },
    { month: "Jun", reports: 280, resolved: 224 },
    { month: "Jul", reports: 320, resolved: 276 },
    { month: "Aug", reports: 380, resolved: 334 },
  ],
};

export function getAnalytics(): Promise<OrgAnalytics> {
  return delay(analytics);
}

export const orgSettings = {
  orgName: "Brihanmumbai Municipal Corporation",
  orgType: "Municipal Corporation",
  regId: "MC-MUM-2026-99",
  jurisdiction: "Mumbai, Maharashtra",
  email: "operations@municipal.gov",
  phone: "+91 22 2262 0000",
  notifNewReport: true,
  notifAiFlag: true,
  notifEscrow: true,
  notifDispute: true,
  notifEmailDigest: false,
  autoApproveLowUrgency: false,
};

export function getOrgSettings(): Promise<typeof orgSettings> {
  return delay(orgSettings);
}

/** Simulated live report stream — lets the queue feel "dynamic". */
const LIVE_POOL: OrgReport[] = [
  {
    id: `rep_live_${Date.now()}`,
    title: "New pothole reported on MG Road junction",
    category: "Road",
    emoji: "🕳️",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    area: "MG Road",
    location: "Mumbai, Maharashtra",
    citizenName: "Kavya R.",
    citizenAvatar: "👩‍🦰",
    submittedAt: "just now",
    aiEstimate: 29000,
    aiConfidence: 0.9,
    aiFeatures: [
      { label: "Asphalt pothole (0.5 m dia)", confidence: 0.92 },
      { label: "Curb damage", confidence: 0.8 },
    ],
    status: "pending",
    urgency: "Medium",
  },
  {
    id: `rep_live2_${Date.now()}`,
    title: "Leaking water main on 4th Cross",
    category: "Drainage",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    area: "4th Cross",
    location: "Bengaluru, Karnataka",
    citizenName: "Rohit S.",
    citizenAvatar: "🧑",
    submittedAt: "just now",
    aiEstimate: 12000,
    aiConfidence: 0.87,
    aiFeatures: [
      { label: "Water leakage", confidence: 0.9 },
      { label: "Surface erosion", confidence: 0.78 },
    ],
    status: "pending",
    urgency: "High",
  },
];

export function getLiveReport(): Promise<OrgReport> {
  const item = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
  return delay({ ...item, id: item.id.replace(/\d+$/, String(Date.now())) });
}

const delay = <T,>(v: T): Promise<T> => new Promise((res) => setTimeout(() => res(v), 350));
