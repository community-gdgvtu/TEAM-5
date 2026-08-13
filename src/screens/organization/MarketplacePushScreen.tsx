import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgReport, publishOrgJobApi } from "../../api/organizationApi";
import { OrgReport, C } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { SendToBack, Loader2, CheckCircle2, Users, Wallet, Radar } from "lucide-react";
import { CivicImg } from "../../components/common/CivicImg";

/** Screen 4 — Push to Marketplace: approved issue becomes an open job for workers. */
export const MarketplacePushScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data: report } = useFetch<OrgReport | undefined>(() => getOrgReport(params?.id), [params?.id]);
  const [payout, setPayout] = useState<number | null>(null);
  const [urgency, setUrgency] = useState<"High" | "Medium" | "Low">("High");
  const [visibility, setVisibility] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!report) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  const price = payout ?? report.aiEstimate;
  const valid = price > 0;

  const publish = async () => {
    setPublishing(true);
    try {
      await publishOrgJobApi(report.id, { payout: price, urgency });
      setPublishing(false);
      setPublished(true);
    } catch {
      setPublishing(false);
      setFailed(true);
    }
  };

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Push to Marketplace</h1>
        <p className="text-xs text-slate-400 mt-0.5">Turn this approved report into an open job for local workers.</p>
      </div>

      {/* Summary card */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl shrink-0">
          <CivicImg emoji={report.emoji} width={44} height={44} className="w-full h-full rounded-xl" alt={report.title} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white leading-snug">{report.title}</h3>
          <p className="text-[11px] text-slate-400">{report.area} · {report.location}</p>
        </div>
        <Badge tone="green">Approved</Badge>
      </div>

      {/* Job config */}
      <div className="space-y-4">
        <div>
          <label htmlFor="job-payout" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Job budget / escrow target (₹)
          </label>
          <input
            id="job-payout"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPayout(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <p className="text-[11px] text-slate-500 mt-1">AI suggested {C(report.aiEstimate)} · workers bid inside a fair band around this.</p>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2">Urgency</div>
          <div className="grid grid-cols-3 gap-2">
            {(["High", "Medium", "Low"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  urgency === u
                    ? u === "High"
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                      : u === "Medium"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                        : "bg-slate-700 text-white border-slate-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Radar className="w-4 h-4" />
          </span>
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-200">Notify matched workers</div>
            <p className="text-[10px] text-slate-500">Push alert to workers with matching skills within 5 km</p>
          </div>
          <button
            onClick={() => setVisibility((v) => !v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${visibility ? "bg-blue-500" : "bg-slate-700"}`}
            aria-label="Toggle worker notification"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${visibility ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      {/* What happens next */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Users, label: "Workers bid", color: "#f97316" },
          { icon: Wallet, label: "Escrow funds", color: "#22c55e" },
          { icon: SendToBack, label: "AI verifies", color: "#a855f7" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Publish */}
      <AnimatePresence mode="wait">
        {failed && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-sm text-rose-300 font-semibold text-center"
          >
            Publish failed — the job is already live or the report changed.
          </motion.div>
        )}
        {published ? (
          <motion.div
            key="published"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-emerald-300">Job live on marketplace!</div>
              <p className="text-[11px] text-emerald-200 mt-1">
                {urgency} urgency · {C(price)} escrow · matched workers notified
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => go("jobs")}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-900/30"
              >
                Open Jobs tracker
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => go("reports")}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold hover:bg-slate-700 transition-colors"
              >
                Next report
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="publish"
            whileTap={valid ? { scale: 0.98 } : undefined}
            onClick={publish}
            disabled={!valid || publishing}
            className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              publishing
                ? "bg-slate-800 text-blue-300"
                : valid
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-900/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing to workers…
              </>
            ) : (
              <>
                <SendToBack className="w-4 h-4" /> Publish {C(price)} job to marketplace
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePushScreen;
