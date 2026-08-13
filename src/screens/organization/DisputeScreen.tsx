import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgDisputesApi, resolveOrgDisputeApi } from "../../api/organizationApi";
import { Dispute } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { Flag, CheckCircle2, RotateCcw, UserX, AlertTriangle } from "lucide-react";

const TYPE_ICON: Record<Dispute["type"], React.ElementType> = {
  "Bad work quality": AlertTriangle,
  "Wrong worker": UserX,
  "Funding issue": Flag,
  "Verification fail": RotateCcw,
};

const SEVERITY_TONE: Record<Dispute["severity"], string> = {
  High: "red",
  Medium: "amber",
  Low: "slate",
};

/** Screen 6 — Dispute Resolution: handle flagged jobs. */
export const DisputeScreen: React.FC<NavScreenProps> = ({ back }) => {
  const { data } = useFetch<Dispute[]>(() => getOrgDisputesApi(), []);
  const [list, setList] = useState<Dispute[] | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const disputes = list ?? data ?? [];
  const filtered = disputes.filter((d) => filter === "all" || d.status === filter);

  const resolve = (id: string) => {
    setList((prev) =>
      (prev ?? data ?? []).map((d) => (d.id === id ? { ...d, status: "resolved" as const } : d))
    );
    resolveOrgDisputeApi(id).catch(console.error);
  };

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dispute Resolution</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {disputes.filter((d) => d.status === "open").length} open · {disputes.filter((d) => d.status === "resolved").length} resolved
          </p>
        </div>
        <button onClick={back} className="text-xs text-slate-400 hover:text-white transition-colors">Close</button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(
          [
            { key: "all", label: "All" },
            { key: "open", label: "Open" },
            { key: "resolved", label: "Resolved" },
          ] as { key: typeof filter; label: string }[]
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f.key
                ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dispute cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((d, i) => {
            const Icon = TYPE_ICON[d.type];
            return (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 bg-slate-900 border rounded-2xl space-y-3 ${
                  d.status === "resolved" ? "border-emerald-500/30 opacity-80" : "border-rose-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: d.gradient }}>
                    {d.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-white leading-snug">{d.jobTitle}</h3>
                      <Badge tone={SEVERITY_TONE[d.severity]}>{d.severity}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {d.raisedBy} · {d.raisedAt} · worker: {d.worker}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <Badge tone="rose-500/10 text-rose-300">{d.type}</Badge>
                  <Badge tone={d.status === "open" ? "red" : "green"}>
                    {d.status === "open" ? "Open" : "Resolved"}
                  </Badge>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{d.summary}</p>

                {d.status === "open" && (
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => resolve(d.id)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Mark resolved
                    </motion.button>
                    <button className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-colors">
                      Escalate to org lead
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 text-sm py-10">No disputes in this view.</p>
      )}
    </div>
  );
};

export default DisputeScreen;
