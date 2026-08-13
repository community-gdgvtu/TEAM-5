import React from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getPayout, fmtMoney, Campaign } from "../../api/investorApi";
import { CheckCircle2, Wallet, ArrowLeft } from "lucide-react";
import { Badge } from "../../components/common/Badge";

/** Screen 7 — Payout Confirmation. */
export const PayoutConfirmScreen: React.FC<NavScreenProps> = ({ params, go }) => {
  const id = params?.id as string;
  const { data: c } = useFetch<Campaign | undefined>(() => getPayout(id), [id]);

  if (!c || !c.payout) return <p className="text-center text-slate-500 text-sm py-10">No payout yet.</p>;

  const p = c.payout;

  return (
    <div className="p-4 space-y-4 sm:mx-auto sm:max-w-2xl sm:px-6">
      <div className="text-center space-y-2 pt-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Funds released</h2>
        <p className="text-sm text-slate-400">Payout confirmed after AI verification</p>
      </div>

      {/* Receipt */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Amount released</span>
          <span className="text-white font-bold">{fmtMoney(p.released)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">To worker</span>
          <span className="text-slate-200">{p.worker}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Project</span>
          <span className="text-slate-200 text-right flex-1 ml-3 truncate">{c.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Transaction</span>
          <span className="text-slate-200 font-mono text-xs">{p.txnId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Status</span>
          <Badge tone="green">{p.status}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200">
        <Wallet className="w-4 h-4" />
        Released from escrow only after AI matched the completed work photos.
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => go("completion", { id: c.id })}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-semibold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Report
        </button>
        <button
          onClick={() => go("portfolio")}
          className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold"
        >
          Back to portfolio
        </button>
      </div>
    </div>
  );
};

export default PayoutConfirmScreen;
