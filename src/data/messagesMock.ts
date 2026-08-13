/**
 * 💬 Messages mock — mirrors the backend `/api/messages` shapes so the
 * frontend never dead-ends. Threads are per-issue / per-job / per-campaign
 * (IG-DM inbox style). Each role sees its own inbox.
 */

export type MessageRole = "citizen" | "organization" | "worker" | "investor";

export interface ThreadParticipant {
  id: string;
  name: string;
  avatar: string;
  role: "citizen" | "organization" | "worker" | "investor";
}

export interface TopicRef {
  type: "issue" | "job" | "campaign";
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  status?: string;
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  text: string;
  time: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  ownerRole: MessageRole;
  ownerId: string;
  participants: ThreadParticipant[];
  topic: TopicRef;
  messages: ThreadMessage[];
  unread: number;
  updatedAt: string;
}

const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60000).toISOString();

const M = (
  senderId: string,
  senderName: string,
  avatar: string,
  text: string,
  time: string,
  key = `${senderId}-${text.length}`
): ThreadMessage => ({
  id: `m_${key}`,
  senderId,
  senderName,
  avatar,
  text,
  time,
  createdAt: iso(parseInt(String(time.replace(/[^0-9]/g, "") || "60"), 10) * 10),
});

const ORG = { id: "org_mumbai_001", name: "Brihanmumbai Municipal Corporation", avatar: "🏛️", role: "organization" as const };
const WORKER = { id: "user_demo_worker_001", name: "Rahul Deshmukh", avatar: "🧑‍🔧", role: "worker" as const };

function citizenThreads(): MessageThread[] {
  return [
    {
      id: "t_cit_001",
      ownerRole: "citizen",
      ownerId: "user_citizen_001",
      participants: [ORG],
      topic: {
        type: "issue",
        id: "rep_001",
        title: "Deep pothole on 100ft Road, Andheri",
        emoji: "🕳️",
        gradient: "linear-gradient(135deg,#f97316,#ef4444)",
        status: "Approved · Open for bids",
      },
      messages: [
        M(ORG.id, ORG.name, ORG.avatar, "Hi Ananya, thanks for reporting. We've verified the pothole photos — pushing this to the repair marketplace now.", "2h", "a"),
        M("user_citizen_001", "Ananya Sharma", "🧕", "Thank you! Please prioritize it — two-wheelers keep skidding here.", "1h", "b"),
        M(ORG.id, ORG.name, ORG.avatar, "Done ✅ It's live on the marketplace with a ₹85,000 target and AI cost estimate.", "45m", "c"),
      ],
      unread: 1,
      updatedAt: iso(45),
    },
    {
      id: "t_cit_002",
      ownerRole: "citizen",
      ownerId: "user_citizen_001",
      participants: [WORKER],
      topic: {
        type: "issue",
        id: "rep_006",
        title: "Public toilet unusable — IT corridor",
        emoji: "🚻",
        gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
        status: "Work done · AI verified",
      },
      messages: [
        M(WORKER.id, WORKER.name, WORKER.avatar, "Hi Ananya, the toilet block is cleaned and sanitised. After-photo uploaded for AI verification.", "6h", "a"),
        M("user_citizen_001", "Ananya Sharma", "🧕", "That was fast! The daily-wage workers will be relieved. 🙏", "5h", "b"),
      ],
      unread: 0,
      updatedAt: iso(300),
    },
  ];
}

function workerThreads(): MessageThread[] {
  return [
    {
      id: "t_wrk_001",
      ownerRole: "worker",
      ownerId: "user_demo_worker_001",
      participants: [ORG],
      topic: {
        type: "job",
        id: "job_001",
        title: "Andheri Flyover Pothole Emergency Resurfacing",
        emoji: "🛣️",
        gradient: "linear-gradient(135deg,#f97316,#ef4444)",
        status: "Bidding open",
      },
      messages: [
        M(ORG.id, ORG.name, ORG.avatar, "Hi Rahul, we've opened bidding on the Andheri resurfacing job. Your quote of ₹82,000 with 2-day ETA looks strong.", "3h", "a"),
        M(WORKER.id, WORKER.name, WORKER.avatar, "Thanks! I can start within 48h of award — night shifts to avoid traffic.", "2h", "b"),
        M(ORG.id, ORG.name, ORG.avatar, "Noted. Decision expected today after funding closes.", "1h", "c"),
      ],
      unread: 2,
      updatedAt: iso(60),
    },
    {
      id: "t_wrk_002",
      ownerRole: "worker",
      ownerId: "user_demo_worker_001",
      participants: [{ id: "citizen_rep_006", name: "Anita K.", avatar: "👩", role: "citizen" }],
      topic: {
        type: "job",
        id: "job_006",
        title: "Koramangala Block 4 Drain Clearing",
        emoji: "💧",
        gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
        status: "Submitted · awaiting verification",
      },
      messages: [
        M("citizen_rep_006", "Anita K.", "👩", "Rahul, the drain is clear and the street is dry — thank you and the crew!", "1d", "a"),
        M(WORKER.id, WORKER.name, WORKER.avatar, "Happy to help! After-photo is with AI verification now. Should pass within the day.", "1d", "b"),
      ],
      unread: 0,
      updatedAt: iso(1500),
    },
  ];
}

