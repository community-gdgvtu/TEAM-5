import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgSettingsApi, updateOrgSettingsApi, OrgSettings } from "../../api/organizationApi";
import { Badge } from "../../components/common/Badge";
import { Bell, ShieldCheck, Landmark, Save } from "lucide-react";

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${on ? "bg-blue-500" : "bg-slate-700"}`}
    aria-label="Toggle setting"
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
  </button>
);

/** Screen 10 — Organization Settings: profile + notification & escrow preferences. */
export const SettingsScreen: React.FC<NavScreenProps> = ({ back }) => {
  const { data: settings } = useFetch<OrgSettings>(() => getOrgSettingsApi(), []);
  const [form, setForm] = useState<OrgSettings | null>(null);
  const [saved, setSaved] = useState(false);

  const s = form ?? settings;

  if (!s) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  const update = (patch: Partial<OrgSettings>) => {
    setForm((prev) => ({ ...(prev ?? s), ...patch }));
    setSaved(false);
  };

  const save = async () => {
    setSaved(true);
    try {
      const result = await updateOrgSettingsApi(form ?? s);
      setForm(result);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setSaved(false), 2200);
  };

  const boolToggles: { key: keyof OrgSettings; label: string; sub: string }[] = [
    { key: "notifNewReport", label: "New report alerts", sub: "Instant push on new citizen reports" },
    { key: "notifAiFlag", label: "AI verification flags", sub: "Auto-verification and feature detections" },
    { key: "notifEscrow", label: "Escrow activity", sub: "Holds, releases and top-ups" },
    { key: "notifDispute", label: "Dispute escalations", sub: "High-severity disputes page the team" },
    { key: "notifEmailDigest", label: "Weekly email digest", sub: "Monday performance summary" },
    { key: "autoApproveLowUrgency", label: "Auto-approve low urgency", sub: "Skip manual approval for minor repairs" },
  ];

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Organization Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Profile, alerting & escrow preferences</p>
        </div>
        <button onClick={back} className="text-xs text-slate-400 hover:text-white transition-colors">Close</button>
      </div>

      {/* Org profile */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Landmark className="w-4 h-4 text-blue-400" /> Organization profile
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-extrabold text-white shrink-0">
            {s.orgName.charAt(0)}
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">{s.orgName}</h3>
            <Badge tone="blue">{s.orgType}</Badge>
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Org name</label>
          <input
            value={s.orgName}
            onChange={(e) => update({ orgName: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Jurisdiction</label>
          <input
            value={s.jurisdiction}
            onChange={(e) => update({ jurisdiction: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Registration ID</label>
          <input
            value={s.regId}
            onChange={(e) => update({ regId: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Operations email</label>
          <input
            value={s.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Notifications & policy toggles */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Bell className="w-4 h-4 text-amber-400" /> Alert preferences
        </div>
        {boolToggles.map((n) => (
          <div key={n.key} className="flex items-center gap-3 py-2">
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-200">{n.label}</div>
              <div className="text-[10px] text-slate-500">{n.sub}</div>
            </div>
            <Toggle on={s[n.key]} onClick={() => update({ [n.key]: !s[n.key] })} />
          </div>
        ))}
      </div>

      {/* Escrow note */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <p className="text-xs text-slate-400 leading-relaxed">
          All published jobs run on smart-contract escrow: budget is frozen on publish and auto-released to the worker once AI verification passes.
        </p>
      </div>

      {/* Save */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={save}
        className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          saved
            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-900/30"
        }`}
      >
        <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save preferences"}
      </motion.button>
    </div>
  );
};

export default SettingsScreen;
