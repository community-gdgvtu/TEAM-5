import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getActiveJobs, ActiveJob, C } from "../../api/workerApi";
import { Badge } from "../../components/common/Badge";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Circle,
  Phone,
  User,
  Camera,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

/** Screen 6 — Active Job: navigation to site, checklist, instructions. */
export const ActiveJobScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data } = useFetch<ActiveJob[]>(() => getActiveJobs(), []);
  const [items, setItems] = useState<Record<string, { label: string; done: boolean }[]>>({});
  const [navigating, setNavigating] = useState(false);

  const job = data?.[0] || null;
  const list = job ? items[job.id] ?? job.checklist ?? [] : [];

  const toggle = (i: number) => {
    if (!job) return;
    const cur = items[job.id] ?? job.checklist ?? [];
    const next = cur.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c));
    setItems((prev) => ({ ...prev, [job.id]: next }));
  };

  const allDone = list.length > 0 && list.every((c) => c.done);

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Active Job</h1>
        <p className="text-xs text-slate-400 mt-0.5">{job ? job.title : "Loading…"}</p>
      </div>

      {job && (
        <>
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-24 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden"
            style={{ background: job.gradient }}
          >
            <div className="absolute -right-4 -bottom-6 text-6xl opacity-20 select-none">{job.emoji}</div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Escrow value</div>
              <div className="text-2xl font-extrabold text-white drop-shadow">{C(job.payout)}</div>
            </div>
            <div className="text-right">
              <Badge tone="green">● Awarded</Badge>
              <div className="text-[11px] text-white/90 mt-1.5 flex items-center gap-1 justify-end">
                <CalendarDays className="w-3 h-3" /> Due {job.dueDate}
              </div>
            </div>
          </motion.div>

          {/* Location + navigate */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">Site location</div>
                <p className="text-xs text-slate-400">{job.area}, {job.location}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setNavigating(true);
                setTimeout(() => setNavigating(false), 2500);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30"
            >
              {navigating ? (
                <>
                  <Navigation className="w-4 h-4 animate-pulse" /> Opening maps navigation…
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" /> Navigate to site ({job.distanceKm.toFixed(1)} km)
                </>
              )}
            </motion.button>
          </div>

          {/* Client */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="w-4 h-4 text-orange-400" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{job.clientName}</div>
              <p className="text-[11px] text-slate-400">{job.clientMobile} · point of contact</p>
            </div>
            <button
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ClipboardList className="w-4 h-4 text-sky-400" /> Work instructions
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{job.instructionNote}</p>
          </div>

          {/* Checklist */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Job checklist
              </div>
              <span className="text-[11px] text-slate-400">
                {list.filter((c) => c.done).length}/{list.length} done
              </span>
            </div>
            <AnimatePresence>
              {list.map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => toggle(i)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    item.done ? "bg-emerald-500/5 border-emerald-500/30" : "bg-slate-800/50 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? "text-emerald-300 line-through" : "text-slate-200"}`}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Upload proof CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => go("upload", { id: job.id })}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              allDone
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-900/30"
                : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/40"
            }`}
          >
            <Camera className="w-4 h-4" />
            {allDone ? "All done — upload completion proof" : "Complete checklist to unlock proof upload"}
          </motion.button>

          {!allDone && (
            <p className="text-center text-[11px] text-slate-500 -mt-1">
              Proof upload unlocks after all checklist items are ticked.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ActiveJobScreen;
