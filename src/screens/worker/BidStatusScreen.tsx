import React from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getMyBidsMock, MyBid, C } from "../../api/workerApi";
import { Badge } from "../../components/common/Badge";
import { Clock, Hourglass, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

const STATUS_META = {
  pending: { label: "Pending", tone: "amber", icon: Hourglass },
  awarded: { label: "Awarded", tone: "green", icon: CheckCircle2 },
  rejected: { label: "Rejected", tone: "red", icon: XCircle },
} as const;

/** Screen 5 — Bid Status: pending / awarded / rejected tender responses. */
export const BidStatusScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data, loading } = useFetch<MyBid[]>(() => getMyBidsMock(), []);
  const highlightId = params?.highlight;

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">My Bids</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track every tender you've quoted on.</p>
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading bids…</p>}

      <div className="space-y-3">
        {(data || []).map((bid, i) => {
          const meta = STATUS_META[bid.status];
          const Icon = meta.icon;
          const isHighlighted = highlightId === bid.jobId;
          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-slate-900 border rounded-2xl overflow-hidden ${
                isHighlighted ? "border-orange-500/70" : "border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: bid.gradient }}
                >
                  {bid.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white leading-snug">{bid.jobTitle}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{bid.org}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-orange-400">{C(bid.quoted)}</div>
                  <div className="text-[10px] text-slate-500">{bid.timelineDays} days</div>
                </div>
              </div>

              <div className="px-4 pb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" /> {bid.submittedAgo}
                </span>
                <Badge tone={meta.tone}>
                  <span className="inline-flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                </Badge>
                <span className="text-[10px] text-slate-500 ml-auto">
                  AI estimate {C(bid.aiEstimate)}
                </span>
              </div>

              {bid.status === "awarded" && (
                <button
                  onClick={() => go("active")}
                  className="w-full py-2.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold border-t border-slate-800 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  Open active job <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {bid.status === "rejected" && (
                <p className="px-4 py-2 text-[11px] text-slate-500 border-t border-slate-800">
                  Org chose another bid this time — keep quoting, your rating stays strong.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {(data || []).length === 0 && !loading && (
        <p className="text-center text-slate-500 text-sm py-10">No bids yet — head to the marketplace.</p>
      )}
    </div>
  );
};

export default BidStatusScreen;
