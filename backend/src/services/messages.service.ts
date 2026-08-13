import { ThreadModel, IThread, ThreadMessage } from "../models/Message.model";
import { isMongoConnected } from "../config/db";
import { demoOrganization, demoWorkerProfile } from "../config/demoData";

export type MessageRole = "citizen" | "organization" | "worker" | "investor";

const ORG = { id: "org_mumbai_001", name: demoOrganization.orgName, avatar: "🏛️", role: "organization" as const };
const WORKER = { id: "user_demo_worker_001", name: demoWorkerProfile.name, avatar: "🧑‍🔧", role: "worker" as const };

let msg = (senderId: string, senderName: string, avatar: string, text: string, time: string): ThreadMessage => ({
  id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  senderId,
  senderName,
  avatar,
  text,
  time,
  createdAt: new Date().toISOString(),
});

const M = msg; // alias

/**
 * 🌐 Demo thread seeds — one inbox per role. Threads are per-issue/job/campaign,
 * exactly like the v2 "Messages = DM inbox, thread per topic" pattern.
 */
export function buildDemoThreads(role: MessageRole): IThread[] {
  const now = Date.now();
  const iso = (offsetMin: number) => new Date(now - offsetMin * 60000).toISOString();

  switch (role) {
    case "citizen":
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
            M("org_mumbai_001", ORG.name, ORG.avatar, "Hi Ananya, thanks for reporting. We've verified the pothole photos — pushing this to the repair marketplace now.", "2h"),
            M("user_citizen_001", "Ananya Sharma", "🧕", "Thank you! Please prioritize it — two-wheelers keep skidding here.", "1h"),
            M("org_mumbai_001", ORG.name, ORG.avatar, "Done ✅ It's live on the marketplace with a ₹85,000 target and AI cost estimate.", "45m"),
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
            M("user_demo_worker_001", WORKER.name, WORKER.avatar, "Hi Ananya, the toilet block is cleaned and sanitised. After-photo uploaded for AI verification.", "6h"),
            M("user_citizen_001", "Ananya Sharma", "🧕", "That was fast! The daily-wage workers will be relieved. 🙏", "5h"),
          ],
          unread: 0,
          updatedAt: iso(300),
        },
      ];
    case "worker":
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
            M("org_mumbai_001", ORG.name, ORG.avatar, "Hi Rahul, we've opened bidding on the Andheri resurfacing job. Your quote of ₹82,000 with 2-day ETA looks strong.", "3h"),
            M("user_demo_worker_001", WORKER.name, WORKER.avatar, "Thanks! I can start within 48h of award — night shifts to avoid traffic.", "2h"),
            M("org_mumbai_001", ORG.name, ORG.avatar, "Noted. Decision expected today after funding closes.", "1h"),
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
            M("citizen_rep_006", "Anita K.", "👩", "Rahul, the drain is clear and the street is dry — thank you and the crew!", "1d"),
            M("user_demo_worker_001", WORKER.name, WORKER.avatar, "Happy to help! After-photo is with AI verification now. Should pass within the day.", "1d"),
          ],
          unread: 0,
          updatedAt: iso(1500),
        },
      ];
    case "organization":
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
            M("citizen_rep_001", "Priya M.", "🧕", "Please expedite — my scooter got damaged here last week.", "3h"),
            M("org_mumbai_001", ORG.name, ORG.avatar, "Understood Priya. Report approved, campaign live with ₹85,000 target. We'll keep you posted.", "2h"),
            M("citizen_rep_001", "Priya M.", "🧕", "Appreciated 🙌", "2h"),
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
            M("user_demo_worker_001", WORKER.name, WORKER.avatar, "Submitting bid: ₹82,000, 2-day ETA, night shifts.", "2h"),
            M("org_mumbai_001", ORG.name, ORG.avatar, "Received. Your rating and verified license help your case.", "1h"),
          ],
          unread: 0,
          updatedAt: iso(90),
        },
      ];
    case "investor":
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
            M("org_mumbai_001", ORG.name, ORG.avatar, "Hi, your ₹10,000 contribution helped cross 72%. After funding closes we award the top bid within 24h.", "4h"),
            M("user_demo_investor_001", "Nikhil Rao", "💼", "Great momentum. Will the completion report include the AI before/after match?", "3h"),
            M("org_mumbai_001", ORG.name, ORG.avatar, "Yes — AI verification with before/after photos is part of every completion report.", "3h"),
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
            M("org_pune", "Pune Green Together", "🌳", "Native saplings planted — 40 of 60 delivered so far. Progress photos in the portfolio.", "1d"),
          ],
          unread: 0,
          updatedAt: iso(1600),
        },
      ];
  }
}

let fallbackThreads: Record<string, IThread[]> = {};

function threadKey(role: MessageRole, ownerId: string) {
  return `${role}:${ownerId}`;
}

function getFallback(role: MessageRole, ownerId: string): IThread[] {
  const key = threadKey(role, ownerId);
  if (!fallbackThreads[key]) fallbackThreads[key] = buildDemoThreads(role);
  return fallbackThreads[key];
}

function sortThreads(threads: IThread[]): IThread[] {
  return [...threads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getThreads(role: MessageRole, ownerId: string): Promise<IThread[]> {
  if (!isMongoConnected()) return sortThreads(getFallback(role, ownerId));
  try {
    const threads = await ThreadModel.find({ ownerRole: role, ownerId }).lean();
    if (threads.length) return sortThreads(threads as IThread[]);
    const fallback = buildDemoThreads(role);
    await ThreadModel.insertMany(fallback);
    return sortThreads(fallback);
  } catch {
    return sortThreads(getFallback(role, ownerId));
  }
}

export async function getThreadById(id: string, ownerId: string): Promise<IThread | null> {
  if (!isMongoConnected()) {
    for (const threads of Object.values(fallbackThreads)) {
      const t = threads.find((th) => th.id === id);
      if (t) return t;
    }
    return null;
  }
  try {
    const thread = await ThreadModel.findOne({ id, ownerId }).lean();
    return (thread as IThread) || null;
  } catch {
    return null;
  }
}

export async function sendThreadMessage(
  id: string,
  ownerId: string,
  text: string
): Promise<{ thread: IThread; message: ThreadMessage } | null> {
  const message: ThreadMessage = {
    id: `m_${Date.now()}`,
    senderId: ownerId,
    senderName: "You",
    avatar: "🙂",
    text: String(text).trim(),
    time: "now",
    createdAt: new Date().toISOString(),
  };

  if (!isMongoConnected()) {
    for (const threads of Object.values(fallbackThreads)) {
      const t = threads.find((th) => th.id === id);
      if (t) {
        t.messages.push(message);
        t.updatedAt = message.createdAt;
        return { thread: t, message };
      }
    }
    return null;
  }

  try {
    const thread = await ThreadModel.findOne({ id, ownerId });
    if (!thread) return null;
    thread.messages.push(message as any);
    thread.updatedAt = message.createdAt;
    await thread.save();
    return { thread: thread.toObject() as IThread, message };
  } catch {
    return null;
  }
}
