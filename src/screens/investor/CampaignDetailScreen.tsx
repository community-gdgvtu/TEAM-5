import React, { useState } from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getCampaign, Campaign } from "../../api/investorApi";
import { BadgeCheck, Star, ShieldCheck, Coins, MessageCircle, Sparkles } from "lucide-react";
import { CampaignCover, FundingMeter, PostActions, TrustRing } from "../../components/investor/InvestorBits";
import { Badge } from "../../components/common/Badge";
import { fmtMoney } from "../../api/investorApi";

/** Screen 2 — Campaign Detail (Investor View). */
export const CampaignDetailScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const id = params?.id as string;
  const { data: c } = useFetch<Campaign | undefined>(() => getCampaign(id), [id]);
  const [tab, setTab] = useState<"overview" | "bids" | "engage">("overview");

  if (!c) return <p className="text-center text-slate-500 text-sm py-10">Loading…</p>;

  const bestBid = [...c.workerBids].sort((a, b) => a.quotedPrice - b.quotedPrice)[0];

  return (
    <div className="pb-4 lg:px-4">
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        {/* Left: header + cover */}
        <div>
          {/* Header row */}
          <div className="flex items-center gap-2.5 p-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: c.gradient }}>
          {c.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-white truncate">{c.org}</span>
            {c.orgVerified && <BadgeCheck className="w-4 h-4 text-sky-400" />}
          </div>
          <p className="text-xs text-slate-400">{c.area} · {c.location}</p>
        </div>
        <button onClick={() => go("trust", { id: c.id })} className="text-xs text-purple-300 font-semibold">
          Trust →
        </button>
      </div>

        <CampaignCover campaign={c} height="h-64 sm:h-80 lg:h-full" />
        </div>

        {/* Right: actions + details */}
        <div className="p-3 space-y-3">
        <PostActions campaign={c} onComment={() => setTab("engage")} onFund={() => go("fund", { id: c.id })} />
        <p className="text-sm text-slate-200">{c.description}</p>

        <FundingMeter campaign={c} />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded-xl p-1">
          {(["overview", "bids", "engage"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t ? "bg-purple-600 text-white" : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <Sparkles className="w-4 h-4 mx-auto text-purple-400" />
                <div className="text-lg font-bold text-white mt-1">{Math.round(c.aiConfidence * 100)}%</div>
                <div className="text-[10px] text-slate-400">AI confidence</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <Star className="w-4 h-4 mx-auto text-amber-400" />
                <div className="text-lg font-bold text-white mt-1">{c.workerRating}</div>
                <div className="text-[10px] text-slate-400">Worker rating</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400" />
                <div className="text-lg font-bold text-white mt-1">{c.impactScore}</div>
                <div className="text-[10px] text-slate-400">Impact</div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="text-xs font-semibold text-slate-300 mb-1">Cost estimate (AI)</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Target</span>
                <span className="text-white font-semibold">{fmtMoney(c.targetAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Lowest worker quote</span>
                <span className="text-white font-semibold">{fmtMoney(bestBid.quotedPrice)}</span>
              </div>
            </div>
            <button
              onClick={() => go("trust", { id: c.id })}
              className="w-full py-2.5 rounded-xl bg-purple-600/15 border border-purple-500/30 text-purple-300 text-sm font-semibold"
            >
              View full Trust & Quality Score →
            </button>
          </div>
        )}

        {tab === "bids" && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Worker bids ({c.workerBids.length})</div>
            {c.workerBids.map((b) => (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{b.worker}</span>
                    {b.verified && <BadgeCheck className="w-4 h-4 text-sky-400" />}
                  </div>
                  <span className="text-sm font-bold text-white">{fmtMoney(b.quotedPrice)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{b.rating}</span>
                  <span>{b.jobsDone} jobs done</span>
                  <span>ETA {b.etaDays}d</span>
                </div>
                <button
                  onClick={() => go("fund", { id: c.id, bid: b.id })}
                  className="mt-2 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold"
                >
                  Accept quote & fund
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "engage" && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Community ({c.comments.length})
            </div>
            {c.comments.map((m, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-base shrink-0">{m.avatar}</div>
                <div className="flex-1">
                  <div className="text-xs">
                    <span className="font-semibold text-white">{m.user}</span> <span className="text-slate-500">· {m.time}</span>
                  </div>
                  <p className="text-sm text-slate-300">{m.text}</p>
                </div>
              </div>
            ))}
            {c.comments.length === 0 && <p className="text-xs text-slate-500">No comments yet — be the first to back it.</p>}
          </div>
        )}

        <button
          onClick={() => go("fund", { id: c.id })}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/30"
        >
          Fund this campaign
        </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailScreen;
