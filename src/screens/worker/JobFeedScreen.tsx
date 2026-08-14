import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOpenJobs, WorkerJob, C } from "../../api/workerApi";
import { useApp } from "../../context/AppContext";
import { CivicImg } from "../../components/common/CivicImg";
import {
  Search,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  MapPin,
  Clock,
  Bookmark,
  BadgeCheck,
  Flame,
  TrendingUp,
  Navigation,
  Hash,
  Info,
  Sparkles,
  History,
  ChevronRight,
} from "lucide-react";

type SortMode = "urgency" | "payout" | "distance";
type Vote = "up" | "down";

const SORT_TABS: { key: SortMode; label: string; icon: React.ElementType }[] = [
  { key: "urgency", label: "Hot", icon: Flame },
  { key: "payout", label: "Top", icon: TrendingUp },
  { key: "distance", label: "Nearby", icon: Navigation },
];

const URGENCY_TONE: Record<WorkerJob["urgency"], { text: string; bg: string }> = {
  High: { text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  Medium: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  Low: { text: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30" },
};

/** 🟠 Job Marketplace — Reddit-style feed: community header, vote columns,
 *  image posts, right-hand "categories / about" sidebar. */
export const JobFeedScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data, loading } = useFetch<WorkerJob[]>(() => getOpenJobs(), []);
  const { currentUser } = useApp();
  const [sort, setSort] = useState<SortMode>("urgency");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const skill = currentUser?.supplementaryData?.workerSkillCategory || "";

  // Stable reddit-style karma base so scores don't jump between renders.
  const baseScore = useMemo(() => {
    const map: Record<string, number> = {};
    (data || []).forEach((j) => {
      map[j.id] = Math.round(j.aiConfidence * 100) + j.bidsCount * 7;
    });
    return map;
  }, [data]);

  const score = (j: WorkerJob) => {
    const v = votes[j.id];
    return baseScore[j.id] + (v === "up" ? 1 : 0) - (v === "down" ? 1 : 0);
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    (data || []).forEach((j) => map.set(j.category, (map.get(j.category) ?? 0) + 1));
    return [...map.entries()];
  }, [data]);

  const jobs = useMemo(() => {
    const list = [...(data || [])];
    const q = query.trim().toLowerCase();
    const filtered = list.filter((j) => {
      if (category !== "all" && j.category !== category) return false;
      if (!q) return true;
      return (j.title + j.area + j.category + j.org).toLowerCase().includes(q);
    });
    switch (sort) {
      case "payout":
        return filtered.sort((a, b) => b.payout - a.payout);
      case "distance":
        return filtered.sort((a, b) => a.distanceKm - b.distanceKm);
      default:
        return filtered.sort((a, b) => order(a.urgency) - order(b.urgency));
    }
  }, [data, sort, query, category]);

  const matched = (data || []).filter((j) => j.category === skill).length;
  const avgPayout = useMemo(
    () => (data?.length ? Math.round(data.reduce((s, j) => s + j.payout, 0) / data.length) : 0),
    [data]
  );

  const toggleVote = (id: string, v: Vote) =>
    setVotes((prev) => {
      const next = { ...prev };
      if (next[id] === v) delete next[id];
      else next[id] = v;
      return next;
    });

  const toggleSave = (id: string) => setSaved((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4">
      {/* ── Subreddit-style community header ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-lg border border-slate-800"
      >
        <div className="h-14 sm:h-16 bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600" />
        <div className="bg-slate-900 px-3 sm:px-4 py-2.5 flex items-center gap-2.5 sm:gap-3">
          <span className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-lg sm:text-xl">
            🛠️
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">r/CivicFixMarket</span>
              <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Citizen-funded jobs · AI cost-estimated · escrow-backed
            </p>
          </div>
          <span className="ml-auto shrink-0 hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/40 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> {data?.length ?? 0} open
          </span>
        </div>
      </motion.div>

      <div className="mt-4 flex items-start gap-6">
        {/* ── Main feed column ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 focus-within:border-slate-600">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, areas, orgs…"
              className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-700/50">
                Clear
              </button>
            )}
          </div>

          {/* Sort bar (reddit hot/new/top) */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
            {SORT_TABS.map((s) => {
              const Icon = s.icon;
              const active = sort === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: active ? "#f97316" : undefined }} />
                  {s.label}
                </button>
              );
            })}
            <span className="ml-auto text-[11px] text-slate-500 hidden sm:block">
              {matched} matched to <span className="text-orange-400 font-semibold">{skill.split(" & ")[0] || "your skill"}</span>
            </span>
          </div>

          {loading && <p className="text-center text-slate-500 text-sm py-10">Loading jobs nearby…</p>}

          {/* Post cards */}
          <div className="space-y-2.5">
            {jobs.map((job, i) => {
              const v = votes[job.id];
              const s = score(job);
              const savedByMe = !!saved[job.id];
              const tone = URGENCY_TONE[job.urgency];
              const pct = Math.min(100, Math.round((job.raised / job.payout) * 100));
              return (
                <motion.article
                  key={job.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group flex bg-slate-900 border border-slate-800 rounded-md overflow-hidden hover:border-slate-600/80 hover:bg-slate-900/80 cursor-pointer transition-colors"
                  onClick={() => go("detail", { id: job.id })}
                >
                  {/* Vote column (desktop) */}
                  <div className="hidden lg:flex flex-col items-center gap-0.5 w-10 py-2.5 bg-slate-950/60 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVote(job.id, "up"); }}
                      aria-label="Upvote"
                      className={`transition-colors ${v === "up" ? "text-orange-500" : "text-slate-600 group-hover:text-slate-400 hover:text-orange-500"}`}
                    >
                      <ArrowBigUp className="w-5 h-5" fill={v === "up" ? "currentColor" : "none"} />
                    </button>
                    <span className={`text-[11px] font-bold tabular-nums ${v === "up" ? "text-orange-500" : v === "down" ? "text-indigo-400" : "text-slate-400"}`}>
                      {s}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVote(job.id, "down"); }}
                      aria-label="Downvote"
                      className={`transition-colors ${v === "down" ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400 hover:text-indigo-400"}`}
                    >
                      <ArrowBigDown className="w-5 h-5" fill={v === "down" ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Community header */}
                    <div className="flex items-center gap-1.5 px-3 pt-2.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                        style={{ background: job.gradient }}
                      >
                        {job.emoji}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        r/{job.org.split(" ")[0]}{job.org.includes(" ") ? "" : job.org}
                      </span>
                      {job.orgVerified && <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      <span className="hidden sm:inline text-[11px] text-slate-500 truncate">
                        · posted by {job.orgVerified ? "u/verified-org" : "u/community"} · {job.postedAgo}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="px-3 pt-1.5 text-sm sm:text-[15px] font-semibold text-slate-100 leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Meta pills */}
                    <div className="flex flex-wrap items-center gap-1.5 px-3 pt-2">
                      <span className="text-[11px] font-bold text-orange-300 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full">
                        {C(job.payout)}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tone.bg} ${tone.text}`}>
                        {job.urgency} priority
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        job.funded ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" : "text-amber-300 bg-amber-500/10 border-amber-500/30"
                      }`}>
                        {job.funded ? "Fully funded" : `${pct}% funded`}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/50">
                        AI {Math.round(job.aiConfidence * 100)}%
                      </span>
                    </div>

                    {/* Image */}
                    <div className="px-3 mt-2.5">
                      <div className="rounded-md overflow-hidden aspect-[16/8] bg-slate-800">
                        <CivicImg emoji={job.emoji} width={800} height={400} className="w-full h-full object-cover" alt={job.title} />
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center gap-3 sm:gap-4 px-3 py-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 hover:text-slate-200 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {job.bidsCount} bids
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" /> {job.distanceKm.toFixed(1)} km · {job.area}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {job.postedAgo}
                      </span>

                      {/* Mobile votes */}
                      <span className="ml-auto flex items-center gap-1 lg:hidden">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVote(job.id, "up"); }}
                          aria-label="Upvote"
                          className={`transition-colors ${v === "up" ? "text-orange-500" : "text-slate-500 hover:text-orange-400"}`}
                        >
                          <ArrowBigUp className="w-4 h-4" fill={v === "up" ? "currentColor" : "none"} />
                        </button>
                        <span className={`text-xs font-bold tabular-nums ${v === "up" ? "text-orange-500" : v === "down" ? "text-indigo-400" : "text-slate-300"}`}>
                          {s}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVote(job.id, "down"); }}
                          aria-label="Downvote"
                          className={`transition-colors ${v === "down" ? "text-indigo-400" : "text-slate-500 hover:text-indigo-400"}`}
                        >
                          <ArrowBigDown className="w-4 h-4" fill={v === "down" ? "currentColor" : "none"} />
                        </button>
                      </span>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                        aria-label="Save"
                        className={`ml-auto lg:ml-0 flex items-center gap-1 transition-colors ${
                          savedByMe ? "text-orange-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={savedByMe ? "currentColor" : "none"} />
                        <span className="hidden sm:inline">{savedByMe ? "Saved" : "Save"}</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {jobs.length === 0 && !loading && (
            <p className="text-center text-slate-500 text-sm py-12">
              No jobs match {category !== "all" ? "this category" : "your filters"} right now.
            </p>
          )}
        </div>

        {/* ── Right sidebar (desktop) ─────────────────────────────── */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          {/* Your skill */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Your skill
            </div>
            <p className="text-[13px] text-slate-300 leading-snug">
              <span className="text-orange-400 font-semibold">{skill || "General Civil Works"}</span>
            </p>
            <p className="mt-1.5 text-[11px] text-slate-500">{matched} open job(s) matched for you.</p>
          </div>

          {/* Task History */}
          <button
            onClick={() => go("taskHistory")}
            className="w-full bg-slate-900 border border-slate-800 rounded-md p-4 text-left hover:border-orange-500/50 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
              <History className="w-3.5 h-3.5 text-orange-400" /> Task History
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
              View all your past jobs, bids, reviews, and earnings.
            </p>
            <div className="mt-2 text-[10px] font-semibold text-orange-400 group-hover:text-orange-300 flex items-center gap-1">
              Open history <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          {/* Categories = communities */}
          <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Hash className="w-3.5 h-3.5 text-orange-400" /> Categories
            </div>
            <button
              onClick={() => setCategory("all")}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors ${
                category === "all" ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px]">🌐</span>
              <span className="font-semibold truncate">All jobs</span>
              <span className="ml-auto text-[11px] text-slate-500 tabular-nums">{data?.length ?? 0}</span>
            </button>
            {categories.map(([name, count]) => {
              const emoji = (data || []).find((j) => j.category === name)?.emoji ?? "🗂️";
              return (
                <button
                  key={name}
                  onClick={() => setCategory(category === name ? "all" : name)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors ${
                    category === name ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px]">{emoji}</span>
                  <span className="font-medium truncate">{name}</span>
                  <span className="ml-auto text-[11px] text-slate-500 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>

          {/* About */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2.5">
              <Info className="w-3.5 h-3.5 text-orange-400" /> About this market
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Jobs raised by citizens, cost-estimated by AI, paid through escrow. Bid smart and get verified proof-gated payouts.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-slate-800/60 py-2">
                <div className="text-sm font-bold text-white">{data?.length ?? 0}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Open</div>
              </div>
              <div className="rounded-md bg-slate-800/60 py-2">
                <div className="text-sm font-bold text-white">{C(avgPayout)}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Avg pay</div>
              </div>
              <div className="rounded-md bg-slate-800/60 py-2">
                <div className="text-sm font-bold text-white">{data?.length ? (data.reduce((s, j) => s + j.distanceKm, 0) / data.length).toFixed(1) : "0"}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Avg km</div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-600">Created Aug 2026 · India Civic Works</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const order = (u: WorkerJob["urgency"]) => (u === "High" ? 0 : u === "Medium" ? 1 : 2);

export default JobFeedScreen;
