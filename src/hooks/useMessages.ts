import { useEffect, useRef, useState } from "react";
import { getMessageThreads, getMessageThread, sendThreadMessage } from "../api/messagesApi";
import type { MessageThread, MessageRole } from "../api/messagesApi";

/**
 * 💬 Inbox state for one role. Polls every 12s so replies from the other side
 * (e.g. an org replying to a citizen) show up without a manual refresh.
 */
export function useMessages(role: MessageRole) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [active, setActive] = useState<MessageThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reload = async () => {
    const list = await getMessageThreads(role);
    setThreads(list);
    setActive((prev) => (prev ? list.find((t) => t.id === prev.id) ?? prev : null));
    setLoading(false);
  };

  const loadThread = async (id: string) => {
    const thread = await getMessageThread(id, role);
    if (thread) setActive(thread);
  };

  useEffect(() => {
    reload();
    pollRef.current = setInterval(reload, 12000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const send = async (text: string) => {
    if (!text.trim() || !active) return;
    setSending(true);
    const res = await sendThreadMessage(active.id, text);
    setSending(false);
    if (res?.thread) {
      setActive(res.thread);
      setThreads((prev) => {
        const rest = prev.filter((t) => t.id !== res.thread.id);
        return [res.thread, ...rest];
      });
    }
  };

  const markRead = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  return { threads, active, loading, sending, reload, loadThread, send, markRead };
}
