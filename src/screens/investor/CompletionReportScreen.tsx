import React from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getCompletionReport, Campaign } from "../../data/investorMock";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "../../components/common/Badge";

/** Screen 6 — Completion & Verification Report. */
export const CompletionReportScreen: React.FC<NavScreenProps> = ({ params, go }) => {
  const id = params?.id as string;
  const { data: c } = useFetch<Campaign | undefined>(() => getCompletionReport(id), [id]);

  if (!c) return <p className="text-center text-slate-500 text-sm py-10">Loading…</p>;

  const hasBeforeAfter = !!c.beforeAfter;

  return (
    <div className="p-4 space-y-4 sm:mx-auto sm:max-w-3xl sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">{c.title}</span>
        <Badge tone="green"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
      </div>

      {/* Before / After */}
      {hasBeforeAfter ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <div className="h-40 flex items-center justify-center text-6xl" style={{ background: c.gradient, filter: "saturate(0.4) brightness(0.7)" }}>
              {c.emoji}
            </div>
            <div className="p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Before</div>
              <p className="text-xs text-slate-300">{c.beforeAfter!.before}</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-emerald-500/30">
            <div className="h-40 flex items-center justify-center text-6xl" style={{ background: c.gradient }}>
              {c.emoji}
            </div>
            <div className="p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-emerald-400">After</div>
              <p className="text-xs text-slate-300">{c.beforeAfter!.after}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center text-sm text-slate-400">
          Work is still in progress — the AI comparison will appear here once verified.
        </div>
      )}

      {/* AI verification banner */}
      <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
        <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
        <div className="text-xs text-emerald-200">
          <span className="font-semibold">AI verification {Math.round(c.aiConfidence * 100)}%.</span> Before/after
          photos matched the scope; payout released to the worker automatically.
        </div>
      </div>

      {/* Impact summary */}
      {c.impactSummary && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-300 mb-1.5">Impact summary</div>
          <p className="text-sm text-slate-300">{c.impactSummary}</p>
        </div>
      )}

      {c.payout && (
        <button
          onClick={() => go("payout", { id: c.id })}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2"
        >
          View payout confirmation <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CompletionReportScreen;
