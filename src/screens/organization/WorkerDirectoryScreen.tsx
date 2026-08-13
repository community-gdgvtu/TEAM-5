import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgWorkersApi, setWorkerStatusApi, setWorkerVerifiedApi } from "../../api/organizationApi";
import { OrgWorker } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { Search, Star, BadgeCheck, Ban, CheckCircle2, MapPin } from "lucide-react";

const STATUS_TONE: Record<OrgWorker["status"], string> = {
  available: "green",
  "on-job": "blue",
  suspended: "red",
};

/** Screen 7 — Worker Directory: registered workers, ratings, verification status. */
export const WorkerDirectoryScreen: React.FC<NavScreenProps> = ({ back }) => {
  const { data } = useFetch<OrgWorker[]>(() => getOrgWorkersApi(), []);
  const [list, setList] = useState<OrgWorker[] | null>(null);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [verifOnly, setVerifOnly] = useState(false);

  const workers = list ?? data ?? [];
  const skills = ["All", ...Array.from(new Set(workers.map((w) => w.skill)))];

  const filtered = workers.filter((w) => {
    if (skillFilter !== "All" && w.skill !== skillFilter) return false;
    if (verifOnly && !w.verified) return false;
    if (query.trim() && !(w.name + w.skill + w.location).toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    const current = (list ?? data ?? []).find((w) => w.id === id);
    if (!current) return;
    const next: OrgWorker["status"] = current.status === "suspended" ? "available" : "suspended";
    setList((prev) =>
      (prev ?? data ?? []).map((w) => (w.id === id ? { ...w, status: next } : w))
    );
    setWorkerStatusApi(id, next).catch(console.error);
  };

  const toggleVerify = (id: string) => {
    const current = (list ?? data ?? []).find((w) => w.id === id);
    if (!current) return;
    const next = !current.verified;
    setList((prev) =>
      (prev ?? data ?? []).map((w) => (w.id === id ? { ...w, verified: next } : w))
    );
    setWorkerVerifiedApi(id, next).catch(console.error);
  };

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Worker Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">{workers.length} registered contractors</p>
        </div>
        <button onClick={back} className="text-xs text-slate-400 hover:text-white transition-colors">Close</button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workers, skills…"
          className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
        />
      </div>

      {/* Skill chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {skills.map((s) => (
          <button
            key={s}
            onClick={() => setSkillFilter(s)}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
              skillFilter === s
                ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => setVerifOnly((v) => !v)}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1 ${
            verifOnly
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
          }`}
        >
          <BadgeCheck className="w-3 h-3" /> Verified only
        </button>
      </div>

      {/* Workers */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((w, i) => (
            <motion.div
              key={w.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: i * 0.04 }}
              className={`p-4 bg-slate-900 border rounded-2xl space-y-3 ${
                w.status === "suspended" ? "border-rose-500/30 opacity-80" : "border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-extrabold text-white shrink-0">
                  {w.avatar}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate">{w.name}</h3>
                    {w.verified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{w.skill}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {w.location} · {w.license}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-amber-400 flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5" fill="#f59e0b" /> {w.rating}
                  </div>
                  <div className="text-[10px] text-slate-500">{w.jobsDone} jobs</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge tone={STATUS_TONE[w.status]}>{w.status === "on-job" ? "On job" : w.status}</Badge>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleVerify(w.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                      w.verified
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {w.verified ? "Verified" : "Verify"}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleStatus(w.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                      w.status === "suspended"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/10 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {w.status === "suspended" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Restore
                      </>
                    ) : (
                      <>
                        <Ban className="w-3 h-3" /> Suspend
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 text-sm py-10">No workers match.</p>
      )}
    </div>
  );
};

export default WorkerDirectoryScreen;
