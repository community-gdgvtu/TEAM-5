/**
 * 🟠 Worker mock data — rich content for the Worker role demo.
 * Mirrors what /api/jobs, /api/bids etc. would return, but keeps the
 * marketplace, bidding, active-job, verification and wallet flows offline.
 */

export const C = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export type JobStatus =
  | "open"
  | "bidding"
  | "awarded"
  | "active"
  | "proof"
  | "verification"
  | "completed"
  | "rejected";

export interface WorkerJob {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  org: string;
  orgVerified: boolean;
  area: string;
  location: string;
  distanceKm: number;
  payout: number;
  payoutMin: number;
  payoutMax: number;
  raised: number;
  funded: boolean;
  urgency: "High" | "Medium" | "Low";
  postedAgo: string;
  description: string;
  aiEstimate: number;
  aiConfidence: number;
  bidsCount: number;
  status: JobStatus;
  deadDate?: string;
  checklist?: { label: string; done: boolean }[];
  beforeNote?: string;
}

const openJobs: WorkerJob[] = [
  {
    id: "job_001",
    title: "Andheri Flyover Pothole Emergency Resurfacing",
    category: "Road & Pavement Repairs",
    emoji: "🛣️",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    org: "Brihanmumbai Municipal Corp",
    orgVerified: true,
    area: "Andheri West",
    location: "Mumbai, Maharashtra",
    distanceKm: 1.2,
    payout: 85000,
    payoutMin: 62000,
    payoutMax: 95000,
    raised: 61200,
    funded: false,
    urgency: "High",
    postedAgo: "3h ago",
    description:
      "A 12-meter stretch of the Andheri flyover service road has crumbled, damaging two-wheelers daily. Community crowdfunding covers the full repair cost.",
    aiEstimate: 85000,
    aiConfidence: 0.94,
    bidsCount: 3,
    status: "open",
    deadDate: "Aug 18",
  },
  {
    id: "job_002",
    title: "Sector 17 Streetlight LED Grid Replacement",
    category: "Electrical & Streetlight Fixes",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    org: "Chandigarh Smart City",
    orgVerified: true,
    area: "Sector 17",
    location: "Chandigarh, Punjab",
    distanceKm: 2.8,
    payout: 38000,
    payoutMin: 28000,
    payoutMax: 42000,
    raised: 21900,
    funded: false,
    urgency: "High",
    postedAgo: "5h ago",
    description:
      "Eight streetlights out for 3 months. Women's safety group reports rising harassment after dark. Let's light it up.",
    aiEstimate: 38000,
    aiConfidence: 0.89,
    bidsCount: 2,
    status: "bidding",
    deadDate: "Aug 20",
  },
  {
    id: "job_003",
    title: "Koregaon Park Garden Replanting Drive",
    category: "Park Maintenance & Horticulture",
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#22c55e,#15803d)",
    org: "Pune Green Together",
    orgVerified: false,
    area: "Koregaon Park",
    location: "Pune, Maharashtra",
    distanceKm: 4.1,
    payout: 72000,
    payoutMin: 54000,
    payoutMax: 78000,
    raised: 48000,
    funded: false,
    urgency: "Low",
    postedAgo: "1d ago",
    description:
      "The neighborhood park turned barren. Reviving it with native trees cools the block and gives kids a place to play.",
    aiEstimate: 72000,
    aiConfidence: 0.86,
    bidsCount: 5,
    status: "bidding",
    deadDate: "Aug 24",
  },
  {
    id: "job_004",
    title: "Gachibowli Public Toilet Sanitation Overhaul",
    category: "Sanitation & Drainage",
    emoji: "🚻",
    gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
    org: "Hyderabad Clean Mission",
    orgVerified: true,
    area: "Gachibowli",
    location: "Hyderabad, Telangana",
    distanceKm: 6.7,
    payout: 41000,
    payoutMin: 30000,
    payoutMax: 46000,
    raised: 12300,
    funded: false,
    urgency: "Medium",
    postedAgo: "8h ago",
    description:
      "Two public toilets near the IT corridor are unusable. Daily-wage workers have nowhere to go. Let's restore dignity.",
    aiEstimate: 41000,
    aiConfidence: 0.88,
    bidsCount: 1,
    status: "open",
    deadDate: "Aug 19",
  },
  {
    id: "job_005",
    title: "T. Nagar Footpath Accessibility Ramp Build",
    category: "General Civil Works",
    emoji: "♿",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    org: "Inclusive Chennai",
    orgVerified: true,
    area: "T. Nagar",
    location: "Chennai, Tamil Nadu",
    distanceKm: 8.4,
    payout: 46000,
    payoutMin: 36000,
    payoutMax: 50000,
    raised: 46000,
    funded: true,
    urgency: "Medium",
    postedAgo: "2d ago",
    description:
      "A busy subway has no ramp — wheelchair users cross a deadly road instead. A simple ramp changes everything. Fully funded, ready to build.",
    aiEstimate: 46000,
    aiConfidence: 0.93,
    bidsCount: 4,
    status: "open",
    deadDate: "Aug 21",
  },
  {
    id: "job_006",
    title: "Koramangala Block 4 Drain Clearing",
    category: "Sanitation & Drainage",
    emoji: "💧",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    org: "Bengaluru Rising NGO",
    orgVerified: true,
    area: "Koramangala",
    location: "Bengaluru, Karnataka",
    distanceKm: 1.9,
    payout: 54000,
    payoutMin: 42000,
    payoutMax: 58000,
    raised: 54000,
    funded: true,
    urgency: "High",
    postedAgo: "30m ago",
    description:
      "Monsoon floods this block every year. Clearing the blocked storm drain protects 400 families from waterborne disease. Fully funded.",
    aiEstimate: 54000,
    aiConfidence: 0.91,
    bidsCount: 6,
    status: "open",
    deadDate: "Aug 17",
  },
];

