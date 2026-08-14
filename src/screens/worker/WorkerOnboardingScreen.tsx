import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useApp } from "../../context/AppContext";
import { CivicImg } from "../../components/common/CivicImg";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  ArrowRight,
  Camera,
  BadgeCheck,
  IdCard,
} from "lucide-react";

const SKILLS = [
  { label: "Road & Pavement Repairs", emoji: "🛣️", desc: "Potholes, patches, resurfacing" },
  { label: "Electrical & Streetlight Fixes", emoji: "💡", desc: "Grids, fixtures, wiring" },
  { label: "Sanitation & Drainage", emoji: "💧", desc: "De-silting, clearing, disinfecting" },
  { label: "Park Maintenance & Horticulture", emoji: "🌳", desc: "Planting, lawns, pruning" },
  { label: "General Civil Works", emoji: "🧱", desc: "Ramps, railing, masonry" },
];

/** Screen 1 — Verification / Onboarding: upload ID, pick a skill category. */
export const WorkerOnboardingScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { currentUser, setCurrentUser } = useApp();
  const [skill, setSkill] = useState(currentUser?.supplementaryData?.workerSkillCategory || "");
  const [licenseId, setLicenseId] = useState(currentUser?.supplementaryData?.workerLicenseId || "");
  const [docName, setDocName] = useState("");
  const [docDropped, setDocDropped] = useState(false);
  const [complete, setComplete] = useState(false);

  const ready = skill && licenseId.trim().length >= 4 && docDropped;

  const handleDrop = () => {
    setDocName("trade-license-aadhaar.pdf");
    setDocDropped(true);
  };

  const save = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      supplementaryData: {
        ...currentUser.supplementaryData,
        workerSkillCategory: skill,
        workerLicenseId: licenseId.trim(),
      },
    });
    setComplete(true);
    setTimeout(() => go("feed"), 1300);
  };

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-orange-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Step 1 · Worker Verification</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Complete your tender profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Get verified once, bid on funded civic jobs, and get paid through protected escrow.
        </p>
      </div>

      {/* Skill category */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Skill Category</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SKILLS.map((s) => {
            const selected = skill === s.label;
            return (
              <motion.button
                key={s.label}
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSkill(s.label)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selected
                    ? "bg-orange-500/10 border-orange-500/60 shadow-lg shadow-orange-900/20"
                    : "bg-slate-900 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <CivicImg emoji={s.emoji} alt={s.label} className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold ${selected ? "text-orange-300" : "text-slate-100"}`}>
                      {s.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{s.desc}</div>
                  </div>
                  {selected && <CheckCircle2 className="w-4 h-4 text-orange-400 ml-auto shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Trade license ID */}
      <div>
        <label htmlFor="worker-license" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Trade License / Govt ID Number
        </label>
        <div className="relative">
          <IdCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="worker-license"
            type="text"
            value={licenseId}
            onChange={(e) => setLicenseId(e.target.value)}
            placeholder="e.g. TR-5582910"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
        {licenseId.trim() && licenseId.trim().length < 4 && (
          <p className="text-[11px] text-amber-400 mt-1">Please enter at least 4 characters.</p>
        )}
      </div>

      {/* ID upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Upload ID Proof (Aadhaar / License)</label>
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop();
          }}
          onClick={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            docDropped ? "border-emerald-500/60 bg-emerald-500/5" : "border-slate-700 bg-slate-900 hover:border-orange-500/50"
          }`}
        >
          {docDropped ? (
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-11 h-11 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <p className="text-sm font-semibold text-emerald-300">{docName}</p>
              <p className="text-[11px] text-slate-400">Tap to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-11 h-11 rounded-full bg-orange-500/15 text-orange-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </span>
              <p className="text-sm font-semibold text-slate-200">Drag & drop or tap to upload</p>
              <p className="text-[11px] text-slate-400">PDF, JPG or PNG · max 10 MB</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Verification notice */}
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
        <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-200">
          Your ID is scanned instantly with AI. Verified workers unlock higher-priority jobs and an escrow payout guarantee.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        disabled={!ready}
        onClick={save}
        whileTap={ready ? { scale: 0.98 } : undefined}
        className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          ready
            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/40"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        {complete ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified — opening marketplace…</span>
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            <span>Complete Verification</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default WorkerOnboardingScreen;
