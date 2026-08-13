import mongoose from "mongoose";
import { env } from "./env";
import UserModelMongo from "../models/User.model";

let mongoConnected = false;

export async function connectMongoDB() {
  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 3000 });
    mongoConnected = true;
    console.log("📦 Connected to MongoDB successfully");
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
  };
  if (!forLean) {
    (shape as any).save = async () => {};
  }
  return shape;
}

const InMemoryUserModel = {
  findOne: (query: any) => {
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