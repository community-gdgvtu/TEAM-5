import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgReports } from "../../api/organizationApi";
import { getLiveReport, OrgReport, C } from "../../data/orgMock";
import { useApp } from "../../context/AppContext";
import { Badge } from "../../components/common/Badge";
import { CivicImg } from "../../components/common/CivicImg";
import {
  Search,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Grid3x3,
  List as ListIcon,
  X,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type View = "grid" | "list";

const CATEGORY_STORIES: { key: string; label: string; emoji: string; gradient: string }[] = [
  { key: "Road", label: "Road", emoji: "🛣️", gradient: "linear-gradient(135deg,#f97316,#ef4444)" },
  { key: "Drainage", label: "Drainage", emoji: "🌧️", gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { key: "Streetlight", label: "Streetlight", emoji: "💡", gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
  { key: "Safety", label: "Safety", emoji: "⚠️", gradient: "linear-gradient(135deg,#ef4444,#7c3aed)" },
  { key: "Green", label: "Green", emoji: "🌳", gradient: "linear-gradient(135deg,#22c55e,#10b981)" },
  { key: "Sanitation", label: "Sanitation", emoji: "🧹", gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
];

/** Deterministic pseudo-engagement so likes/comments look real but stay stable per report. */
const hashId = (s: string) => {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x;
};
const likesFor = (id: string) => 92 + (hashId(id) % 830);
const commentsFor = (id: string) => 3 + (hashId(id) % 24);

const STATUS_META: Record<string, { label: string; tone: "blue" | "green" | "red" }> = {
  pending: { label: "Pending", tone: "blue" },
  approved: { label: "Approved", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

/**
 * 🔵 Organization Reports — Instagram-style section.
 * Stories → IG profile header → highlights → post grid/list. Each report is an
 * IG post; tapping it opens a full post view with an AI-verify action.
 */
export const ReportsQueueScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { currentUser } = useApp();
  const { data } = useFetch<OrgReport[]>(() => getOrgReports(), []);
  const [extra, setExtra] = useState<OrgReport[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("grid");
  const [selected, setSelected] = useState<OrgReport | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      getLiveReport().then((r) => {
        setExtra((prev) => [r, ...prev]);
        setLiveToast(r.id);
        setTimeout(() => setLiveToast((cur) => (cur === r.id ? null : cur)), 3500);
      });
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const all = useMemo(() => [...extra, ...(data || [])], [extra, data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (category !== "All" && r.category !== category) return false;
      if (q && !(r.title + r.area + r.citizenName).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, status, category, query]);

  const counts = useMemo(
    () => ({
      all: all.length,
      pending: all.filter((r) => r.status === "pending").length,
      approved: all.filter((r) => r.status === "approved").length,
      rejected: all.filter((r) => r.status === "rejected").length,
    }),
    [all]
  );

  const firstPending = useMemo(() => all.find((r) => r.status === "pending"), [all]);

  const openPost = (r: OrgReport) => setSelected(r);

  const closePost = () => setSelected(null);

  const verifySelected = () => {
    if (!selected) return;
    const id = selected.id;
    closePost();
    go("verify", { id });
  };

  const initials = (currentUser?.name || "BMC")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="pb-6">
      {/* ================= Stories strip ================= */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 pt-4 pb-2">
        {/* Live story */}
        <button className="shrink-0 flex flex-col items-center gap-1" onClick={() => setStatus("pending")}>
          <span className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-blue-500 via-fuchsia-500 to-orange-400">
            <span className="relative flex w-full h-full rounded-full bg-slate-900 items-center justify-center text-2xl">
              🆕
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-900" />
              </span>
            </span>
          </span>
          <span className="text-[10px] font-semibold text-white">Live</span>
        </button>
        {CATEGORY_STORIES.map((s) => {
          const active = category === s.key;
          const count = all.filter((r) => r.category === s.key).length;
          return (
            <button
              key={s.key}
              className="shrink-0 flex flex-col items-center gap-1"
              onClick={() => setCategory(active ? "All" : s.key)}
            >
              <span
                className={`w-16 h-16 rounded-full p-[2.5px] ${active ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0b0f14]" : ""}`}
                style={{ background: s.gradient }}
              >
                <span className="block w-full h-full rounded-full overflow-hidden">
                  <CivicImg emoji={s.emoji} width={64} height={64} className="w-full h-full rounded-full" alt={s.label} />
                </span>
              </span>
              <span className="text-[10px] font-semibold text-slate-200">{s.label}</span>
              {count > 0 && <span className="-mt-1 text-[9px] text-blue-400">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ================= IG profile header ================= */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-cyan-400 to-fuchsia-500">
              <div className="flex w-full h-full items-center justify-center rounded-full bg-slate-900">
                <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl">
                  {initials}
                </div>
              </div>
            </div>
            <span className="absolute -bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
              <Camera className="h-3 w-3 text-slate-300" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-extrabold text-white truncate">
                {currentUser?.name || "Brihanmumbai Municipal"}
              </h2>
              <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" /> Mumbai, Maharashtra
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {[
                { n: counts.all, label: "Reports" },
                { n: counts.approved, label: "Resolved" },
                { n: counts.pending, label: "Queue" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-base font-extrabold text-white">{s.n}</p>
                  <p className="text-[10px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm font-bold text-white">Brihanmumbai Municipal Corporation</p>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-verified urban repairs · Civic body
          </p>
          <p className="text-[11px] text-blue-400 mt-1">🔗 municipal.gov.in/verify</p>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              if (firstPending) go("verify", { id: firstPending.id });
            }}
            className="flex-1 py-2 rounded-lg text-sm font-bold bg-blue-500 text-white hover:bg-blue-400 transition-colors"
          >
            Review Queue
          </button>
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm font-bold bg-slate-800/70 text-slate-200 border border-slate-700/60 hover:bg-slate-800 transition-colors"
          >
            {view === "grid" ? <ListIcon className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            {view === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      {/* ================= Highlights ================= */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 mt-5">
        {(
          [
            { key: "all", label: "All", emoji: "🗂️", color: "#64748b" },
            { key: "pending", label: "Pending", emoji: "⏳", color: "#3b82f6" },
            { key: "approved", label: "Approved", emoji: "✅", color: "#22c55e" },
            { key: "rejected", label: "Rejected", emoji: "🚫", color: "#ef4444" },
          ] as { key: StatusFilter; label: string; emoji: string; color: string }[]
        ).map((hl) => {
          const active = status === hl.key;
          return (
            <button
              key={hl.key}
              onClick={() => setStatus(active ? "all" : hl.key)}
              className="shrink-0 flex flex-col items-center gap-1"
            >
              <span
                className={`w-14 h-14 rounded-full p-[2px] flex items-center justify-center text-2xl ${active ? "ring-2 ring-blue-400" : ""}`}
                style={{ border: `2px solid ${hl.color}66` }}
              >
                {hl.emoji}
              </span>
              <span className="text-[10px] font-semibold text-slate-300">
                {hl.label} <span className="text-slate-500">({counts[hl.key]})</span>
              </span>
            </button>
          );
        })}
        <span className="ml-auto shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>

      {/* ================= Search + filter chips ================= */}
      <div className="px-4 mt-4 space-y-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, areas, citizens…"
            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f === status ? "all" : f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                status === f
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {f === "all" ? `All (${counts.all})` : `${f[0].toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* ================= Live toast ================= */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            key={liveToast}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className="mx-4 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <p className="text-xs text-emerald-200 flex-1">
              New citizen report detected — <span className="font-semibold text-white">AI estimate ready</span>
            </p>
            <button onClick={() => setLiveToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= Feed body ================= */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-2">🗂️</p>
          <p className="text-sm text-slate-500">No reports match this filter.</p>
        </div>
      ) : view === "grid" ? (
        /* ---------- IG post grid ---------- */
        <div className="grid grid-cols-3 gap-[3px] mt-4">
          {filtered.map((r, i) => {
            const likes = likesFor(r.id);
            return (
              <motion.button
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => openPost(r)}
                className="relative aspect-square overflow-hidden bg-slate-800 group"
              >
                <CivicImg
                  emoji={r.emoji}
                  width={400}
                  height={400}
                  className="w-full h-full"
                  alt={r.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                {/* status ribbon */}
                <span
                  className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${
                    r.status === "pending" ? "bg-blue-400" : r.status === "approved" ? "bg-emerald-400" : "bg-rose-500"
                  }`}
                />
                {/* engagement overlay */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> {likes.toLocaleString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                    <MessageCircle className="w-3 h-3" /> {commentsFor(r.id)}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* ---------- List view ---------- */
        <div className="px-4 mt-4 space-y-3">
          {filtered.map((r, i) => {
            const meta = STATUS_META[r.status];
            return (
              <motion.button
                key={r.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => openPost(r)}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl shrink-0">
                    <CivicImg emoji={r.emoji} width={40} height={40} className="w-full h-full rounded-xl" alt={r.title} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-white leading-snug">{r.title}</h3>
                      <Badge tone={r.urgency === "High" ? "red" : r.urgency === "Medium" ? "amber" : "slate"}>{r.urgency}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{r.area} · by {r.citizenName} · {r.submittedAt}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs font-bold text-orange-400">{C(r.aiEstimate)}</span>
                      <Badge tone="blue">AI {(r.aiConfidence * 100).toFixed(0)}%</Badge>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ================= IG post modal ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={closePost}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md bg-[#0b0f14] sm:rounded-2xl overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              {/* post header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {selected.citizenAvatar || "🧑"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white leading-tight flex items-center gap-1">
                    {selected.citizenName}
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {selected.area} · {selected.location}
                  </p>
                </div>
                <Badge tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</Badge>
                <button onClick={closePost} className="text-slate-400 hover:text-white" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* post image */}
              <div className="relative aspect-square bg-slate-800">
                <CivicImg emoji={selected.emoji} width={600} height={600} className="w-full h-full" alt={selected.title} />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/50 rounded-full px-2.5 py-1 backdrop-blur">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI pre-screened · {(selected.aiConfidence * 100).toFixed(0)}%
                </span>
              </div>

              {/* actions */}
              <div className="flex items-center gap-4 px-4 pt-3">
                <Heart className="w-6 h-6 text-white hover:text-rose-500 cursor-pointer transition-colors" />
                <MessageCircle className="w-6 h-6 text-white hover:text-slate-300 cursor-pointer transition-colors" />
                <Send className="w-6 h-6 text-white hover:text-slate-300 cursor-pointer transition-colors" />
                <Bookmark className="w-6 h-6 text-white ml-auto hover:text-slate-300 cursor-pointer transition-colors" />
              </div>

              {/* likes */}
              <div className="px-4 mt-3">
                <p className="text-sm font-bold text-white">
                  {likesFor(selected.id).toLocaleString("en-IN")} likes
                </p>
              </div>

              {/* caption */}
              <div className="px-4 mt-2 text-sm">
                <p className="text-slate-200 leading-snug">
                  <span className="font-bold text-white">{selected.citizenName}</span>{" "}
                  {selected.title}. Repaired by{" "}
                  <span className="font-bold text-blue-300">@brihanmumbai_municipal</span>
                </p>
                <p className="mt-1 text-xs text-blue-400">
                  #{selected.category.replace(/\s/g, "")} #Mumbai #CivicFix
                </p>
                <p className="mt-1.5 text-[11px] text-slate-500">{selected.submittedAt}</p>
              </div>

              {/* comments */}
              <div className="px-4 mt-3 space-y-2.5 border-t border-slate-800 pt-3">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">🧑‍💼</span>
                  <p className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">A.I. Verifier</span>{" "}
                    {selected.status === "approved"
                      ? "Match confirmed — pushed to the local market for bidding."
                      : selected.status === "rejected"
                        ? "Could not verify — flagged for human review."
                        : "Awaiting the before/after photo for image-match scoring."}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">🏘️</span>
                  <p className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">neighbours_bandra</span> Funded! Please keep us posted 🙏
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">🔧</span>
                  <p className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">rahul_contractor</span> Can take this job this week.
                  </p>
                </div>
              </div>

              {/* add comment bar */}
              <div className="px-4 py-3 flex items-center gap-2 border-t border-slate-800 mt-3">
                <p className="text-sm text-slate-500 flex-1">Add a comment…</p>
                <p className="text-xs font-bold text-blue-400">Post</p>
              </div>

              {/* AI verify CTA */}
              <div className="px-4 pb-5">
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-blue-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> AI Verification
                      </p>
                      <p className="font-mono text-sm font-bold text-white mt-1">
                        {C(selected.aiEstimate)} <span className="text-slate-400 text-xs font-normal">estimate</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-emerald-400">
                        {(selected.aiConfidence * 100).toFixed(0)}%
                      </p>
                      <p className="text-[10px] text-slate-400">match</p>
                    </div>
                  </div>
                  <button
                    onClick={verifySelected}
                    className={`mt-3 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      selected.status === "approved"
                        ? "bg-emerald-500 text-white hover:bg-emerald-400"
                        : selected.status === "rejected"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                          : "bg-blue-500 text-white hover:bg-blue-400"
                    }`}
                  >
                    {selected.status === "approved" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Approved — View in Marketplace
                      </>
                    ) : selected.status === "rejected" ? (
                      <>
                        <XCircle className="w-4 h-4" /> Re-run AI review
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Verify with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsQueueScreen;
