import React, { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft, Search, ShieldCheck } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { CivicImg } from "../common/CivicImg";
import type { MessageRole, MessageThread } from "../../data/messagesMock";

const ROLE_ACCENT: Record<MessageRole, string> = {
  citizen: "#22c55e",
  organization: "#3b82f6",
  worker: "#f59e0b",
  investor: "#8b5cf6",
};

const ROLE_GRADIENT: Record<MessageRole, string> = {
  citizen: "linear-gradient(135deg,#22c55e,#16a34a)",
  organization: "linear-gradient(135deg,#3b82f6,#6366f1)",
  worker: "linear-gradient(135deg,#f59e0b,#d97706)",
  investor: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
};

const ROLE_LABEL: Record<MessageRole, string> = {
  citizen: "Citizen",
  organization: "Organization",
  worker: "Worker",
  investor: "Investor",
};

function timeAgo(updatedAt: string, lastTime?: string): string {
  if (lastTime && lastTime !== "now") return lastTime;
  const diff = Date.now() - new Date(updatedAt).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.round(hrs / 24);
  return `${days}d`;
}

/**
 * 💬 Shared Messages inbox — IG-DM style, thread per issue/job/campaign.
 * Two-pane on web (thread list + chat), single pane on mobile. Each role gets
 * its own accent colour; the pinned topic card links back to the item.
 */
export const MessagesScreen: React.FC<{ role: MessageRole; onOpenTopic?: (type: string, id: string) => void }> = ({
  role,
  onOpenTopic,
}) => {
  const accent = ROLE_ACCENT[role];
  const gradient = ROLE_GRADIENT[role];
  const { threads, active, loading, sending, loadThread, send, markRead } = useMessages(role);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [viewingMobile, setViewingMobile] = useState(false);

  useEffect(() => {
    if (active && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [active]);

  const pick = (id: string) => {
    loadThread(id);
    markRead(id);
    setViewingMobile(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    send(draft);
    setDraft("");
  };

  const counterpart = (participants: MessageThread["participants"]) => participants[0]?.name ?? "Civic Fix";

  const threadListInner = (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-extrabold text-white">Inbox</h2>
        <p className="text-xs text-slate-400">Threads about your issues, jobs & campaigns</p>
      </div>
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            placeholder="Search threads…"
            className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 pb-4">
        {loading && threads.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">Loading inbox…</div>
        ) : threads.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">No conversations yet.</div>
        ) : (
          threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            const activeId = active?.id;
            return (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  activeId === t.id ? "bg-slate-800/60" : "hover:bg-slate-800/30"
                }`}
              >
                <span className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <CivicImg emoji={t.topic.emoji} width={40} height={40} className="w-full h-full rounded-full" alt={t.topic.title} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white truncate">{counterpart(t.participants)}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">{timeAgo(t.updatedAt, last?.time)}</span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 truncate">
                      {last?.senderName === "You" ? "You: " : ""}
                      {last?.text ?? "New conversation"}
                    </span>
                    {t.unread > 0 && (
                      <span
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: accent }}
                      >
                        {t.unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  const chatPaneInner = (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {active ? (
        <>
          {/* Pinned topic card */}
          <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/60">
            <button
              onClick={() => setViewingMobile(false)}
              className="sm:hidden inline-flex items-center gap-1 text-slate-400 mb-2"
              aria-label="Back to threads"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">All threads</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                <CivicImg emoji={active.topic.emoji} width={44} height={44} className="w-full h-full rounded-2xl" alt={active.topic.title} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {active.topic.type}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{counterpart(active.participants)}</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug">{active.topic.title}</p>
                {active.topic.status && (
                  <p className="text-[11px] mt-0.5" style={{ color: accent }}>
                    {active.topic.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[40vh] sm:min-h-0">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="text-[11px] text-slate-400 leading-snug">
                Thread pinned to this {active.topic.type} — replies are shared with{" "}
                {counterpart(active.participants)}.
              </p>
            </div>
            {active.messages.map((m) => {
              const mine = m.senderId === active.ownerId || m.senderName === "You";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  {!mine && (
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 self-end">
                      {m.avatar}
                    </span>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                      mine
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md bg-slate-800 text-slate-100"
                    }`}
                    style={mine ? { background: gradient } : undefined}
                  >
                    {!mine && (
                      <p className="text-[10px] font-semibold mb-0.5 text-slate-400">{m.senderName}</p>
                    )}
                    <p className="text-[13px] leading-snug whitespace-pre-wrap">{m.text}</p>
                    <p className={`text-[9px] mt-1 ${mine ? "text-white/70" : "text-slate-500"}`}>{m.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <form onSubmit={submit} className="px-4 py-3 border-t border-slate-800/60 flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${counterpart(active.participants)}…`}
              className="flex-1 bg-slate-800/70 rounded-full px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as any]: accent }}
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
              style={{ background: gradient }}
              aria-label="Send"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 hidden sm:flex items-center justify-center text-slate-500 text-sm">
          Select a thread to start chatting
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-8.5rem)] overflow-hidden">
      <div className={`${viewingMobile ? "hidden" : "flex"} sm:flex flex-col w-full sm:w-72 sm:shrink-0 sm:border-r border-slate-800/60 h-full`}>
        {threadListInner}
      </div>
      <div className={`${viewingMobile ? "flex" : "hidden"} sm:flex flex-1 flex-col min-w-0 h-full`}>
        {chatPaneInner}
      </div>
    </div>
  );
};

export default MessagesScreen;
