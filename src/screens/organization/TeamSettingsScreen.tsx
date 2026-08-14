import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getOrgTeamApi, addOrgTeamMemberApi, updateOrgTeamMemberApi } from "../../api/organizationApi";
import { OrgTeamMember } from "../../data/orgMock";
import { Badge } from "../../components/common/Badge";
import { useApp } from "../../context/AppContext";
import { useRouter } from "../../router";
import { UserPlus, Shield, ShieldCheck, ShieldAlert, User, X, LogOut } from "lucide-react";

const LEVELS: OrgTeamMember["level"][] = ["Admin", "Verifier", "Field Officer", "Viewer"];

const LEVEL_ICON: Record<OrgTeamMember["level"], React.ElementType> = {
  Admin: ShieldCheck,
  Verifier: ShieldAlert,
  "Field Officer": Shield,
  Viewer: User,
};

const LEVEL_TONE: Record<OrgTeamMember["level"], string> = {
  Admin: "purple",
  Verifier: "blue",
  "Field Officer": "green",
  Viewer: "slate",
};

const LEVEL_DESC: Record<OrgTeamMember["level"], string> = {
  Admin: "Full control",
  Verifier: "Approve/reject reports",
  "Field Officer": "Inspect & dispute",
  Viewer: "Read-only",
};

/** Screen 9 — Team & Access Management: add staff, set permission levels. */
export const TeamSettingsScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { logout } = useApp();
  const { navigate } = useRouter();
  const { data } = useFetch<OrgTeamMember[]>(() => getOrgTeamApi(), []);
  const [team, setTeam] = useState<OrgTeamMember[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<OrgTeamMember["level"]>("Verifier");

  const members = team ?? data ?? [];

  const addMember = async () => {
    if (!name.trim() || !email.trim()) return;
    try {
      const next = await addOrgTeamMemberApi({ name: name.trim(), email: email.trim(), level });
      setTeam(next);
    } catch (e) {
      console.error(e);
    }
    setName("");
    setEmail("");
    setAdding(false);
  };

  const changeLevel = (id: string, newLevel: OrgTeamMember["level"]) => {
    setTeam((prev) =>
      (prev ?? data ?? []).map((m) => (m.id === id ? { ...m, level: newLevel } : m))
    );
    updateOrgTeamMemberApi(id, newLevel).catch(console.error);
  };

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Team & Access</h1>
          <p className="text-xs text-slate-400 mt-0.5">{members.length} staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setAdding((a) => !a)}
            className="px-3.5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500/25 transition-colors"
          >
            {adding ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            {adding ? "Cancel" : "Add member"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { logout(); navigate("/login"); }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </motion.button>
        </div>
      </div>

      {/* Add member form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-900 border border-blue-500/30 rounded-2xl space-y-3">
              <div className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Invite staff member
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@municipal.gov"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <div>
                <div className="text-[11px] text-slate-400 mb-1.5">Permission level</div>
                <div className="grid grid-cols-2 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`p-2.5 rounded-xl text-left border text-[11px] transition-all ${
                        level === l
                          ? "bg-blue-500/10 border-blue-500/50"
                          : "bg-slate-950 border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className={`font-bold ${level === l ? "text-blue-300" : "text-slate-300"}`}>{l}</div>
                      <div className="text-slate-500 text-[10px]">{LEVEL_DESC[l]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={addMember}
                disabled={!name.trim() || !email.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send invite + add to roster
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members list */}
      <div className="space-y-3">
        <AnimatePresence>
          {members.map((m, i) => {
            const Icon = LEVEL_ICON[m.level];
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                    {m.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{m.name}</div>
                    <p className="text-[11px] text-slate-400 truncate">{m.email} · {m.lastActive}</p>
                  </div>
                  <Badge tone={LEVEL_TONE[m.level]}>
                    <span className="inline-flex items-center gap-1">
                      <Icon className="w-3 h-3" /> {m.level}
                    </span>
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">Set level:</span>
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLevel(m.id, l)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        m.level === l
                          ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                          : "bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Permissions guide */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-xs font-semibold text-slate-300">What each level can do</div>
        {LEVELS.map((l) => {
          const Icon = LEVEL_ICON[l];
          return (
            <div key={l} className="flex items-center gap-2 text-[11px] text-slate-400">
              <Icon className="w-3.5 h-3.5" style={{ color: l === "Admin" ? "#a855f7" : "#3b82f6" }} />
              <span className="font-bold text-slate-300 w-24 shrink-0">{l}</span>
              <span>{LEVEL_DESC[l]}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => go("settings")}
        className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-bold hover:border-blue-500/40 transition-colors"
      >
        Open org settings →
      </button>
    </div>
  );
};

export default TeamSettingsScreen;
