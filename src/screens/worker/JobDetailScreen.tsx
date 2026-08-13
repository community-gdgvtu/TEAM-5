import React from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getJob, WorkerJob, C } from "../../api/workerApi";
import { ProgressBar } from "../../components/common/ProgressBar";
import { Badge } from "../../components/common/Badge";
import {
  MapPin,
  CalendarDays,
  BadgeCheck,
  Bot,
  CheckCircle2,
  HandCoins,
  Users,
} from "lucide-react";

/** Screen 3 — Job Detail: photos, location, AI cost estimate, funding status. */
export const JobDetailScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const { data: job } = useFetch<WorkerJob | undefined>(() => getJob(params?.id), [params?.id]);

  if (!job) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading job…</p>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((job.raised / job.payout) * 100));
  const isBelowEstimate = job.aiEstimate >= job.payoutMin && job.aiEstimate <= job.payoutMax;

  return (
    <div className="px-4 pt-4 sm:px-6 pb-4 space-y-4">
      {/* Cover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-32 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
        style={{ background: job.gradient }}
      >
        <div className="absolute -right-6 -top-6 text-7xl opacity-20 select-none">{job.emoji}</div>
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white px-2 py-0.5 rounded-full backdrop-blur">
            {job.urgency} priority
          </span>
          <h1 className="text-lg font-extrabold text-white mt-2 drop-shadow leading-snug">{job.title}</h1>
        </div>
        <div className="text-3xl font-extrabold text-white drop-shadow">{C(job.payout)}</div>
      </motion.div>

      {/* Org + meta */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: job.gradient }}>
          {job.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-white truncate">{job.org}</span>
            {job.orgVerified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {job.area}, {job.location}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-orange-400 flex items-center gap-1">
            <RouteIco /> {job.distanceKm.toFixed(1)} km
          </div>
          <p className="text-[10px] text-slate-500">from you</p>
        </div>
      </div>

      {/* Funding status */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <HandCoins className="w-4 h-4 text-emerald-400" /> Funding status
          </span>
          <Badge tone={job.funded ? "green" : "amber"}>{job.funded ? "Fully funded" : "Fundraising"}</Badge>
        </div>
        <ProgressBar percent={pct} color="#f97316" />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>
            <span className="text-white font-bold">{C(job.raised)}</span> raised of {C(job.payout)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> escrow-backed
          </span>
        </div>
      </div>

      {/* AI cost estimate */}
      <div className="p-4 bg-slate-900 border border-orange-500/30 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </span>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Cost Estimate
              <Badge tone="orange">{(job.aiConfidence * 100).toFixed(0)}% confident</Badge>
            </div>
            <p className="text-[11px] text-slate-400">Fair-price band for your tender quote</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-800/60 p-2.5">
            <div className="text-[10px] text-slate-400 uppercase">Low</div>
            <div className="text-sm font-bold text-slate-200">{C(job.payoutMin)}</div>
          </div>
          <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-2.5">
            <div className="text-[10px] text-orange-300 uppercase">AI Fair</div>
            <div className="text-sm font-bold text-orange-300">{C(job.aiEstimate)}</div>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-2.5">
            <div className="text-[10px] text-slate-400 uppercase">High</div>
            <div className="text-sm font-bold text-slate-200">{C(job.payoutMax)}</div>
          </div>
        </div>
        {isBelowEstimate && (
          <p className="text-[11px] text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Your quote inside this band wins a priority badge with the org.
          </p>
        )}
      </div>

      {/* Issue photos */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Issue photos & evidence</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-6 text-center bg-slate-900 border border-slate-800">
            <div className="text-4xl mb-1">📸</div>
            <p className="text-[11px] text-slate-400">Before — street view</p>
          </div>
          <div className="rounded-2xl p-6 text-center bg-slate-900 border border-slate-800">
            <div className="text-4xl mb-1">📍</div>
            <p className="text-[11px] text-slate-400">Geo-tagged site marker</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-sm text-slate-300 leading-relaxed">{job.description}</p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <CalendarDays className="w-3.5 h-3.5 text-orange-400" />
          Posted {job.postedAgo} · Bids close {job.deadDate}
        </div>
      </div>

      {/* Existing bids context */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center">
          <Users className="w-4 h-4" />
        </span>
        <p className="text-[11px] text-slate-300">
          <span className="text-white font-bold">{job.bidsCount}</span> tender bids already submitted. Quote smart to stand out.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => go("submit", { id: job.id })}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-900/40"
      >
        Submit Tender Bid →
      </motion.button>
    </div>
  );
};

const RouteIco = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

export default JobDetailScreen;
