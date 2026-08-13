import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { Bot, Loader2, CheckCircle2, XCircle, ScanLine, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { C } from "../../api/workerApi";

type Phase = "analyzing" | "pass" | "fail";

const CHECKS = [
  "Detecting site region from geo-tags…",
  "Aligning before/after perspective…",
  "Matching damage signature…",
  "Scoring repair completeness…",
];

/** Screen 8 — AI Verification Status: pass / fail / pending on before-after match. */
export const VerificationStatusScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [check, setCheck] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4);
        setCheck(Math.min(CHECKS.length - 1, Math.floor((next / 100) * CHECKS.length)));
        return next;
      });
    }, 120);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const id = setTimeout(() => setPhase("pass"), 400);
      return () => clearTimeout(id);
    }
  }, [progress]);

  const payout = params?.payout ?? 54000;

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">AI Verification</h1>
        <p className="text-xs text-slate-400 mt-0.5">Before-after match on your completion proof.</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "analyzing" ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-center flex-col gap-2">
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center"
              >
                <Bot className="w-7 h-7" />
              </motion.div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <ScanLine className="w-4 h-4 text-orange-400" /> Analyzing proof…
              </div>
            </div>

            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-1.5 min-h-[76px]">
              {CHECKS.map((c, i) => (
                <div
                  key={c}
                  className={`text-[11px] flex items-center gap-2 transition-opacity ${
                    i === check ? "text-orange-300" : i < check ? "text-emerald-400" : "text-slate-600"
                  }`}
                >
                  {i < check ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : i === check ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="w-3 h-3" />
                  )}
                  {c}
                </div>
              ))}
            </div>
          </motion.div>
        ) : phase === "pass" ? (
          <motion.div
            key="pass"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-slate-900 border border-emerald-500/40 rounded-2xl text-center space-y-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-extrabold text-emerald-300">Verification Passed</h2>
                <Badge tone="green">98% match</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                The "after" photo matches the original issue. Escrow is cleared for release.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-slate-800/60 p-3">
                <div className="text-[10px] text-slate-400 uppercase">Payout eligible</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{C(payout)}</div>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-3">
                <div className="text-[10px] text-slate-400 uppercase">Settles in</div>
                <div className="text-lg font-bold text-white mt-0.5">≤ 24 hrs</div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => go("earnings")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <ShieldCheck className="w-4 h-4" /> View wallet & request withdrawal
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="fail"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-slate-900 border border-rose-500/40 rounded-2xl text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-extrabold text-rose-300">Verification Failed</h2>
            <p className="text-xs text-slate-400">
              The AI couldn't confirm the repair matches the issue. Retake the photo from the original angle and resubmit.
            </p>
            <button
              onClick={() => go("upload", { id: params?.id })}
              className="w-full py-3.5 rounded-xl bg-rose-500/15 text-rose-300 text-sm font-bold border border-rose-500/40 hover:bg-rose-500/25 transition-colors"
            >
              Retake photo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationStatusScreen;
