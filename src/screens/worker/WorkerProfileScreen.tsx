import React from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getProfile, getOpenJobs, WorkerJob, C } from "../../api/workerApi";
import { useApp } from "../../context/AppContext";
import { useRouter } from "../../router";
import { Badge } from "../../components/common/Badge";
import {
  Star,
  MapPin,
  BadgeCheck,
  Briefcase,
  Clock,
  LogOut,
  ChevronRight,
  Award,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/** Screen 11 — Worker Profile / Portfolio: past jobs, before-after gallery, badges. */
export const WorkerProfileScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data: profile } = useFetch(() => getProfile(), []);
  const { data: jobs } = useFetch<WorkerJob[]>(() => getOpenJobs(), []);
  const { currentUser, logout } = useApp();
  const { navigate } = useRouter();

  if (!profile) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading profile…</p>
      </div>
    );
  }

  const matchedJobs = (jobs || []).filter((j) => j.category === profile.skillCategory).length;

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-orange-600/25 via-slate-900 to-slate-900 border border-orange-500/40"
      >
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full blur-3xl bg-orange-500/15 pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-white truncate">{profile.name}</h1>
              {profile.verified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
            </div>
            <p className="text-xs text-orange-300 font-medium">{profile.skillCategory} · License {profile.licenseId}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {profile.location}
            </p>
          </div>
          <div className="text-center shrink-0">
            <div className="text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4" fill="#f59e0b" /> {profile.rating}
            </div>
            <p className="text-[10px] text-slate-400">rating</p>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "Jobs done", value: profile.jobsDone, icon: Briefcase },
            { label: "Accept rate", value: `${profile.acceptanceRate}%`, icon: Sparkles },
            { label: "Responds", value: profile.responseTime, icon: Clock },
            { label: "Matches", value: matchedJobs, icon: BadgeCheck },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-950/50 border border-slate-800 p-2.5 text-center">
              <s.icon className="w-3.5 h-3.5 text-orange-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{s.value}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bio */}
      <p className="text-sm text-slate-300 leading-relaxed">{profile.bio}</p>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => go("verification", { payout: 54000 })}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors text-left flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Verification status
            <span className="block text-[10px] text-slate-500 font-normal">AI verified · 100%</span>
          </span>
        </button>
        <button
          onClick={() => go("reviews")}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-colors text-left flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Star className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Reviews
            <span className="block text-[10px] text-slate-500 font-normal">See what clients say</span>
          </span>
        </button>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
          <Award className="w-4 h-4 text-amber-400" /> Badges & achievements
        </div>
        <div className="grid grid-cols-3 gap-2">
          {profile.badges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`p-3 rounded-xl border text-center ${
                b.unlocked ? "bg-slate-900 border-orange-500/30" : "bg-slate-900/50 border-slate-800 opacity-40"
              }`}
            >
              <div className="text-2xl mb-1">{b.emoji}</div>
              <div className={`text-[10px] font-semibold ${b.unlocked ? "text-slate-200" : "text-slate-500"}`}>{b.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio / before-after gallery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Portfolio · before / after</span>
          <span className="text-[10px] text-slate-500">{profile.portfolio.length} verified jobs</span>
        </div>
        <div className="space-y-3">
          {profile.portfolio.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <div className="p-3.5 flex items-center gap-3" style={{ background: p.gradient }}>
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>
                  <p className="text-[11px] text-white/80">{p.category} · {p.date} · {C(p.payout)}</p>
                </div>
                <Badge tone="green">✓ AI verified</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                  <div className="text-2xl mb-0.5">⚠️</div>
                  <p className="text-[10px] text-slate-400 italic leading-snug">"{p.before}"</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                  <div className="text-2xl mb-0.5">✅</div>
                  <p className="text-[10px] text-emerald-300 italic leading-snug">"{p.after}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Account row */}
      <div className="space-y-2">
        <button className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-left hover:border-slate-600 transition-colors">
          <span className="text-sm text-slate-200">Account: {currentUser?.mobile ?? profile.licenseId}</span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  );
};

export default WorkerProfileScreen;
