import { Schema, model } from "mongoose";

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

export interface IThread {
  id: string;
  /** The role that "owns" this inbox (which side the demo user sees). */
  ownerRole: "citizen" | "organization" | "worker" | "investor";
  /** The demo user id this thread belongs to. */
  ownerId: string;
  participants: ThreadParticipant[];
  /** Pinned topic the thread is about (issue / job / campaign). */
  topic: TopicRef;
  messages: ThreadMessage[];
  unread: number;
  updatedAt: string;
}

const ParticipantSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "🙂" },
    role: { type: String, enum: ["citizen", "organization", "worker", "investor"], default: "citizen" },
  },
  { _id: false }
);

const TopicSchema: Schema = new Schema(
  {
    type: { type: String, enum: ["issue", "job", "campaign"], required: true },
    id: { type: String, required: true },
    title: { type: String, required: true },
    emoji: { type: String, default: "🛠️" },
    gradient: { type: String, default: "linear-gradient(135deg,#3b82f6,#6366f1)" },
    status: { type: String },
  },
  { _id: false }
);

const MessageSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    avatar: { type: String, default: "🙂" },
    text: { type: String, required: true },
    time: { type: String, default: "now" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const ThreadSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    ownerRole: { type: String, enum: ["citizen", "organization", "worker", "investor"], index: true },
    ownerId: { type: String, index: true },
    participants: { type: [ParticipantSchema], default: [] },
    topic: { type: TopicSchema, required: true },
    messages: { type: [MessageSchema], default: [] },
    unread: { type: Number, default: 0 },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

ThreadSchema.index({ ownerId: 1, updatedAt: -1 });

export const ThreadModel = model<IThread>("Thread", ThreadSchema);
export default ThreadModel;
