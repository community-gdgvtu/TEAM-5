/**
 * 🔵 Demo seed data for the Organization role.
 *
 * This file holds the same rich demo content the frontend mocks use, so the
 * MongoDB seed and the offline fallback both render a lively municipal
 * dashboard. Shapes mirror `src/data/orgMock.ts`.
 */

export interface DemoAiFeature {
  label: string;
  confidence: number;
}

export interface DemoReport {
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
  aiFeatures: DemoAiFeature[];
  status: "pending" | "approved" | "rejected";
  urgency: "High" | "Medium" | "Low";
  municipalNote?: string;
  description?: string;
  issueType?: string;
}

export const demoReports: DemoReport[] = [
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
    description: "Deep pothole causing vehicle damage on 100ft Road.",
    issueType: "pothole",
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
    description: "Entire streetlight cluster is dead at Sector 17.",
    issueType: "streetlight",
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
    description: "Storm drain fully blocked, waterlogging during rain.",
    issueType: "drainage",
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
    description: "Footbridge railing broken near the school gate.",
    issueType: "safety",
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
    description: "Park lawn and play equipment need restoration.",
    issueType: "cleaning",
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
    description: "Public toilet out of service along the IT corridor.",
    issueType: "cleaning",
  },
];

export type DemoJobStage = "Open" | "Claimed" | "InProgress" | "Submitted" | "Verified";

export interface DemoJob {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  area: string;
  location: string;
  payout: number;
  raised: number;
  stage: DemoJobStage;
  worker?: string;
  workerRating?: number;
  bidsCount: number;
  postedAt: string;
  dueDate?: string;
  description?: string;
}

export const demoJobs: DemoJob[] = [
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
    description: "Emergency resurfacing of pothole cluster on the flyover.",
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
    description: "Replace dead LED fixtures across the cluster.",
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
    description: "Replant lawns and repair play equipment.",
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
    description: "Accessibility ramp at T. Nagar footpath junction.",
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
    description: "Weld and reinforce broken bridge railing.",
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
    description: "Clearing blocked storm drains in Block 4.",
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
    description: "Sanitation and fixture repair drive.",
  },
];

export interface DemoDispute {
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
  jobId?: string;
}

export const demoDisputes: DemoDispute[] = [
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
    jobId: "job_003",
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
    jobId: "job_002",
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
    jobId: "job_005",
  },
];

export interface DemoWorker {
  id: string;
  name: string;
  skill: string;
  rating: number;
  jobsDone: number;
  verified: boolean;
  license: string;
  status: "available" | "on-job" | "suspended";
  location: string;
  mobile?: string;
  email?: string;
}

export const demoWorkers: DemoWorker[] = [
  { id: "w_001", name: "Rahul Deshmukh", skill: "Sanitation & Drainage", rating: 4.9, jobsDone: 137, verified: true, license: "TR-5582910", status: "available", location: "Bengaluru", mobile: "9811223344", email: "rahul.works@contractor.in" },
  { id: "w_002", name: "Green Roots Nursery", skill: "Park Maintenance & Horticulture", rating: 4.5, jobsDone: 33, verified: false, license: "TR-991203", status: "on-job", location: "Pune", mobile: "9811223345", email: "greenroots@nursery.in" },
  { id: "w_003", name: "Eastern Metal Works", skill: "General Civil Works", rating: 4.8, jobsDone: 58, verified: true, license: "TR-451778", status: "on-job", location: "Kolkata", mobile: "9811223346", email: "eastern.metal@works.in" },
  { id: "w_004", name: "Northern Electricals", skill: "Electrical & Streetlight Fixes", rating: 4.7, jobsDone: 51, verified: true, license: "TR-309455", status: "suspended", location: "Chandigarh", mobile: "9811223347", email: "northern.elec@works.in" },
  { id: "w_005", name: "Sahas Sanitation", skill: "Sanitation & Drainage", rating: 4.6, jobsDone: 44, verified: true, license: "TR-227180", status: "available", location: "Hyderabad", mobile: "9811223348", email: "sahas@sanitation.in" },
  { id: "w_006", name: "Southern Civic Builders", skill: "General Civil Works", rating: 4.9, jobsDone: 72, verified: true, license: "TR-871554", status: "available", location: "Chennai", mobile: "9811223349", email: "southern.civic@builders.in" },
];

