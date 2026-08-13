import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgReport, verifyOrgReportApi, publishOrgJobApi } from "../../api/organizationApi";
import { OrgReport, C } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import {
  ScanLine,
  Bot,
  CheckCircle2,
  XCircle,
  StickyNote,
  SendToBack,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { CivicImg } from "../../components/common/CivicImg";

type Phase = "scanning" | "done";

/** Screen 3 — Report Verification: dynamic AI feature detection + approve/reject + notes. */
export const VerifyReportScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data: report } = useFetch<OrgReport | undefined>(() => getOrgReport(params?.id), [params?.id]);
  const [phase, setPhase] = useState<Phase>("scanning");
  const [scanPct, setScanPct] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    if (!decision || !report) return;
    verifyOrgReportApi(report.id, decision, note.trim() || undefined).catch(console.error);
  }, [decision, report, note]);

  useEffect(() => {
    if (!report) return;
    const t = setInterval(() => {
      setScanPct((p) => {
        const next = Math.min(100, p + 5);
        setRevealed(Math.min(report.aiFeatures.length, Math.floor((next / 100) * (report.aiFeatures.length + 1))));
        return next;
      });
    }, 120);
    return () => clearInterval(t);
  }, [report]);

  useEffect(() => {
    if (scanPct >= 100) {
      const id = setTimeout(() => setPhase("done"), 350);
      return () => clearTimeout(id);
    }
  }, [scanPct]);

  if (!report) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading report…</p>
      </div>
    );
  }

  const pushToMarket = () => {
    setPushing(true);
    const urgency = report.urgency;
    const payout = Math.round(report.aiEstimate * 0.92);
    publishOrgJobApi(report.id, { payout, urgency })
      .then(() => go("push", { id: report.id }))
      .catch(() => go("push", { id: report.id }));
  };

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Verify Report</h1>
        <p className="text-xs text-slate-400 mt-0.5">{report.id.toUpperCase()} · {report.area}, {report.location}</p>
      </div>

      {/* Photo evidence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 relative"
      >
        <div className="aspect-[16/9] flex items-center justify-center relative" style={{ background: report.gradient }}>
          <CivicImg emoji={report.emoji} width={120} height={120} className="w-24 h-24 rounded-2xl drop-shadow" alt={report.title} />
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur">
            Citizen evidence · geotagged
          </span>
          <span className="absolute top-3 right-3 text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur">
            {report.citizenAvatar} {report.citizenName}
          </span>
        </div>
      </motion.div>

      {/* AI Feature Detection */}
      <div className="p-4 bg-slate-900 border border-blue-500/30 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-bold text-white">Dynamic Feature Detection</div>
              <p className="text-[11px] text-slate-400">AI reads the photo in real time</p>
            </div>
          </div>
          <Badge tone="blue">{(report.aiConfidence * 100).toFixed(0)}%</Badge>
        </div>

        {phase === "scanning" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-blue-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting damage features… {scanPct}%
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" animate={{ width: `${scanPct}%` }} />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {report.aiFeatures.slice(0, revealed).map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-200">{f.label}</div>
                  <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.confidence > 0.9 ? "#22c55e" : f.confidence > 0.8 ? "#f59e0b" : "#f97316" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(f.confidence * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 w-9 text-right">
                  {(f.confidence * 100).toFixed(0)}%
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI estimate */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs text-slate-400">AI cost estimate</div>
            <div className="text-xl font-extrabold text-white">{C(report.aiEstimate)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500">fair-price band</div>
          <div className="text-xs text-slate-300">{(report.aiEstimate * 0.72).toLocaleString("en-IN")} – {(report.aiEstimate * 1.12).toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Municipal notes */}
      <div>
        <label htmlFor="muni-note" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-blue-400" /> Municipal note (optional)
        </label>
        <textarea
          id="muni-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add inspection note, ward reference, or instruction for the contractor…"
          className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
        />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setDecision("reject")}
          disabled={phase !== "done"}
          className={`py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
            decision === "reject"
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-rose-500/10 text-rose-300 border-rose-500/40 hover:bg-rose-500/20"
          } ${phase !== "done" ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <XCircle className="w-4 h-4" /> Reject
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setDecision("approve")}
          disabled={phase !== "done"}
          className={`py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            decision === "approve"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
              : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/20"
          } ${phase !== "done" ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <CheckCircle2 className="w-4 h-4" /> Approve
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {decision === "approve" && (
          <motion.div
            key="approve"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3"
          >
            <p className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Approved{note.trim() ? " · note saved" : ""} — ready for marketplace
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={pushToMarket}
              disabled={pushing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              {pushing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing job…
                </>
              ) : (
                <>
                  <SendToBack className="w-4 h-4" /> Push to Marketplace as Open Job
                </>
              )}
            </motion.button>
          </motion.div>
        )}
        {decision === "reject" && (
          <motion.div
            key="reject"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-300">Report rejected</p>
              <p className="text-[11px] text-rose-200 mt-0.5">
                The citizen will be notified with your note. Duplicate or false reports can be escalated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyReportScreen;