export function getOpenJobs(): Promise<WorkerJob[]> {
  return delay(openJobs.filter((j) => j.status === "open" || j.status === "bidding"));
}

export function getJob(id: string): Promise<WorkerJob | undefined> {
  return delay(openJobs.find((j) => j.id === id));
}

export interface MyBid {
  id: string;
  jobId: string;
  jobTitle: string;
  emoji: string;
  gradient: string;
  quoted: number;
  timelineDays: number;
  message: string;
  status: "pending" | "awarded" | "rejected";
  submittedAgo: string;
  aiEstimate: number;
  org: string;
}

const myBids: MyBid[] = [
  {
    id: "bid_001",
    jobId: "job_002",
    jobTitle: "Sector 17 Streetlight LED Grid Replacement",
    emoji: "💡",
    gradient: "linear-gradient(135deg,#a855f7,#6366f1)",
    quoted: 36500,
    timelineDays: 3,
    message:
      "Certified electrician, team of 3. Will replace all 8 fixtures and run a full night test before signing off.",
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
    message:
      "Horticulture team with nursery tie-up. Native saplings + drip irrigation included in the quote.",
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
    message:
      "Monsoon-ready crew. Manual + JCB de-silting, debris removed same day, site sanitized after work.",
    status: "awarded",
    submittedAgo: "1h ago",
    aiEstimate: 54000,
    org: "Bengaluru Rising NGO",
  },
];

export function getMyBidsMock(): Promise<MyBid[]> {
  return delay(myBids);
}

export interface ActiveJob extends WorkerJob {
  bidId: string;
  awardedAt: string;
  dueDate: string;
  clientName: string;
  clientMobile: string;
  instructionNote: string;
  payoutEligible: boolean;
  completionMarked: boolean;
}

const activeJobs: ActiveJob[] = [
  {
    ...openJobs[5],
    bidId: "bid_003",
    awardedAt: "Today, 9:12 AM",
    dueDate: "Aug 17",
    clientName: "Anita K.",
    clientMobile: "+91 98450 22331",
    instructionNote:
      "Co-ordinate with BMC ward office. Block the road between 10am–2pm. Dispose debris at the ward's green bin site on 100ft Road.",
    payoutEligible: true,
    completionMarked: false,
    status: "active",
    checklist: [
      { label: "Site safety barricades installed", done: true },
      { label: "Drain mouth de-clogged", done: true },
      { label: "Full-length silt removal (12m)", done: true },
      { label: "Debris transported to ward site", done: false },
      { label: "Site sanitized & photo proof", done: false },
    ],
  },
];

export function getActiveJobs(): Promise<ActiveJob[]> {
  return delay(activeJobs);
}

export interface Withdrawal {
  id: string;
  method: string;
  accountMasked: string;
  amount: number;
  date: string;
  status: "Success" | "Processing" | "Failed";
}

export interface EarningsTx {
  id: string;
  jobTitle: string;
  emoji: string;
  type: "escrow_release" | "milestone" | "withdrawal" | "topup";
  amount: number;
  date: string;
  note: string;
}

export const wallet = {
  balance: 72000,
  escrowPending: 51000,
  lifetime: 342000,
  withdrawals: [
    { id: "w_01", method: "UPI", accountMasked: "•8802@okhdfc", amount: 40000, date: "Aug 10", status: "Success" },
    { id: "w_02", method: "Bank Transfer", accountMasked: "HDFC ••• 4521", amount: 25000, date: "Jul 28", status: "Success" },
  ] as Withdrawal[],
  history: [
    { id: "t_01", jobTitle: "Koramangala Block 4 Drain Clearing", emoji: "💧", type: "escrow_release", amount: 51000, date: "Today", note: "Milestone 1 of 3 released" },
    { id: "t_02", jobTitle: "Salt Lake Bridge Railing Weld", emoji: "🌉", type: "escrow_release", amount: 31000, date: "Aug 09", note: "Final payout — AI verified" },
    { id: "t_03", jobTitle: "Withdrawal to UPI", emoji: "🏦", type: "withdrawal", amount: -40000, date: "Aug 10", note: "UPI •8802" },
    { id: "t_04", jobTitle: "Andheri Pothole Patch (Phase 1)", emoji: "🛣️", type: "milestone", amount: 18000, date: "Aug 02", note: "Milestone 2 passed photo check" },
  ] as EarningsTx[],
};

export function getWallet(): Promise<typeof wallet> {
  return delay(wallet);
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  role: "Citizen" | "Organization";
  rating: number;
  text: string;
  jobTitle: string;
  date: string;
}

export const reviews: Review[] = [
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

export function getReviews(): Promise<Review[]> {
  return delay(reviews);
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  unlocked: boolean;
}

export interface PortfolioJob {
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
}

export const profile = {
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
  ] as PortfolioJob[],
  badges: [
    { id: "bd_01", label: "Top Performer", emoji: "🏆", unlocked: true },
    { id: "bd_02", label: "100+ Jobs", emoji: "💯", unlocked: true },
    { id: "bd_03", label: "AI Verified", emoji: "🤖", unlocked: true },
    { id: "bd_04", label: "Early Bird", emoji: "⏰", unlocked: true },
    { id: "bd_05", label: "Super Responder", emoji: "⚡", unlocked: false },
    { id: "bd_06", label: "Green Crew", emoji: "🌱", unlocked: false },
  ] as Badge[],
};

export function getProfile(): Promise<typeof profile> {
  return delay(profile);
}

const delay = <T,>(v: T): Promise<T> => new Promise((res) => setTimeout(() => res(v), 350));
