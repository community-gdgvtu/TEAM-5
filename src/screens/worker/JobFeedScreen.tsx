import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOpenJobs, WorkerJob, C } from "../../api/workerApi";
import { useApp } from "../../context/AppContext";
import { Search, MapPin, ArrowUpRight, BadgeCheck, Route } from "lucide-react";

type SortMode = "distance" | "payout" | "urgency";

/** Screen 2 — Job Marketplace Feed: nearby open jobs sorted by distance/payout. */
export const JobFeedScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data, loading } = useFetch<WorkerJob[]>(() => getOpenJobs(), []);
  const { currentUser } = useApp();
  const [sort, setSort] = useState<SortMode>("distance");
  const [query, setQuery] = useState("");

  const skill = currentUser?.supplementaryData?.workerSkillCategory || "";

  const jobs = useMemo(() => {
    const list = [...(data || [])];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((j) => (j.title + j.area + j.category + j.org).toLowerCase().includes(q))
      : list;
    switch (sort) {
      case "payout":
        return filtered.sort((a, b) => b.payout - a.payout);
      case "urgency":
        return filtered.sort((a, b) => order(a.urgency) - order(b.urgency));
      default:
        return filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    }
  }, [data, sort, query]);

  const matched = (data || []).filter((j) => j.category === skill).length;

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Job Marketplace</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {matched} job(s) matched to your skill ·{" "}
          <span className="text-orange-400">{skill || "General Civil Works"}</span>
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, areas, orgs…"
          className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
        />
      </div>

      {/* Sort tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Sort by</span>
        {(
          [
            { key: "distance", label: "Nearest" },
            { key: "payout", label: "Payout" },
            { key: "urgency", label: "Urgency" },
          ] as { key: SortMode; label: string }[]
        ).map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              sort === s.key
                ? "bg-orange-500/15 text-orange-300 border-orange-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading jobs nearby…</p>}

      {/* Job cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {jobs.map((job, i) => (
          <motion.article
            key={job.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => go("detail", { id: job.id })}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/50 transition-colors flex flex-col"
          >
            {/* Cover strip */}
            <div className="h-16 px-4 py-3 flex items-center justify-between relative overflow-hidden" style={{ background: job.gradient }}>
              <span className="text-3xl drop-shadow">{job.emoji}</span>
              <div className="text-right">
                <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider">{job.urgency} priority</div>
                <div className="text-white font-extrabold drop-shadow">{C(job.payout)}</div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2.5 flex-1">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white leading-snug">{job.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[11px] text-slate-400 truncate">{job.org}</span>
                    {job.orgVerified && <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </div>
                </div>
                <span className="w-7 h-7 rounded-full bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {job.distanceKm.toFixed(1)} km · {job.area}
                </span>
                <span className="text-slate-500">{job.postedAgo}</span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800 px-2 py-1 rounded-full">
                  <Route className="w-3 h-3 text-sky-400" />
                  {job.bidsCount} bids
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full">
                  AI {Math.round(job.aiConfidence * 100)}% estimate
                </span>
                <span className={`ml-auto text-[11px] font-bold ${job.funded ? "text-emerald-400" : "text-amber-400"}`}>
                  {job.funded ? "Fully funded" : `${Math.round((job.raised / job.payout) * 100)}% funded`}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {(jobs.length === 0 && !loading) && (
        <p className="text-center text-slate-500 text-sm py-10">No jobs match your filters right now.</p>
      )}
    </div>
  );
};

const order = (u: WorkerJob["urgency"]) => (u === "High" ? 0 : u === "Medium" ? 1 : 2);

export default JobFeedScreen;
