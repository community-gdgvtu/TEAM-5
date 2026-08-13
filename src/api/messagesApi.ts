import { apiFetch, withFallback, getDemoSessionToken } from "./index";
import { getMessagesMock, getThreadMock } from "../data/messagesMock";
import type { MessageThread, MessageThread as Thread, ThreadMessage, MessageRole } from "../data/messagesMock";

export type { MessageThread, ThreadMessage, MessageRole };

/**
 * 💬 Messages API client — inbox threads per issue/job/campaign.
 * Falls back to the per-role mock when the backend is offline.
 */

export async function getMessageThreads(role: MessageRole): Promise<MessageThread[]> {
  const res = await withFallback<{ threads: any[] }>(
    apiFetch(`/api/messages?role=${role}`),
    { threads: getMessagesMock(role) }
  );
  return (res.threads || []).map((t) => ({
    ...t,
    messages: (t.messages || []).map((m: any) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.senderName,
      avatar: m.avatar || "🙂",
      text: m.text,
      time: m.time,
      createdAt: m.createdAt,
    })),
  }));
}

export async function getMessageThread(id: string, role: MessageRole): Promise<Thread | null> {
  const res = await withFallback<{ thread: any } | null>(
    apiFetch(`/api/messages/${id}`),
    (() => {
      const t = getThreadMock(id, role);
      return t ? { thread: t } : null;
    })()
  );
  return res?.thread ? (res.thread as Thread) : null;
}

export async function sendThreadMessage(
  id: string,
  text: string
): Promise<{ thread: Thread; message: ThreadMessage } | null> {
  return withFallback<{ thread: Thread; message: ThreadMessage } | null>(
    apiFetch(`/api/messages/${id}/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify({ text }),
    }),
    (() => {
      const thread = getThreadMock(id, "citizen") ?? getThreadMock(id, "worker") ?? getThreadMock(id, "organization") ?? getThreadMock(id, "investor");
      if (!thread) return null;
      const message: ThreadMessage = {
        id: `m_${Date.now()}`,
        senderId: "user_demo_001",
        senderName: "You",
        avatar: "🙂",
        text,
        time: "now",
        createdAt: new Date().toISOString(),
      };
      return { thread: { ...thread, messages: [...thread.messages, message] }, message };
    })()
  );
}