export interface DemoTeamMember {
  id: string;
  name: string;
  email: string;
  level: "Admin" | "Verifier" | "Field Officer" | "Viewer";
  avatar: string;
  lastActive: string;
}

export const demoTeam: DemoTeamMember[] = [
  { id: "tm_001", name: "Priya Sharma", email: "priya@municipal.gov", level: "Admin", avatar: "PS", lastActive: "now" },
  { id: "tm_002", name: "Arjun Nair", email: "arjun@municipal.gov", level: "Verifier", avatar: "AN", lastActive: "12 min ago" },
  { id: "tm_003", name: "Lakshmi Rao", email: "lakshmi@municipal.gov", level: "Field Officer", avatar: "LR", lastActive: "1h ago" },
  { id: "tm_004", name: "Imran Khan", email: "imran@municipal.gov", level: "Viewer", avatar: "IK", lastActive: "3h ago" },
];

export const demoOrganization = {
  id: "org_mumbai_001",
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
  team: demoTeam,
};

export const demoAnalytics = {
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

// ---------------------------------------------------------------------------
// 🟠 Worker role data — mirrors src/data/workerMock.ts
// ---------------------------------------------------------------------------

export type DemoBidStatus = "pending" | "awarded" | "rejected";

export interface DemoBid {
  id: string;
  jobId: string;
  jobTitle: string;
  emoji: string;
  gradient: string;
  quoted: number;
  timelineDays: number;
  message: string;
  status: DemoBidStatus;
  submittedAgo: string;
  aiEstimate: number;
  org: string;
}

export const demoBids: DemoBid[] = [
  {
    id: "bid_001",
    jobId: "job_002",
    jobTitle: "Sector 17 Streetlight LED Grid Replacement",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    quoted: 36500,
    timelineDays: 3,
    message: "Certified electrician, team of 3. Will replace all 8 fixtures and run a full night test before signing off.",
    status: "pending",
    submittedAgo: "2h ago",
    aiEstimate: 38000,
    org: "Chandigarh Smart City",
  },
  {
    id: "bid_002",
    jobId: "job_003",
    jobTitle: "Koregaon Park Garden Replanting Drive",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    quoted: 69000,
    timelineDays: 10,
    message: "Horticulture team with nursery tie-up. Native saplings + drip irrigation included in the quote.",
    status: "rejected",
    submittedAgo: "1d ago",
    aiEstimate: 72000,
    org: "Pune Green Together",
  },
  {
    id: "bid_003",
    jobId: "job_006",
    jobTitle: "Koramangala Block 4 Drain Clearing",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    quoted: 51000,
    timelineDays: 3,
    message: "Monsoon-ready crew. Manual + JCB de-silting, debris removed same day, site sanitized after work.",
    status: "awarded",
    submittedAgo: "1h ago",
    aiEstimate: 54000,
    org: "Bengaluru Rising NGO",
  },
];

export interface DemoActiveJob extends DemoJob {
  bidId: string;
  awardedAt: string;
  clientName: string;
  clientMobile: string;
  instructionNote: string;
  payoutEligible: boolean;
  completionMarked: boolean;
  checklist: { label: string; done: boolean }[];
}

export const demoActiveJobs: DemoActiveJob[] = [
  {
    ...demoJobs[5],
    bidId: "bid_003",
    awardedAt: "Today, 9:12 AM",
    clientName: "Anita K.",
    clientMobile: "+91 98450 22331",
    instructionNote:
      "Co-ordinate with BMC ward office. Block the road between 10am–2pm. Dispose debris at the ward's green bin site on 100ft Road.",
    payoutEligible: true,
    completionMarked: false,
    checklist: [
      { label: "Site safety barricades installed", done: true },
      { label: "Drain mouth de-clogged", done: true },
      { label: "Full-length silt removal (12m)", done: true },
      { label: "Debris transported to ward site", done: false },
      { label: "Site sanitized & photo proof", done: false },
    ],
  },
];

export interface DemoWithdrawal {
  id: string;
  method: string;
  accountMasked: string;
  amount: number;
  date: string;
  status: "Success" | "Processing" | "Failed";
}

export interface DemoEarningsTx {
  id: string;
  jobTitle: string;
  emoji: string;
  type: "escrow_release" | "milestone" | "withdrawal" | "topup";
  amount: number;
  date: string;
  note: string;
}

export const demoWallet = {
  balance: 72000,
  escrowPending: 51000,
  lifetime: 342000,
  withdrawals: [
    { id: "w_01", method: "UPI", accountMasked: "•8802@okhdfc", amount: 40000, date: "Aug 10", status: "Success" },
    { id: "w_02", method: "Bank Transfer", accountMasked: "HDFC ••• 4521", amount: 25000, date: "Jul 28", status: "Success" },
  ] as DemoWithdrawal[],
  history: [
    { id: "t_01", jobTitle: "Koramangala Block 4 Drain Clearing", emoji: "💧", type: "escrow_release", amount: 51000, date: "Today", note: "Milestone 1 of 3 released" },
    { id: "t_02", jobTitle: "Salt Lake Bridge Railing Weld", emoji: "🌉", type: "escrow_release", amount: 31000, date: "Aug 09", note: "Final payout — AI verified" },
    { id: "t_03", jobTitle: "Withdrawal to UPI", emoji: "🏦", type: "withdrawal", amount: -40000, date: "Aug 10", note: "UPI •8802" },
    { id: "t_04", jobTitle: "Andheri Pothole Patch (Phase 1)", emoji: "🛣️", type: "milestone", amount: 18000, date: "Aug 02", note: "Milestone 2 passed photo check" },
  ] as DemoEarningsTx[],
};

export interface DemoReview {
  id: string;
  author: string;
  avatar: string;
  role: "Citizen" | "Organization";
  rating: number;
  text: string;
  jobTitle: string;
  date: string;
}

export const demoWorkerReviews: DemoReview[] = [
  {
    id: "rv_01",
    author: "Anita K.",
    avatar: "👩",
    role: "Citizen",
    rating: 5,
    text: "Rahul's crew cleared the drain before the next downpour. Zero waterlogging since. Absolute professional.",
    jobTitle: "Koramangala Block 4 Drain Clearing",
    date: "Today",
  },
  {
    id: "rv_02",
    author: "BMC Ward Office",
    avatar: "🏛️",
    role: "Organization",
    rating: 5,
    text: "Timely completion, clean site, proper disposal. We re-awarded him a second contract immediately.",
    jobTitle: "Salt Lake Bridge Railing Weld",
    date: "Aug 09",
  },
  {
    id: "rv_03",
    author: "Simran D.",
    avatar: "👧",
    role: "Citizen",
    rating: 4,
    text: "Streetlights fixed within 2 days as promised. Slight delay in final sign-off, but quality is good.",
    jobTitle: "Sector 17 Streetlight Replacement",
    date: "Jul 30",
  },
];

export interface DemoWorkerProfile {
  name: string;
  skillCategory: string;
  licenseId: string;
  rating: number;
  jobsDone: number;
  acceptanceRate: number;
  responseTime: string;
  verified: boolean;
  memberSince: string;
  location: string;
  bio: string;
  portfolio: {
    id: string;
    title: string;
    category: string;
    emoji: string;
    gradient: string;
    payout: number;
    date: string;
    verified: boolean;
    before: string;
    after: string;
  }[];
  badges: { id: string; label: string; emoji: string; unlocked: boolean }[];
}

export const demoWorkerProfile: DemoWorkerProfile = {
  name: "Rahul Deshmukh",
  skillCategory: "Sanitation & Drainage",
  licenseId: "TR-5582910",
  rating: 4.9,
  jobsDone: 137,
  acceptanceRate: 96,
  responseTime: "~20 min",
  verified: true,
  memberSince: "Mar 2024",
  location: "Bengaluru, Karnataka",
  bio: "Municipal works contractor · drain de-silting, road patches, streetlights. Punctual, safety-first, photo-proven work.",
  portfolio: [
    { id: "pf_01", title: "Koramangala Block 4 Drain Clearing", category: "Sanitation", emoji: "💧", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", payout: 54000, date: "Aug 2026", verified: true, before: "Stagnant grey water flooding the street.", after: "Clear drain, dry road, fresh kerb markings." },
    { id: "pf_02", title: "Salt Lake Bridge Railing Weld", category: "Safety", emoji: "🌉", gradient: "linear-gradient(135deg,#e11d48,#be123c)", payout: 33000, date: "Jul 2026", verified: true, before: "Rusted, holed railing over the canal.", after: "Solid welded railing, painted safety-yellow." },
    { id: "pf_03", title: "Sector 17 Streetlight Replacement", category: "Electrical", emoji: "💡", gradient: "linear-gradient(135deg,#a855f7,#6366f1)", payout: 38000, date: "Jul 2026", verified: true, before: "8 dark poles, broken fixtures.", after: "Full LED grid, night-time test passed." },
  ],
  badges: [
    { id: "bd_01", label: "Top Performer", emoji: "🏆", unlocked: true },
    { id: "bd_02", label: "100+ Jobs", emoji: "💯", unlocked: true },
    { id: "bd_03", label: "AI Verified", emoji: "🤖", unlocked: true },
    { id: "bd_04", label: "Early Bird", emoji: "⏰", unlocked: true },
    { id: "bd_05", label: "Super Responder", emoji: "⚡", unlocked: false },
    { id: "bd_06", label: "Green Crew", emoji: "🌱", unlocked: false },
  ],
};

// ---------------------------------------------------------------------------
// 🟣 Investor role data — mirrors src/data/investorMock.ts
// ---------------------------------------------------------------------------

export interface DemoComment {
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface DemoWorkerBid {
  id: string;
  worker: string;
  rating: number;
  quotedPrice: number;
  etaDays: number;
  jobsDone: number;
  verified: boolean;
}

export interface DemoCampaign {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  org: string;
  orgVerified: boolean;
  location: string;
  area: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  backers: number;
  likes: number;
  shares: number;
  comments: DemoComment[];
  aiConfidence: number;
  workerRating: number;
  impactScore: number;
  status: "Funding" | "InProgress" | "Verified" | "Completed";
  workerBids: DemoWorkerBid[];
  createdAt: string;
  hashtags: string[];
  beforeAfter?: { before: string; after: string };
  payout?: { txnId: string; released: number; worker: string; status: string };
  impactSummary?: string;
}

export const demoCampaigns: DemoCampaign[] = [
  {
    id: "cmp_001",
    title: "Andheri Flyover Pothole Emergency Resurfacing",
    category: "Road",
    emoji: "🛣️",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    org: "Brihanmumbai Municipal Corp",
    orgVerified: true,
    location: "Mumbai, Maharashtra",
    area: "Andheri West",
    description:
      "A 12-meter stretch of the Andheri flyover service road has crumbled, damaging two-wheelers daily. Community crowdfunding will resurface it in 48 hours once funded.",
    targetAmount: 85000,
    raisedAmount: 61200,
    currency: "INR",
    backers: 214,
    likes: 1284,
    shares: 96,
    comments: [
      { user: "Priya M.", avatar: "🧕", text: "My scooter got damaged here last week. Proud to back this!", time: "2h", likes: 42 },
      { user: "Rahul S.", avatar: "🧑", text: "Can we get CCTV proof after completion?", time: "1h", likes: 18 },
    ],
    aiConfidence: 0.94,
    workerRating: 4.9,
    impactScore: 92,
    status: "Funding",
    workerBids: [
      { id: "b1", worker: "Sharma Road Works", rating: 4.9, quotedPrice: 82000, etaDays: 2, jobsDone: 137, verified: true },
      { id: "b2", worker: "Western Civic Contractors", rating: 4.6, quotedPrice: 79000, etaDays: 4, jobsDone: 64, verified: true },
    ],
    createdAt: "2026-08-10",
    hashtags: ["#PotholeFix", "#Mumbai", "#CivicPride"],
  },
  {
    id: "cmp_002",
    title: "Koramangala 4th Block Drain Clearing",
    category: "Drainage",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    org: "Bengaluru Rising NGO",
    orgVerified: true,
    location: "Bengaluru, Karnataka",
    area: "Koramangala",
    description:
      "Monsoon floods every monsoon here. Clearing the blocked storm drain protects 400 families from waterborne disease.",
    targetAmount: 54000,
    raisedAmount: 54000,
    currency: "INR",
    backers: 173,
    likes: 902,
    shares: 71,
    comments: [{ user: "Anita K.", avatar: "👩", text: "Completed so fast! Thank you to every backer 💙", time: "3d", likes: 120 }],
    aiConfidence: 0.91,
    workerRating: 4.8,
    impactScore: 88,
    status: "Verified",
    workerBids: [{ id: "b3", worker: "Lakeside Drainage Co.", rating: 4.8, quotedPrice: 52000, etaDays: 3, jobsDone: 89, verified: true }],
    createdAt: "2026-08-02",
    hashtags: ["#Drainage", "#Bengaluru", "#MonsoonReady"],
    beforeAfter: {
      before: "Stagnant grey water flooding the street, garbage clogging the mouth of the drain.",
      after: "Clear drain, dry road, fresh coat of white marking on the kerb.",
    },
    payout: { txnId: "txn_884201", released: 52000, worker: "Lakeside Drainage Co.", status: "Released" },
    impactSummary: "400 families protected · 0 reported waterlogging incidents in the last week · 12 tonnes of debris cleared.",
  },
  {
    id: "cmp_003",
    title: "Streetlight Repair — Sector 17 Night Safety",
    category: "Streetlight",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    org: "Chandigarh Smart City",
    orgVerified: true,
    location: "Chandigarh, Punjab",
    area: "Sector 17",
    description:
      "Eight streetlights out for 3 months. Women's safety group reports rising harassment after dark. Let's light it up.",
    targetAmount: 38000,
    raisedAmount: 21900,
    currency: "INR",
    backers: 98,
    likes: 643,
    shares: 40,
    comments: [{ user: "Simran D.", avatar: "👧", text: "This is for every woman who walks home late. ❤️", time: "5h", likes: 77 }],
    aiConfidence: 0.89,
    workerRating: 4.7,
    impactScore: 84,
    status: "Funding",
    workerBids: [{ id: "b4", worker: "Northern Electricals", rating: 4.7, quotedPrice: 36000, etaDays: 2, jobsDone: 51, verified: true }],
    createdAt: "2026-08-09",
    hashtags: ["#SafetyFirst", "#Chandigarh", "#LightTheNight"],
  },
  {
    id: "cmp_004",
    title: "Community Park Horticulture Revival",
    category: "Green",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    org: "Pune Green Together",
    orgVerified: false,
    location: "Pune, Maharashtra",
    area: "Koregaon Park",
    description:
      "The neighborhood park turned barren. Reviving it with native trees cools the block and gives kids a place to play.",
    targetAmount: 72000,
    raisedAmount: 48000,
    currency: "INR",
    backers: 156,
    likes: 1102,
    shares: 88,
    comments: [{ user: "Meera P.", avatar: "🧓", text: "My grandchildren deserve a green park. Funded happily.", time: "1d", likes: 64 }],
    aiConfidence: 0.86,
    workerRating: 4.5,
    impactScore: 79,
    status: "InProgress",
    workerBids: [{ id: "b5", worker: "Green Roots Nursery", rating: 4.5, quotedPrice: 70000, etaDays: 10, jobsDone: 33, verified: false }],
    createdAt: "2026-08-05",
    hashtags: ["#GoGreen", "#Pune", "#UrbanForest"],
  },
  {
    id: "cmp_005",
    title: "Footpath Accessibility Ramp Build",
    category: "Accessibility",
    emoji: "♿",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    org: "Inclusive Chennai",
    orgVerified: true,
    location: "Chennai, Tamil Nadu",
    area: "T. Nagar",
    description:
      "A busy subway has no ramp — wheelchair users cross a deadly road instead. A simple ramp changes everything.",
    targetAmount: 46000,
    raisedAmount: 46000,
    currency: "INR",
    backers: 132,
    likes: 845,
    shares: 60,
    comments: [{ user: "Karthik V.", avatar: "🧑", text: "Accessibility is a right, not charity. 🙏", time: "4d", likes: 99 }],
    aiConfidence: 0.93,
    workerRating: 4.9,
    impactScore: 90,
    status: "Completed",
    workerBids: [{ id: "b6", worker: "Southern Civic Builders", rating: 4.9, quotedPrice: 44000, etaDays: 5, jobsDone: 72, verified: true }],
    createdAt: "2026-07-28",
    hashtags: ["#AccessForAll", "#Chennai"],
    beforeAfter: {
      before: "Steep stair-only subway entrance, no ramp, broken railing.",
      after: "Smooth gradient ramp with tactile flooring and a fresh handrail.",
    },
    payout: { txnId: "txn_812007", released: 44000, worker: "Southern Civic Builders", status: "Released" },
    impactSummary: "1 subway made wheelchair-friendly · estimated 300+ daily users · featured by city accessibility board.",
  },
  {
    id: "cmp_006",
    title: "Public Toilet Sanitation Drive",
    category: "Sanitation",
    emoji: "🚻",
    gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
    org: "Hyderabad Clean Mission",
    orgVerified: true,
    location: "Hyderabad, Telangana",
    area: "Gachibowli",
    description:
      "Two public toilets near the IT corridor are unusable. Daily-wage workers have nowhere to go. Let's restore dignity.",
    targetAmount: 41000,
    raisedAmount: 12300,
    currency: "INR",
    backers: 61,
    likes: 410,
    shares: 22,
    comments: [],
    aiConfidence: 0.88,
    workerRating: 4.6,
    impactScore: 81,
    status: "Funding",
    workerBids: [{ id: "b7", worker: "Sahas Sanitation", rating: 4.6, quotedPrice: 40000, etaDays: 4, jobsDone: 44, verified: true }],
    createdAt: "2026-08-11",
    hashtags: ["#Dignity", "#Hyderabad", "#SwachhBharat"],
  },
  {
    id: "cmp_007",
    title: "Bridge Railing Welding — School Zone",
    category: "Safety",
    emoji: "🌉",
    gradient: "linear-gradient(135deg,#e11d48,#be123c)",
    org: "Kolkata Road Safety",
    orgVerified: true,
    location: "Kolkata, West Bengal",
    area: "Salt Lake",
    description:
      "The footbridge railing near the school has gaping holes. Kids lean on it daily. Urgent weld-and-paint job.",
    targetAmount: 33000,
    raisedAmount: 33000,
    currency: "INR",
    backers: 119,
    likes: 778,
    shares: 51,
    comments: [{ user: "Debajyoti R.", avatar: "🧔", text: "My daughter crosses this every morning. Thank you all.", time: "6d", likes: 88 }],
    aiConfidence: 0.95,
    workerRating: 4.8,
    impactScore: 93,
    status: "Verified",
    workerBids: [{ id: "b8", worker: "Eastern Metal Works", rating: 4.8, quotedPrice: 31000, etaDays: 3, jobsDone: 58, verified: true }],
    createdAt: "2026-08-01",
    hashtags: ["#SchoolZone", "#Kolkata", "#SafeRoutes"],
    beforeAfter: {
      before: "Rusted, holed railing with exposed sharp edges over the canal.",
      after: "Solid welded railing, painted safety-yellow, no gaps.",
    },
    payout: { txnId: "txn_775530", released: 31000, worker: "Eastern Metal Works", status: "Released" },
    impactSummary: "1 school footbridge secured · 250+ children safe · zero sharp-edge incidents since.",
  },
  {
    id: "cmp_008",
    title: "Lake Edge Desilting Pilot",
    category: "Water",
    emoji: "🏞️",
    gradient: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    org: "Indore Lake Trust",
    orgVerified: false,
    location: "Indore, Madhya Pradesh",
    area: "Sukhliya",
    description:
      "The neighborhood lake is choked with silt and weeds. A desilting pilot revives groundwater and local birds.",
    targetAmount: 96000,
    raisedAmount: 71500,
    currency: "INR",
    backers: 188,
    likes: 1330,
    shares: 104,
    comments: [{ user: "Sakshi T.", avatar: "👩‍🦰", text: "We used to picnic here as kids. Bringing it back!", time: "8h", likes: 53 }],
    aiConfidence: 0.87,
    workerRating: 4.4,
    impactScore: 83,
    status: "InProgress",
    workerBids: [{ id: "b9", worker: "Malwa Earthmovers", rating: 4.4, quotedPrice: 93000, etaDays: 12, jobsDone: 27, verified: false }],
    createdAt: "2026-08-06",
    hashtags: ["#ReviveLakes", "#Indore", "#Groundwater"],
  },
];

export interface DemoRegionalImpact {
  totalDeployed: number;
  jobsCompleted: number;
  areasImproved: number;
  backersReached: number;
  byCategory: { category: string; amount: number }[];
  byCity: { city: string; amount: number }[];
  monthly: { month: string; amount: number }[];
}

export const demoRegionalImpact: DemoRegionalImpact = {
  totalDeployed: 263000,
  jobsCompleted: 5,
  areasImproved: 6,
  backersReached: 1141,
  byCategory: [
    { category: "Road", amount: 61200 },
    { category: "Drainage", amount: 54000 },
    { category: "Streetlight", amount: 21900 },
    { category: "Green", amount: 48000 },
    { category: "Accessibility", amount: 46000 },
    { category: "Sanitation", amount: 12300 },
    { category: "Safety", amount: 33000 },
    { category: "Water", amount: 71500 },
  ],
  byCity: [
    { city: "Mumbai, Maharashtra", amount: 61200 },
    { city: "Bengaluru, Karnataka", amount: 54000 },
    { city: "Chandigarh, Punjab", amount: 21900 },
    { city: "Pune, Maharashtra", amount: 48000 },
    { city: "Chennai, Tamil Nadu", amount: 46000 },
    { city: "Hyderabad, Telangana", amount: 12300 },
    { city: "Kolkata, West Bengal", amount: 33000 },
    { city: "Indore, Madhya Pradesh", amount: 71500 },
  ],
  monthly: [
    { month: "May", amount: 90000 },
    { month: "Jun", amount: 145000 },
    { month: "Jul", amount: 198000 },
    { month: "Aug", amount: 263000 },
  ],
};

export const demoImpactAnalytics = [
  { id: "imp_001", title: "Andheri Flyover Resurfacing", jobsCreated: 6, socialImpact: "2,000+ daily commuters" },
  { id: "imp_002", title: "Koramangala Drain Clearing", jobsCreated: 4, socialImpact: "400 families protected" },
  { id: "imp_003", title: "Salt Lake Bridge Railing Weld", jobsCreated: 3, socialImpact: "250+ children safe" },
];
