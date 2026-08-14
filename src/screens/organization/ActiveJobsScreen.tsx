import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgJobsApi, advanceOrgJobApi } from "../../api/organizationApi";
import { OrgJob, JobStage, C } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { Star, Flag, ChevronRight, User } from "lucide-react";
import { CivicImg } from "../../components/common/CivicImg";
import { STAGE_EMOJI } from "../../data/civicImages";

const STAGES: JobStage[] = ["Open", "Claimed", "InProgress", "Submitted", "Verified"];

const STAGE_COLOR: Record<JobStage, string> = {
  Open: "#f97316",
  Claimed: "#3b82f6",
  InProgress: "#a855f7",
  Submitted: "#f59e0b",
  Verified: "#22c55e",
};

const STAGE_NEXT: Record<JobStage, JobStage> = {
  Open: "Claimed",
  Claimed: "InProgress",
  InProgress: "Submitted",
  Submitted: "Verified",
  Verified: "Verified",
};

/** Screen 5 — Active Jobs Tracker: Kanban Open → Claimed → In Progress → Submitted → Verified. */
export const ActiveJobsScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data } = useFetch<OrgJob[]>(() => getOrgJobsApi(), []);
  const [jobs, setJobs] = useState<OrgJob[] | null>(null);

  const list = jobs ?? data ?? [];
  const advance = (id: string) => {
    setJobs((prev) =>
      (prev ?? data ?? []).map((j) =>
        j.id === id && j.stage !== "Verified" ? { ...j, stage: STAGE_NEXT[j.stage] } : j
      )
    );
    advanceOrgJobApi(id).catch(console.error);
  };

  const byStage = (stage: JobStage) => list.filter((j) => j.stage === stage);

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Active Jobs Tracker</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kanban · tap a card to advance its stage</p>
        </div>
        <Badge tone="blue">{list.length} jobs</Badge>
      </div>

      {/* Kanban columns — horizontally scrollable on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {STAGES.map((stage) => {
          const col = byStage(stage);
          return (
            <div key={stage} className="w-64 shrink-0 snap-start">
              {/* Column header */}
              <div className="flex items-center gap-2 px-1 pb-2">
                <CivicImg emoji={STAGE_EMOJI[stage]} width={24} height={24} className="w-5 h-5 rounded-lg" alt={stage} />
                <span className="text-xs font-bold text-white">{stage}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${STAGE_COLOR[stage]}22`, color: STAGE_COLOR[stage] }}
                >
                  {col.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[120px] bg-slate-900/40 border border-slate-800/60 rounded-2xl p-2">
                <AnimatePresence>
                  {col.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-slate-600 transition-colors"
                      onClick={() => advance(job.id)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{job.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold text-white leading-snug">{job.title}</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">{job.area}</p>
                        </div>
                      </div>

                      {job.worker && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-slate-800/60 rounded-lg px-2 py-1">
                          <User className="w-3 h-3 text-blue-400" />
                          <span className="truncate flex-1">{job.worker}</span>
                          {job.workerRating && (
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-3 h-3" fill="#f59e0b" /> {job.workerRating}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-400">{C(job.payout)}</span>
                        {stage === "Open" ? (
                          <span className="text-[10px] text-slate-500">{job.bidsCount} bids · due {job.dueDate}</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">{job.dueDate ?? "ongoing"}</span>
                        )}
                      </div>

                      {job.stage !== "Verified" ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                          <ChevronRight className="w-3 h-3 text-blue-400" />
                          <span className="font-semibold text-blue-300">Move to {STAGE_NEXT[job.stage]}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 border-t border-slate-800 pt-2">
                          <Star className="w-3 h-3" fill="#22c55e" /> AI verified · escrow released
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {col.length === 0 && (
                  <p className="text-center text-[10px] text-slate-600 py-6">No jobs here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disputes shortcut */}
      <button
        onClick={() => go("disputes")}
        className="w-full p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 hover:bg-rose-500/10 transition-colors flex items-center gap-2.5 text-left"
      >
        <span className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
          <Flag className="w-4 h-4" />
        </span>
        <div className="flex-1">
          <div className="text-xs font-semibold text-slate-200">Flagged jobs & disputes</div>
          <div className="text-[10px] text-slate-500">Bad work, wrong worker, funding issues</div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};

export default ActiveJobsScreen;
