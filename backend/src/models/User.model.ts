import mongoose, { Schema, model } from "mongoose";

export interface IUserProfile {
  id: string;
  name: string;
  mobile: string;
  countryCode: string;
  email: string;
  age: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  role: "citizen" | "organization" | "worker" | "investor";
  verifiedWhatsApp: boolean;
  verifiedAt: string;
  createdAt: string;
  supplementaryData?: {
    organizationRegId?: string;
    organizationType?: string;
    workerSkillCategory?: string;
    workerLicenseId?: string;
    investorEntityName?: string;
    investorKycStatus?: string;
  };
  /** Org role — worker directory fields (additive, optional). */
  workerStatus?: "available" | "on-job" | "suspended";
  workerRating?: number;
  workerJobsDone?: number;
  workerVerified?: boolean;
}

export interface IUserDocument extends IUserProfile {
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    mobile: { type: String, required: [true, "Mobile number is required"], trim: true },
    countryCode: { type: String, default: "+91" },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    age: { type: Number, required: [true, "Age is required"], min: [18, "Minimum age is 18"] },
    location: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
    role: { type: String, enum: ["citizen", "organization", "worker", "investor"], required: true },
    verifiedWhatsApp: { type: Boolean, default: false },
    verifiedAt: { type: String },
    createdAt: { type: String },
    supplementaryData: { type: Schema.Types.Mixed, default: {} },
    workerStatus: { type: String, enum: ["available", "on-job", "suspended"], default: "available" },
    workerRating: { type: Number, min: 0, max: 5, default: 4.5 },
    workerJobsDone: { type: Number, default: 0 },
    workerVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>("User", UserSchema);
export default UserModel;