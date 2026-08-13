import mongoose, { Schema, model } from "mongoose";

export type OrgPermissionLevel = "Admin" | "Verifier" | "Field Officer" | "Viewer";

export interface OrgTeamMember {
  id: string;
  name: string;
  email: string;
  level: OrgPermissionLevel;
  avatar: string;
  lastActive: string;
}

export interface IOrganization {
  id: string;
  orgName: string;
  orgType: string;
  regId: string;
  jurisdiction: string;
  email: string;
  phone: string;
  notifNewReport: boolean;
  notifAiFlag: boolean;
  notifEscrow: boolean;
  notifDispute: boolean;
  notifEmailDigest: boolean;
  autoApproveLowUrgency: boolean;
  team: OrgTeamMember[];
  createdAt: string;
}

const TeamMemberSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    level: { type: String, enum: ["Admin", "Verifier", "Field Officer", "Viewer"], default: "Viewer" },
    avatar: { type: String, default: "" },
    lastActive: { type: String, default: "just added" },
  },
  { _id: false }
);

const OrganizationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    orgName: { type: String, required: true },
    orgType: { type: String, default: "Municipal Corporation" },
    regId: { type: String, required: true, index: true },
    jurisdiction: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    notifNewReport: { type: Boolean, default: true },
    notifAiFlag: { type: Boolean, default: true },
    notifEscrow: { type: Boolean, default: true },
    notifDispute: { type: Boolean, default: true },
    notifEmailDigest: { type: Boolean, default: false },
    autoApproveLowUrgency: { type: Boolean, default: false },
    team: { type: [TeamMemberSchema], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const OrganizationModel = model<IOrganization>("Organization", OrganizationSchema);
export default OrganizationModel;
