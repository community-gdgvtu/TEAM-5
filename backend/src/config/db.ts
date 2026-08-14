import mongoose from "mongoose";
import { env } from "./env";
import UserModelMongo from "../models/User.model";
import { seedDatabase } from "./seed";

let mongoConnected = false;

export async function connectMongoDB() {
  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 15000 });
    mongoConnected = true;
    console.log("📦 Connected to MongoDB successfully");
    await seedDatabase();
  } catch (err: any) {
    console.warn("⚠️ MongoDB connection failed, using in-memory fallback:", err.message);
    mongoConnected = false;
  }
}

export function isMongoConnected() {
  return mongoConnected;
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Retrying in 5 seconds...");
  setTimeout(() => connectMongoDB(), 5000);
});

// ---- In-memory fallback (sprint demo mode: no Mongo available) ----
interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  countryCode: string;
  email: string;
  age: number;
  location: { city: string; state: string; country: string };
  role: "citizen" | "organization" | "worker" | "investor";
  supplementaryData?: Record<string, any>;
  verifiedWhatsApp: boolean;
  verifiedAt: string;
  createdAt: string;
  googleId?: string;
  authProvider?: "google" | "whatsapp";
  avatarUrl?: string;
}

const usersDb: Map<string, UserRecord> = new Map([
  [
    "+919876543210",
    {
      id: "user_citizen_001",
      name: "Ananya Sharma",
      mobile: "9876543210",
      countryCode: "+91",
      email: "ananya.sharma@example.com",
      age: 26,
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      role: "citizen",
      verifiedWhatsApp: true,
      verifiedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
  ],
  [
    "+919811223344",
    {
      id: "user_worker_002",
      name: "Rajesh Verma",
      mobile: "9811223344",
      countryCode: "+91",
      email: "rajesh.verma@example.com",
      age: 34,
      location: { city: "Delhi", state: "Delhi NCR", country: "India" },
      role: "worker",
      supplementaryData: {
        workerSkillCategory: "Electrical & Road Repairs",
        workerLicenseId: "DL-CONT-88912",
      },
      verifiedWhatsApp: true,
      verifiedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
  ],
]);

// Canonical demo accounts mirrored from src/router.tsx `demoUserForRole` so the
// auto-login demo tokens (`civicfix_session_<id>_<ts>`) authenticate even when
// MongoDB is offline. Keys are phone numbers so findOne({mobile}) still works.
function seedInMemoryDemoUsers() {
  const now = new Date().toISOString();
  const seed: UserRecord[] = [
    {
      id: "org_mumbai_001",
      name: "Brihanmumbai Municipal Corporation",
      mobile: "9876500002",
      countryCode: "+91",
      email: "operations@municipal.gov",
      age: 34,
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      role: "organization",
      supplementaryData: { organizationRegId: "MC-MUM-2026-99", organizationType: "Municipal Corporation" },
      verifiedWhatsApp: true,
      verifiedAt: now,
      createdAt: now,
    },
    {
      id: "user_demo_worker_001",
      name: "Rahul Deshmukh",
      mobile: "9876500003",
      countryCode: "+91",
      email: "rahul.works@contractor.in",
      age: 31,
      location: { city: "Bengaluru", state: "Karnataka", country: "India" },
      role: "worker",
      supplementaryData: { workerSkillCategory: "Sanitation & Drainage", workerLicenseId: "TR-5582910" },
      verifiedWhatsApp: true,
      verifiedAt: now,
      createdAt: now,
    },
    {
      id: "user_demo_investor_001",
      name: "Nikhil Rao",
      mobile: "9876500004",
      countryCode: "+91",
      email: "nikhil.rao@invest.in",
      age: 30,
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      role: "investor",
      supplementaryData: { investorEntityName: "Nikhil Rao Capital", investorKycStatus: "Verified Individual" },
      verifiedWhatsApp: true,
      verifiedAt: now,
      createdAt: now,
    },
  ];
  for (const u of seed) {
    const key = `${u.mobile}_${u.countryCode}`;
    if (!usersDb.has(key)) usersDb.set(key, u);
  }
}
seedInMemoryDemoUsers();

/** Mimics the Mongoose User interface so controllers stay Mongo-agnostic. */
function buildInMemoryUser(user: UserRecord, forLean = false) {
  const shape = {
    _id: user.id,
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    countryCode: user.countryCode,
    email: user.email,
    age: user.age,
    location: user.location,
    role: user.role,
    verifiedWhatsApp: user.verifiedWhatsApp,
    verifiedAt: user.verifiedAt,
    createdAt: user.createdAt,
    supplementaryData: user.supplementaryData,
    googleId: user.googleId || "",
    authProvider: user.authProvider || "whatsapp",
    avatarUrl: user.avatarUrl || "",
  };
  if (!forLean) {
    (shape as any).save = async () => {};
  }
  return shape;
}

const InMemoryUserModel = {
  findOne: (query: any) => {
    // Support $or queries (used by Google auth: find by googleId OR email)
    if (query && query.$or && Array.isArray(query.$or)) {
      for (const condition of query.$or) {
        if (condition.googleId) {
          const found = [...usersDb.values()].find((u) => u.googleId === condition.googleId);
          if (found) {
            const shape = buildInMemoryUser(found);
            return { ...shape, lean: () => shape };
          }
        }
        if (condition.email) {
          const found = [...usersDb.values()].find((u) => u.email === condition.email.toLowerCase());
          if (found) {
            const shape = buildInMemoryUser(found);
            return { ...shape, lean: () => shape };
          }
        }
      }
      return null;
    }
    // Support both phone-based lookups (auth controller) and id lookups (auth/role middleware).
    if (query && query.id) {
      const byId = [...usersDb.values()].find((u) => u.id === query.id);
      if (!byId) return null;
      const shape = buildInMemoryUser(byId);
      return {
        ...shape,
        lean: () => shape,
      };
    }
    const phoneKey = `${query.mobile || query.nationalDigits || ""}_${query.countryCode || ""}`;
    const user = usersDb.get(phoneKey);
    if (!user) return null;
    const shape = buildInMemoryUser(user);
    return {
      ...shape,
      lean: () => shape,
    };
  },
  create: async (data: any) => {
    const id = `user_${Date.now()}`;
    const user: UserRecord = {
      id,
      name: data.name || "Civic Citizen",
      mobile: data.mobile || "",
      countryCode: data.countryCode || "+91",
      email: data.email || "",
      age: data.age || 21,
      location: data.location || { city: "Mumbai", state: "Maharashtra", country: "India" },
      role: data.role || "citizen",
      supplementaryData: data.supplementaryData || {},
      verifiedWhatsApp: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      googleId: data.googleId || "",
      authProvider: data.authProvider || "whatsapp",
      avatarUrl: data.avatarUrl || "",
    };
    usersDb.set(`${data.mobile || ""}_${data.countryCode || "+91"}`, user);
    return buildInMemoryUser(user);
  },
};

/**
 * Returns the active User model:
 *  - Mongoose model when MongoDB is connected
 *  - In-memory compatibility model otherwise
 * Typed as `any` since the two implement the same surface but TS can't unify them.
 */
export function getUserModel(): any {
  return isMongoConnected() ? UserModelMongo : InMemoryUserModel;
}