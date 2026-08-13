/**
 * 🟣 Investor mock data — rich, social-media style content for the demo.
 * Mirrors what /api/investor/* would return, but with photos, engagement,
 * worker bids, trust scores and completion reports so the UI feels alive.
 */

export interface Comment {
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface WorkerBid {
  id: string;
  worker: string;
  rating: number;
  quotedPrice: number;
  etaDays: number;
  jobsDone: number;
  verified: boolean;
}

export interface Campaign {
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
  comments: Comment[];
  aiConfidence: number;
  workerRating: number;
  impactScore: number;
  status: "Funding" | "InProgress" | "Verified" | "Completed";
  workerBids: WorkerBid[];
  createdAt: string;
  hashtags: string[];
  beforeAfter?: { before: string; after: string };
  payout?: { txnId: string; released: number; worker: string; status: string };
  impactSummary?: string;
}

const C = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const fmtMoney = C;

const campaigns: Campaign[] = [
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
    comments: [
      { user: "Anita K.", avatar: "👩", text: "Completed so fast! Thank you to every backer 💙", time: "3d", likes: 120 },
    ],
    aiConfidence: 0.91,
    workerRating: 4.8,
    impactScore: 88,
    status: "Verified",
    workerBids: [
      { id: "b3", worker: "Lakeside Drainage Co.", rating: 4.8, quotedPrice: 52000, etaDays: 3, jobsDone: 89, verified: true },
    ],
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
    comments: [
      { user: "Simran D.", avatar: "👧", text: "This is for every woman who walks home late. ❤️", time: "5h", likes: 77 },
    ],
    aiConfidence: 0.89,
    workerRating: 4.7,
    impactScore: 84,
    status: "Funding",
    workerBids: [
      { id: "b4", worker: "Northern Electricals", rating: 4.7, quotedPrice: 36000, etaDays: 2, jobsDone: 51, verified: true },
    ],
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
    comments: [
      { user: "Meera P.", avatar: "🧓", text: "My grandchildren deserve a green park. Funded happily.", time: "1d", likes: 64 },
    ],
    aiConfidence: 0.86,
    workerRating: 4.5,
    impactScore: 79,
    status: "InProgress",
    workerBids: [
      { id: "b5", worker: "Green Roots Nursery", rating: 4.5, quotedPrice: 70000, etaDays: 10, jobsDone: 33, verified: false },
    ],
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
    comments: [
      { user: "Karthik V.", avatar: "🧑", text: "Accessibility is a right, not charity. 🙏", time: "4d", likes: 99 },
    ],
    aiConfidence: 0.93,
    workerRating: 4.9,
    impactScore: 90,
    status: "Completed",
    workerBids: [
      { id: "b6", worker: "Southern Civic Builders", rating: 4.9, quotedPrice: 44000, etaDays: 5, jobsDone: 72, verified: true },
    ],
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
    workerBids: [
      { id: "b7", worker: "Sahas Sanitation", rating: 4.6, quotedPrice: 40000, etaDays: 4, jobsDone: 44, verified: true },
    ],
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
    comments: [
      { user: "Debajyoti R.", avatar: "🧔", text: "My daughter crosses this every morning. Thank you all.", time: "6d", likes: 88 },
    ],
    aiConfidence: 0.95,
    workerRating: 4.8,
    impactScore: 93,
    status: "Verified",
    workerBids: [
      { id: "b8", worker: "Eastern Metal Works", rating: 4.8, quotedPrice: 31000, etaDays: 3, jobsDone: 58, verified: true },
    ],
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
    comments: [
      { user: "Sakshi T.", avatar: "👩‍🦰", text: "We used to picnic here as kids. Bringing it back!", time: "8h", likes: 53 },
    ],
    aiConfidence: 0.87,
    workerRating: 4.4,
    impactScore: 83,
    status: "InProgress",
    workerBids: [
      { id: "b9", worker: "Malwa Earthmovers", rating: 4.4, quotedPrice: 93000, etaDays: 12, jobsDone: 27, verified: false },
    ],
    createdAt: "2026-08-06",
    hashtags: ["#ReviveLakes", "#Indore", "#Groundwater"],
  },
];

const delay = <T,>(v: T): Promise<T> => new Promise((res) => setTimeout(() => res(v), 350));

export function getInvestorFeed(): Promise<Campaign[]> {
  return delay(campaigns.filter((c) => c.status === "Funding" || c.status === "InProgress"));
}

export function getCampaign(id: string): Promise<Campaign | undefined> {
  return delay(campaigns.find((c) => c.id === id));
}

export function getPortfolio(): Promise<Campaign[]> {
  return delay(campaigns.filter((c) => c.raisedAmount >= c.targetAmount || c.status !== "Funding"));
}

export function getTrustScore(id: string): Promise<Campaign | undefined> {
  return getCampaign(id);
}

export function getCompletionReport(id: string): Promise<Campaign | undefined> {
  return getCampaign(id);
}

export function getPayout(id: string): Promise<Campaign | undefined> {
  return getCampaign(id);
}

export interface RegionalImpact {
  totalDeployed: number;
  jobsCompleted: number;
  areasImproved: number;
  backersReached: number;
  byCategory: { category: string; amount: number }[];
  byCity: { city: string; amount: number }[];
  monthly: { month: string; amount: number }[];
}

export function getRegionalImpact(): Promise<RegionalImpact> {
  const totalDeployed = campaigns
    .filter((c) => c.payout || c.status === "Verified" || c.status === "Completed")
    .reduce((s, c) => s + (c.payout?.released ?? c.raisedAmount), 0);
  const jobsCompleted = campaigns.filter((c) => c.status === "Completed" || c.status === "Verified").length;
  const areasImproved = new Set(campaigns.map((c) => c.area)).size;
  const backersReached = campaigns.reduce((s, c) => s + c.backers, 0);

  const byCategoryMap = new Map<string, number>();
  campaigns.forEach((c) => byCategoryMap.set(c.category, (byCategoryMap.get(c.category) || 0) + c.raisedAmount));
  const byCityMap = new Map<string, number>();
  campaigns.forEach((c) => byCityMap.set(c.location, (byCityMap.get(c.location) || 0) + c.raisedAmount));

  return delay({
    totalDeployed,
    jobsCompleted,
    areasImproved,
    backersReached,
    byCategory: Array.from(byCategoryMap.entries()).map(([category, amount]) => ({ category, amount })),
    byCity: Array.from(byCityMap.entries()).map(([city, amount]) => ({ city, amount })),
    monthly: [
      { month: "May", amount: 90000 },
      { month: "Jun", amount: 145000 },
      { month: "Jul", amount: 198000 },
      { month: "Aug", amount: 263000 },
    ],
  });
}

export function fundCampaignMock(_input: { campaignId: string; amount: number }): Promise<{ transaction: { id: string; amount: number; status: string } }> {
  return delay({ transaction: { id: `txn_${Date.now()}`, amount: _input.amount, status: "Pending" } });
}
