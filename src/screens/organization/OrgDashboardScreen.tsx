import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgDashboard, OrgDashboardPayload } from "../../api/organizationApi";
import { C } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { Inbox, KanbanSquare, Wallet, CheckCircle2, ArrowRight, TrendingUp, ShieldAlert } from "lucide-react";
import { CivicImg } from "../../components/common/CivicImg";

/** Animated number that counts up when scrolled into view. */
const CountUp: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${v.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

/** Screen 1 — Org Dashboard: pending reports, active jobs, funded, completion rate. */
export const OrgDashboardScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data } = useFetch<OrgDashboardPayload>(() => getOrgDashboard(), []);
  const a = data?.analytics ?? null;
  const reports = data?.reports ?? [];

  const pending = reports.filter((r) => r.status === "pending").length;
  const stats = a
    ? [
        { label: "Pending reports", value: pending, icon: Inbox, color: "#f97316", sub: `${(reports || []).length} in system` },
        { label: "Active jobs", value: a.activeJobs, icon: KanbanSquare, color: "#3b82f6", sub: "open → verified" },
        { label: "Total funded", value: a.totalFunded, icon: Wallet, color: "#22c55e", prefix: "₹", sub: "escrow secured" },
        { label: "Completion rate", value: a.completionRate, icon: CheckCircle2, color: "#a855f7", suffix: "%", sub: `avg response ${a.avgResponseHours}h` },
      ]
    : [];

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Municipal Command</h1>
        <p className="text-xs text-slate-400 mt-0.5">Live overview of your jurisdiction · {a ? `${a.resolved}/${a.totalReports} reports resolved` : "loading…"}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${s.color}18` }} />
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span>{s.label}</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending reports strip */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => go("reports")}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-slate-900 border border-blue-500/40 flex items-center gap-3 text-left hover:border-blue-400/60 transition-colors"
      >
        <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
          <Inbox className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            {pending} report(s) awaiting review
            <Badge tone="blue">AI pre-screened</Badge>
          </div>
          <p className="text-[11px] text-slate-400">Photos + AI cost estimates ready — verify in one tap.</p>
        </div>
        <ArrowRight className="w-4 h-4 text-blue-400" />
      </motion.button>

      {/* Recent reports feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Latest incoming reports</span>
          <button onClick={() => go("reports")} className="text-[11px] text-blue-400 font-semibold">View queue →</button>
        </div>
        {(reports || []).slice(0, 3).map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => go("verify", { id: r.id })}
            className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 text-left hover:border-slate-600 transition-colors"
          >
            <span className="w-9 h-9 rounded-xl shrink-0">
              <CivicImg emoji={r.emoji} width={36} height={36} className="w-full h-full rounded-xl" alt={r.title} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{r.title}</div>
              <div className="text-[11px] text-slate-400">{r.area} · {r.submittedAt}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-orange-400">{C(r.aiEstimate)}</div>
              <Badge tone={r.urgency === "High" ? "red" : r.urgency === "Medium" ? "amber" : "slate"}>
                {r.urgency}
              </Badge>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => go("disputes")}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-colors text-left"
        >
          <span className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center mb-2">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <div className="text-xs font-semibold text-slate-200">Dispute resolution</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Flagged jobs & funding issues</div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => go("directory")}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors text-left"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div className="text-xs font-semibold text-slate-200">Worker directory</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ratings & verification status</div>
        </motion.button>
      </div>
    </div>
  );
};

export default OrgDashboardScreen;
