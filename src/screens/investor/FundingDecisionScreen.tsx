import React, { useState } from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getCampaign, fundCampaignMock, fmtMoney, Campaign } from "../../data/investorMock";
import { Coins, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "../../components/common/Badge";

/** Screen 4 — Funding Decision. */
export const FundingDecisionScreen: React.FC<NavScreenProps> = ({ params, go }) => {
  const id = params?.id as string;
  const bidId = params?.bid as string | undefined;
  const { data: c } = useFetch<Campaign | undefined>(() => getCampaign(id), [id]);

  const bestBid = c?.workerBids.sort((a, b) => a.quotedPrice - b.quotedPrice)[0];
  const preset = bidId
    ? c?.workerBids.find((b) => b.id === bidId)?.quotedPrice
    : bestBid?.quotedPrice;

  const [amount, setAmount] = useState<number>(preset || 5000);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ id: string; amount: number } | null>(null);

  if (!c) return <p className="text-center text-slate-500 text-sm py-10">Loading…</p>;

  const pct = Math.min(100, Math.round((amount / c.targetAmount) * 100));
  const raisedAfter = c.raisedAmount + amount;

  const confirm = async () => {
    setSubmitting(true);
    const res = await fundCampaignMock({ campaignId: c.id, amount });
    setSubmitting(false);
    setDone({ id: res.transaction.id, amount });
  };

  if (done) {
    return (
      <div className="p-6 text-center space-y-4 sm:mx-auto sm:max-w-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Contribution submitted</h2>
        <p className="text-sm text-slate-400">
          You pledged <span className="text-white font-semibold">{fmtMoney(done.amount)}</span> to
        </p>
        <p className="text-purple-300 font-semibold">{c.title}</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
          Transaction <span className="text-slate-200 font-mono">{done.id}</span> · status{" "}
          <Badge tone="amber">Pending escrow</Badge>
        </div>
        <button
          onClick={() => go("portfolio")}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
        >
          View my portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 sm:mx-auto sm:max-w-2xl sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs text-slate-400">You're funding</div>
        <div className="text-base font-bold text-white mt-0.5">{c.title}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge tone="purple">{c.category}</Badge>
          <span className="text-xs text-slate-400">{c.area}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-purple-400" /> Your contribution
        </div>
        <div className="flex items-center gap-2 border border-slate-800 rounded-xl px-3 py-2.5">
          <span className="text-slate-400 text-lg">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="bg-transparent outline-none text-2xl font-bold text-white w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1000, 5000, 10000, 25000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                amount === v ? "bg-purple-600 text-white border-purple-500" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              {fmtMoney(v)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Current raised</span>
          <span className="text-slate-200">{fmtMoney(c.raisedAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">After your pledge</span>
          <span className="text-white font-semibold">{fmtMoney(raisedAfter)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Your share</span>
          <span className="text-purple-300 font-semibold">{pct}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Target</span>
          <span className="text-slate-200">{fmtMoney(c.targetAmount)}</span>
        </div>
      </div>

      {bidId && (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
          <Sparkles className="w-4 h-4 text-purple-300" />
          Accepting worker quote — funds release to the worker only after AI verifies completion.
        </div>
      )}

      <button
        onClick={confirm}
        disabled={submitting || amount <= 0}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/30 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : `Confirm ${fmtMoney(amount)} pledge`}
      </button>
    </div>
  );
};

export default FundingDecisionScreen;
