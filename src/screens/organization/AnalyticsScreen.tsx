import React from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgAnalyticsApi } from "../../api/organizationApi";
import { OrgAnalytics, C } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { Flame, Clock, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

/** Screen 8 — Area Analytics: issue-density heatmap, response stats, category breakdown. */
export const AnalyticsScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data: a } = useFetch<OrgAnalytics>(() => getOrgAnalyticsApi(), []);

  if (!a) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Crunching numbers…</p>
      </div>
    );
  }

  const maxHeat = Math.max(...a.areaHeat.map((h) => h.count));
  const maxCat = Math.max(...a.categoryBreakdown.map((c) => c.count));
  const maxMonthly = Math.max(...a.monthly.map((m) => m.reports));

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Area Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Issue density & municipal performance</p>
        </div>
        <Badge tone="blue">Live</Badge>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Avg response", value: `${a.avgResponseHours}h`, icon: Clock, color: "#f97316" },
          { label: "Completion rate", value: `${a.completionRate}%`, icon: CheckCircle2, color: "#22c55e" },
          { label: "Funded via escrow", value: C(a.totalFunded), icon: TrendingUp, color: "#a855f7" },
          { label: "Open issues", value: a.totalReports - a.resolved, icon: Flame, color: "#3b82f6" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl"
          >
            <s.icon className="w-4 h-4 mb-1.5" style={{ color: s.color }} />
            <div className="text-lg font-extrabold text-white">{s.value}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Issue density heatmap */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Flame className="w-4 h-4 text-rose-400" /> Issue density heatmap
          <span className="text-[10px] text-slate-500 font-normal ml-auto">reports / area · last 90 days</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {a.areaHeat.map((h, i) => {
            const intensity = h.count / maxHeat;
            const heatColor =
              intensity > 0.75 ? "rgba(244,63,94,0.85)" : intensity > 0.5 ? "rgba(249,115,22,0.7)" : intensity > 0.25 ? "rgba(251,191,36,0.6)" : "rgba(34,197,94,0.5)";
            return (
              <motion.div
                key={h.area}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: heatColor }}
              >
                <span className="text-xs font-bold text-white drop-shadow">{h.area}</span>
                <span className="text-[11px] font-mono text-white/90 font-bold">{h.count}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgba(34,197,94,0.5)" }} /> low
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgba(249,115,22,0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "rgba(244,63,94,0.85)" }} /> high
        </div>
      </div>

      {/* Category breakdown */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Category breakdown
        </div>
        {a.categoryBreakdown.map((c, i) => (
          <div key={c.category} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="text-sm">{c.emoji}</span> {c.category}
              </span>
              <span className="text-slate-400 font-mono">{c.count}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${(c.count / maxCat) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-slate-300">Monthly reports vs resolved</div>
        <div className="flex items-end gap-3 h-32">
          {a.monthly.map((m, i) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="text-[9px] text-slate-500 font-mono">{m.reports}</div>
              <div className="w-full flex items-end gap-1">
                <motion.div
                  className="flex-1 rounded-t-md bg-blue-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.reports / maxMonthly) * 70}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
                <motion.div
                  className="flex-1 rounded-t-md bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.resolved / maxMonthly) * 70}%` }}
                  transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
                />
              </div>
              <div className="text-[10px] text-slate-500">{m.month}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" /> Reported</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Resolved</span>
        </div>
      </div>

      {/* Drill to jobs */}
      <button
        onClick={() => go("jobs")}
        className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-bold hover:border-blue-500/40 transition-colors"
      >
        Drill into active jobs →
      </button>
    </div>
  );
};

export default AnalyticsScreen;
