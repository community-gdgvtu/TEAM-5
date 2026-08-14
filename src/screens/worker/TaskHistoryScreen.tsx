import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useApp } from "../../context/AppContext";
import { getTaskHistory, TaskHistoryData, C, WorkerJob } from "../../api/workerApi";
import {
  User,
  Star,
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  BadgeCheck,
  Award,
  MapPin,
  Tag,
  Filter,
  ChevronRight,
  Wallet,
  BarChart3,
  ThumbsUp,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Bookmark,
  Flame,
} from "lucide-react";

type FilterTab = "all" | "completed" | "active" | "bids";

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  open: { text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  bidding: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  active: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  proof: { text: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  verification: { text: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
  completed: { text: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  rejected: { text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
};

const BID_STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  pending: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  awarded: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  rejected: { text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
};

/** Task History — full worker history with user ID, stats, jobs, bids, reviews. */
export const TaskHistoryScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { currentUser } = useApp();
  const [data, setData] = useState<TaskHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getTaskHistory();
      setData(result);
      setLoading(false);
    };
    load();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!data) return [];
    switch (filter) {
      case "completed":
        return data.jobs.filter((j) => j.status === "completed" || j.status === "proof" || j.status === "verification");
      case "active":
        return data.jobs.filter((j) => j.status === "active");
      default:
        return data.jobs;
    }
  }, [data, filter]);

  if (loading) {
    return (
      <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-800 rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-48 bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 pt-4 sm:px-6 pb-4 text-center py-16">
        <p className="text-slate-500 text-sm">Failed to load task history.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      {/* User ID Section */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
      >
        <div className="h-16 bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600" />
        <div className="px-4 pb-4 -mt-8">
          <div className="flex items-end gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-slate-900 flex items-center justify-center text-2xl shrink-0">
              🧑‍🔧
            </div>
            <div className="min-w-0 pt-8">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white truncate">{data.user.name}</h2>
                {data.user.verified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400">Worker ID: {data.workerId}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Briefcase className="w-3 h-3 text-orange-400" />
              <span className="font-semibold">{data.user.skillCategory || "General"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-orange-400" />
              <span>{data.user.location || "India"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <BadgeCheck className="w-3 h-3 text-orange-400" />
              <span>License: {data.user.licenseId || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>Since {data.user.memberSince}</span>
            </div>
          </div>

          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Jobs", value: data.stats.totalJobs, icon: Briefcase, color: "text-blue-400" },
          { label: "Completed", value: data.stats.completedJobs, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Active", value: data.stats.activeJobs, icon: Clock, color: "text-amber-400" },
          { label: "Total Earned", value: C(data.stats.totalEarned), icon: Wallet, color: "text-purple-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center"
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Rating & Acceptance */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            <Star className="w-4 h-4" fill="currentColor" />
            <span className="text-lg font-bold">{data.stats.avgRating}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Avg Rating</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-lg font-bold">{data.stats.acceptanceRate}%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Acceptance</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-bold">{data.stats.responseTime}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Response</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {(["all", "completed", "active", "bids"] as FilterTab[]).map((tab) => {
          const count = tab === "all"
            ? data.jobs.length + data.bids.length
            : tab === "bids"
            ? data.bids.length
            : tab === "completed"
            ? data.jobs.filter((j) => j.status === "completed" || j.status === "proof").length
            : data.jobs.filter((j) => j.status === "active").length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === tab
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Filter className="w-3 h-3" style={{ color: filter === tab ? "#f97316" : undefined }} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="text-[10px] text-slate-500 ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Jobs List */}
      {filter !== "bids" && (
        <div className="space-y-2.5">
          {filteredJobs.map((job, i) => {
            const tone = STATUS_COLORS[job.status] || STATUS_COLORS.open;
            const pct = Math.min(100, Math.round(((job as any).raised || 0) / job.payout * 100));
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => go("detail", { id: job.id })}
                className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600/80 cursor-pointer transition-colors"
              >
                <div
                  className="w-12 shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: job.gradient }}
                >
                  {job.emoji}
                </div>
                <div className="flex-1 min-w-0 px-3 py-2.5">
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] font-bold text-orange-300 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      {C(job.payout)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tone.bg} ${tone.text}`}>
                      {job.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {job.aiConfidence ? `AI ${Math.round(job.aiConfidence * 100)}%` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {job.area}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" /> {job.bidsCount} bids
                    </span>
                  </div>
                </div>
                <div className="flex items-center pr-3">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </motion.div>
            );
          })}
          {filteredJobs.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-8">No {filter} jobs found.</p>
          )}
        </div>
      )}

      {/* Bids List */}
      {filter === "bids" && (
        <div className="space-y-2.5">
          {data.bids.map((bid, i) => {
            const tone = BID_STATUS_COLORS[bid.status] || BID_STATUS_COLORS.pending;
            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: bid.gradient }}
                  >
                    {bid.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">{bid.jobTitle}</h3>
                    <p className="text-[11px] text-slate-400">{bid.org}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-orange-400">{C(bid.quoted)}</div>
                    <div className="text-[10px] text-slate-500">{bid.timelineDays} days</div>
                  </div>
                </div>
                <div className="px-3 pb-2.5 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tone.bg} ${tone.text}`}>
                    {bid.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{bid.submittedAgo}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">AI est. {C(bid.aiEstimate)}</span>
                </div>
                {bid.status === "awarded" && (
                  <button
                    onClick={() => go("active")}
                    className="w-full py-2 bg-emerald-500/10 text-emerald-300 text-xs font-bold border-t border-slate-800 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1"
                  >
                    Open active job <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            );
          })}
          {data.bids.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-8">No bids submitted yet.</p>
          )}
        </div>
      )}

      {/* Reviews */}
      {data.reviews.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 text-amber-400" /> Reviews ({data.reviews.length})
          </h3>
          <div className="space-y-2.5">
            {data.reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{review.avatar}</span>
                  <div>
                    <span className="text-xs font-semibold text-white">{review.author}</span>
                    <span className="text-[10px] text-slate-500 ml-1.5">{review.role}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${j < review.rating ? "text-amber-400" : "text-slate-700"}`}
                        fill={j < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{review.text}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{review.jobTitle}</span>
                  <span>·</span>
                  <span>{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHistoryScreen;
