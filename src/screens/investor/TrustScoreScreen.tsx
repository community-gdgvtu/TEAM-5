import React from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getTrustScore, Campaign } from "../../data/investorMock";
import { ShieldCheck, BadgeCheck, Star, Users, Sparkles, TrendingUp } from "lucide-react";
import { TrustRing } from "../../components/investor/InvestorBits";
import { Badge } from "../../components/common/Badge";

/** Screen 3 — Quality / Trust Score. */
export const TrustScoreScreen: React.FC<NavScreenProps> = ({ params, go }) => {
  const id = params?.id as string;
  const { data: c } = useFetch<Campaign | undefined>(() => getTrustScore(id), [id]);

  if (!c) return <p className="text-center text-slate-500 text-sm py-10">Loading…</p>;

  const workerPct = Math.round((c.workerRating / 5) * 100);
  const orgPct = c.orgVerified ? 96 : 62;
  const aiPct = Math.round(c.aiConfidence * 100);

  const bars = [
    { label: "AI verification confidence", value: aiPct, icon: Sparkles, color: "#a855f7" },
    { label: "Organization track record", value: orgPct, icon: BadgeCheck, color: "#3b82f6" },
    { label: "Worker rating", value: workerPct, icon: Star, color: "#f59e0b" },
    { label: "Community endorsement", value: Math.min(100, Math.round(c.likes / 20)), icon: Users, color: "#22c55e" },
  ];

  return (
    <div className="p-4 space-y-4 sm:mx-auto sm:max-w-2xl sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-5">
        <TrustRing value={c.impactScore} label="TRUST" />
        <div className="flex-1">
          <div className="text-xs text-slate-400">Combined Trust & Quality</div>
          <div className="text-lg font-bold text-white leading-tight">{c.org}</div>
          <div className="flex items-center gap-2 mt-1.5">
            {c.orgVerified ? (
              <Badge tone="blue"><BadgeCheck className="w-3 h-3 mr-1" /> Verified org</Badge>
            ) : (
              <Badge tone="amber">Pending verification</Badge>
            )}
            <Badge tone="purple">{c.category}</Badge>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5">
        <div className="text-xs font-semibold text-slate-300">Score breakdown</div>
        {bars.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Icon className="w-3.5 h-3.5" style={{ color: b.color }} /> {b.label}
                </span>
                <span className="text-slate-400">{b.value}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-xs text-slate-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Past projects</div>
          <div className="text-xl font-bold text-white mt-1">{c.backers > 150 ? 12 : 5}</div>
          <div className="text-[10px] text-slate-500">by this org</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-xs text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> On-time rate</div>
          <div className="text-xl font-bold text-white mt-1">{c.orgVerified ? "98%" : "81%"}</div>
          <div className="text-[10px] text-slate-500">last 12 months</div>
        </div>
      </div>

      <button
        onClick={() => go("fund", { id: c.id })}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/30"
      >
        I'm confident — fund this
      </button>
    </div>
  );
};

export default TrustScoreScreen;
