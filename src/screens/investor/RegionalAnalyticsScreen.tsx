import React from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getRegionalImpact, RegionalImpact, fmtMoney } from "../../api/investorApi";
import { StatCard } from "../../components/common/StatCard";
import { Wallet, CheckCircle2, MapPin, Users, TrendingUp } from "lucide-react";
import { Badge } from "../../components/common/Badge";

/** Screen 8 — Regional Impact Analytics. */
export const RegionalAnalyticsScreen: React.FC<NavScreenProps> = () => {
  const { data } = useFetch<RegionalImpact>(() => getRegionalImpact(), []);
  if (!data) return <p className="text-center text-slate-500 text-sm py-10">Loading analytics…</p>;

  const maxMonthly = Math.max(...data.monthly.map((m) => m.amount));
  const maxCat = Math.max(...data.byCategory.map((c) => c.amount), 1);

  return (
    <div className="p-4 space-y-4 sm:mx-auto sm:max-w-5xl sm:px-6">
      <div>
        <h2 className="text-lg font-bold text-white">Regional impact</h2>
        <p className="text-xs text-slate-400">Across all your funded projects</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard label="Total deployed" value={fmtMoney(data.totalDeployed)} accent="#a855f7" sub="released from escrow" />
        <StatCard label="Jobs completed" value={data.jobsCompleted} accent="#22c55e" sub="verified & paid" />
        <StatCard label="Areas improved" value={data.areasImproved} accent="#3b82f6" sub="districts" />
        <StatCard label="Backers reached" value={data.backersReached.toLocaleString()} accent="#f59e0b" sub="citizens engaged" />
      </div>

      {/* Monthly deployment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-purple-400" /> Monthly deployment
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {data.monthly.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-slate-400">{(m.amount / 1000).toFixed(0)}k</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-purple-700 to-fuchsia-500"
                style={{ height: `${(m.amount / maxMonthly) * 100}%` }}
              />
              <span className="text-[10px] text-slate-500">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By category */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="text-xs font-semibold text-slate-300">Deployment by category</div>
        {data.byCategory.map((c) => (
          <div key={c.category}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">{c.category}</span>
              <span className="text-slate-400">{fmtMoney(c.amount)}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-purple-500" style={{ width: `${(c.amount / maxCat) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200">
        <CheckCircle2 className="w-4 h-4" />
        <span><Badge tone="green">100%</Badge> of releases tied to verified completion.</span>
      </div>
    </div>
  );
};

export default RegionalAnalyticsScreen;