function orgThreads(): MessageThread[] {
  return [
    {
      id: "t_org_001",
      ownerRole: "organization",
      ownerId: "org_mumbai_001",
      participants: [{ id: "citizen_rep_001", name: "Priya M.", avatar: "🧕", role: "citizen" }],
      topic: {
        type: "issue",
        id: "rep_001",
        title: "Deep pothole on 100ft Road, Andheri",
        emoji: "🕳️",
        gradient: "linear-gradient(135deg,#f97316,#ef4444)",
        status: "Approved · live on marketplace",
      },
      messages: [
        M("citizen_rep_001", "Priya M.", "🧕", "Please expedite — my scooter got damaged here last week.", "3h", "a"),
        M(ORG.id, ORG.name, ORG.avatar, "Understood Priya. Report approved, campaign live with ₹85,000 target. We'll keep you posted.", "2h", "b"),
        M("citizen_rep_001", "Priya M.", "🧕", "Appreciated 🙌", "2h", "c"),
      ],
      unread: 1,
      updatedAt: iso(120),
    },
    {
      id: "t_org_002",
      ownerRole: "organization",
      ownerId: "org_mumbai_001",
      participants: [WORKER],
      topic: {
        type: "job",
        id: "job_001",
        title: "Andheri Flyover Pothole Emergency Resurfacing",
        emoji: "🛣️",
        gradient: "linear-gradient(135deg,#f97316,#ef4444)",
        status: "Bidding open",
      },
      messages: [
        M(WORKER.id, WORKER.name, WORKER.avatar, "Submitting bid: ₹82,000, 2-day ETA, night shifts.", "2h", "a"),
        M(ORG.id, ORG.name, ORG.avatar, "Received. Your rating and verified license help your case.", "1h", "b"),
      ],
      unread: 0,
      updatedAt: iso(90),
    },
  ];
}

function investorThreads(): MessageThread[] {
  return [
    {
      id: "t_inv_001",
      ownerRole: "investor",
      ownerId: "user_demo_investor_001",
      participants: [ORG],
      topic: {
        type: "campaign",
        id: "cmp_001",
        title: "Andheri Flyover Pothole Emergency Resurfacing",
        emoji: "🛣️",
        gradient: "linear-gradient(135deg,#f97316,#ef4444)",
        status: "72% funded",
      },
      messages: [
        M(ORG.id, ORG.name, ORG.avatar, "Hi, your ₹10,000 contribution helped cross 72%. After funding closes we award the top bid within 24h.", "4h", "a"),
        M("user_demo_investor_001", "Nikhil Rao", "💼", "Great momentum. Will the completion report include the AI before/after match?", "3h", "b"),
        M(ORG.id, ORG.name, ORG.avatar, "Yes — AI verification with before/after photos is part of every completion report.", "3h", "c"),
      ],
      unread: 1,
      updatedAt: iso(180),
    },
    {
      id: "t_inv_002",
      ownerRole: "investor",
      ownerId: "user_demo_investor_001",
      participants: [{ id: "org_pune", name: "Pune Green Together", avatar: "🌳", role: "organization" }],
      topic: {
        type: "campaign",
        id: "cmp_004",
        title: "Community Park Horticulture Revival",
        emoji: "🌳",
        gradient: "linear-gradient(135deg,#22c55e,#15803d)",
        status: "In progress",
      },
      messages: [
        M("org_pune", "Pune Green Together", "🌳", "Native saplings planted — 40 of 60 delivered so far. Progress photos in the portfolio.", "1d", "a"),
      ],
      unread: 0,
      updatedAt: iso(1600),
    },
  ];
}

export function getMessagesMock(role: MessageRole): MessageThread[] {
  switch (role) {
    case "citizen":
      return citizenThreads();
    case "worker":
      return workerThreads();
    case "organization":
      return orgThreads();
    case "investor":
      return investorThreads();
  }
}

export function getThreadMock(id: string, role: MessageRole): MessageThread | undefined {
  return getMessagesMock(role).find((t) => t.id === id);
}
