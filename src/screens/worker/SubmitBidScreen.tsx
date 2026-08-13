import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getJob, submitBid, WorkerJob, C } from "../../api/workerApi";
import { Bot, Clock, CheckCircle2, Send, ShieldCheck } from "lucide-react";

/** Screen 4 — Submit Bid / Tender Comment: worker quotes price + timeline. */
export const SubmitBidScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data: job } = useFetch<WorkerJob | undefined>(() => getJob(params?.id), [params?.id]);
  const [amount, setAmount] = useState<number | null>(null);
  const [timeline, setTimeline] = useState(3);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading job…</p>
      </div>
    );
  }

  const pct = amount ? Math.round((amount / job.aiEstimate) * 100) : 0;
  const inBand = amount !== null && amount >= job.payoutMin && amount <= job.payoutMax;
  const valid = amount !== null && amount > 0 && timeline >= 1 && message.trim().length > 8;

  const submit = () => {
    if (!valid || amount === null) return;
    setSubmitted(true);
    submitBid(job.id, { amount, timeline: `${timeline} days`, message }).then(() => {
      setTimeout(() => go("bidStatus", { highlight: job.id }), 1200);
    });
  };

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Submit Tender Bid</h1>
        <p className="text-xs text-slate-400 mt-0.5">{job.title}</p>
      </div>

      {/* AI band */}
      <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2.5">
        <Bot className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-orange-200 leading-relaxed">
          AI fair-price band: <span className="font-bold text-white">{C(job.payoutMin)} – {C(job.payoutMax)}</span>.
          Quotes inside this band get a priority badge with {job.org.split(" ")[0]}.
        </p>
      </div>

      {/* Quote amount */}
      <div>
        <label htmlFor="quote-amount" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Your quoted price (₹)
        </label>
        <input
          id="quote-amount"
          type="number"
          min={0}
          value={amount ?? ""}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
          placeholder={`AI fair estimate ${C(job.aiEstimate)}`}
          className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
        {amount !== null && (
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">
                {pct <= 100 ? `${pct}% of AI estimate` : `${pct}% above AI estimate`}
              </span>
              <span className={inBand ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                {inBand ? "✓ In fair band" : "Outside band"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${Math.min(100, pct)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ backgroundColor: inBand ? "#f97316" : "#f59e0b" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> Timeline to complete
          </label>
          <span className="text-sm font-bold text-white">{timeline} days</span>
        </div>
        <input
          type="range"
          min={1}
          max={21}
          value={timeline}
          onChange={(e) => setTimeline(Number(e.target.value))}
          className="w-full accent-orange-500"
          aria-label="Timeline in days"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>1 day</span>
          <span>21 days</span>
        </div>
      </div>

      {/* Tender comment */}
      <div>
        <label htmlFor="bid-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Tender comment
        </label>
        <textarea
          id="bid-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your crew, materials, method, and what you'll deliver."
          className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
        />
        <p className="text-[11px] text-slate-500 mt-1">{message.trim().length} chars · be specific — orgs rank detailed bids higher</p>
      </div>

      {/* Escrow note */}
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-200">
          Payout is held in smart escrow and released only after AI photo verification of your completed work.
        </p>
      </div>

      {/* Submit */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-emerald-300">Bid submitted!</p>
            <p className="text-[11px] text-emerald-200">Opening your bid status…</p>
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            whileTap={valid ? { scale: 0.98 } : undefined}
            onClick={submit}
            disabled={!valid}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              valid
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/40"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
            Submit Bid for {amount ? C(amount) : C(job.aiEstimate)}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitBidScreen;
