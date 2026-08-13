import { Request, Response } from "express";
import {
  getThreads,
  getThreadById,
  sendThreadMessage,
  MessageRole,
} from "../services/messages.service";

function serialize(thread: any): any {
  return {
    id: thread.id,
    ownerRole: thread.ownerRole,
    ownerId: thread.ownerId,
    participants: thread.participants || [],
    topic: thread.topic || {},
    messages: thread.messages || [],
    unread: thread.unread || 0,
    updatedAt: thread.updatedAt || new Date().toISOString(),
  };
}

export async function listThreads(req: Request, res: Response) {
  const ownerId = (req as any).userId || "user_demo_001";
  const role = ((req.query.role as string) || "citizen") as MessageRole;
  try {
    const threads = await getThreads(role, ownerId);
    return res.json({ threads: threads.map(serialize) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load messages." });
  }
}

export async function getThread(req: Request, res: Response) {
  const { id } = req.params;
  const ownerId = (req as any).userId || "user_demo_001";
  try {
    const thread = await getThreadById(id, ownerId);
    if (!thread) return res.status(404).json({ error: "Thread not found." });
    return res.json({ thread: serialize(thread) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load thread." });
  }
}

export async function sendMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { text } = req.body || {};
  const ownerId = (req as any).userId || "user_demo_001";

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "Message text is required." });
  }

  try {
    const result = await sendThreadMessage(id, ownerId, String(text));
    if (!result) return res.status(404).json({ error: "Thread not found." });
    return res.status(201).json({ message: result.message, thread: serialize(result.thread) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send message." });
  }
}
