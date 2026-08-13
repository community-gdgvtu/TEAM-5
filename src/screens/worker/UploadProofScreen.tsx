import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getActiveJobs, uploadProof, ActiveJob, C } from "../../api/workerApi";
import { Camera, ImagePlus, Lock, CheckCircle2, Sparkles } from "lucide-react";

/** Screen 7 — Upload Completion Proof: mandatory "after" photo before payout. */
export const UploadProofScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data } = useFetch<ActiveJob[]>(() => getActiveJobs(), []);
  const job = data?.[0] || null;
  const [captured, setCaptured] = useState(false);
  const [flash, setFlash] = useState(false);
  const [capturePulse, setCapturePulse] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const capture = () => {
    setFlash(true);
    setCapturePulse((p) => p + 1);
    setTimeout(() => {
      setCaptured(true);
      setFlash(false);
    }, 450);
  };

  const submit = () => {
    setSubmitting(true);
    if (job) {
      uploadProof(job.id, { afterPhotoUrl: "captured://after-photo" }).then(() => {
        setSubmitting(false);
        setDone(true);
        setTimeout(() => go("verification", { id: job.id }), 1400);
      });
    } else {
      setTimeout(() => {
        setSubmitting(false);
        setDone(true);
      }, 1600);
    }
  };

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Completion Proof</h1>
        <p className="text-xs text-slate-400 mt-0.5">{job ? job.title : "Loading…"}</p>
      </div>

      {/* Lock note */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-200">
          Payout requests stay locked until an "after" photo is uploaded. It is matched against the original issue by AI.
        </p>
      </div>

      {/* Camera viewport */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 relative">
        <div className="relative aspect-[4/3] flex flex-col items-center justify-center overflow-hidden">
          {captured ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#14532d,#0f172a)" }}>
              <span className="text-6xl mb-2">📸</span>
              <p className="text-sm font-bold text-emerald-300">After photo captured</p>
              <p className="text-[11px] text-slate-400 mt-0.5">geotagged · {new Date().toLocaleTimeString()}</p>
              <button onClick={capture} className="mt-3 text-[11px] text-slate-400 underline underline-offset-2">
                Retake photo
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-500/60 flex items-center justify-center mb-3">
                <Camera className="w-7 h-7 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Point camera at the fixed site</p>
              <p className="text-[11px] text-slate-500 mt-1">Aim for the same angle as the "before" photo</p>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">GPS ON</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">timestamped</span>
              </div>
            </div>
          )}

          {/* viewfinder corners */}
          <div className="pointer-events-none absolute inset-0 p-4">
            <div className="w-full h-full border-2 border-white/25 rounded-xl"></div>
          </div>

          {/* flash overlay */}
          <AnimatePresence>
            {flash && (
              <motion.div
                key="flash"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white z-10"
              />
            )}
          </AnimatePresence>
        </div>

        {/* shutter */}
        <div className="p-3 flex items-center justify-center">
          <motion.button
            key={capturePulse}
            onClick={capture}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full border-4 border-orange-500 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center"
            aria-label="Capture photo"
          >
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500"></span>
          </motion.button>
        </div>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center bg-slate-900 border border-slate-800">
          <div className="text-4xl mb-1">⚠️</div>
          <p className="text-[11px] font-semibold text-slate-300">Before</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{job?.beforeNote || "Original issue at upload"}</p>
        </div>
        <div className={`rounded-2xl p-4 text-center border transition-all ${captured ? "bg-emerald-500/10 border-emerald-500/40" : "bg-slate-900 border-slate-800"}`}>
          <div className="text-4xl mb-1">✅</div>
          <p className="text-[11px] font-semibold text-slate-300">After</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{captured ? "Captured — ready for AI check" : "Pending capture"}</p>
        </div>
      </div>

      {/* Submit */}
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center"
          >
            <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-emerald-300">Proof submitted!</p>
            <p className="text-[11px] text-emerald-200">Running AI before-after verification…</p>
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            whileTap={captured ? { scale: 0.98 } : undefined}
            onClick={submit}
            disabled={!captured}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              captured
                ? submitting
                  ? "bg-slate-800 text-orange-300"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <ImagePlus className="w-4 h-4 animate-pulse" /> Uploading & running AI check…
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                {captured ? `Submit proof → request ${C(job?.payout ?? 0)} payout` : "Capture a photo to continue"}
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {!captured && (
        <p className="text-center text-[11px] text-slate-500">
          <CheckCircle2 className="w-3 h-3 inline mr-1 text-slate-600" />
          Verified workers get paid within 24h of an AI "pass".
        </p>
      )}
    </div>
  );
};

export default UploadProofScreen;
