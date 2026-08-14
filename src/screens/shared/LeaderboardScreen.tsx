import React from "react";
import { Trophy, TrendingUp, Star, ShieldCheck, ArrowLeft } from "lucide-react";
import { NavScreenProps } from "../../navigation/types";
import { roleColor, RoleKey } from "../../theme/colors";

export type LeaderboardRole = RoleKey;

interface Leader {
  rank: number;
  name: string;
  role: string;
  emoji: string;
  pts: number;
  stats: string;
}

/** Role-appropriate leaderboard data — AI scores each completion from reviews. */
const BOARDS: Record<LeaderboardRole, { title: string; subtitle: string; leaders: Leader[] }> = {
  citizen: {
    title: "Citizen Leaderboard",
    subtitle: "Reporters & funders ranked by community impact",
    leaders: [
      { rank: 1, name: "Priya M.", role: "Reporter", emoji: "🏆", pts: 1240, stats: "18 reports · 6 fixes" },
      { rank: 2, name: "Ravi T.", role: "Reporter", emoji: "🥈", pts: 980, stats: "14 reports · 4 fixes" },
      { rank: 3, name: "Anita K.", role: "Funder", emoji: "🥉", pts: 815, stats: "₹4,200 funded" },
      { rank: 4, name: "Simran D.", role: "Reporter", emoji: "🌱", pts: 640, stats: "9 reports · 3 fixes" },
      { rank: 5, name: "Debajyoti R.", role: "Funder", emoji: "🌱", pts: 520, stats: "₹2,100 funded" },
    ],
  },
  worker: {
    title: "Worker Leaderboard",
    subtitle: "Top repair quality, scored by AI + community reviews",
    leaders: [
      { rank: 1, name: "Rahul Deshmukh", role: "Drainage", emoji: "🏆", pts: 1105, stats: "4.9 ★ · 12 jobs" },
      { rank: 2, name: "Santosh K.", role: "Electrical", emoji: "🥈", pts: 955, stats: "4.8 ★ · 9 jobs" },
      { rank: 3, name: "Meena P.", role: "Sanitation", emoji: "🥉", pts: 870, stats: "4.7 ★ · 8 jobs" },
      { rank: 4, name: "Vijay N.", role: "Roads", emoji: "🛠️", pts: 690, stats: "4.6 ★ · 7 jobs" },
      { rank: 5, name: "Farhan A.", role: "Plumbing", emoji: "🔧", pts: 540, stats: "4.5 ★ · 5 jobs" },
    ],
  },
  investor: {
    title: "Investor Leaderboard",
    subtitle: "Funders ranked by verified civic impact",
    leaders: [
      { rank: 1, name: "Nikhil Rao", role: "Funds", emoji: "🏆", pts: 1320, stats: "₹85k deployed · 11 fixes" },
      { rank: 2, name: "Kavita S.", role: "Funds", emoji: "🥈", pts: 1010, stats: "₹62k deployed · 8 fixes" },
      { rank: 3, name: "Harsha G.", role: "Angel", emoji: "🥉", pts: 890, stats: "₹48k deployed · 6 fixes" },
      { rank: 4, name: "Anil B.", role: "Funds", emoji: "📈", pts: 700, stats: "₹35k deployed · 4 fixes" },
      { rank: 5, name: "Ritu J.", role: "Angel", emoji: "📊", pts: 560, stats: "₹26k deployed · 3 fixes" },
    ],
  },
  organization: {
    title: "Municipality Leaderboard",
    subtitle: "Bodies ranked by verified fixes delivered",
    leaders: [
      { rank: 1, name: "BMC Mumbai", role: "Municipal", emoji: "🏆", pts: 1480, stats: "42 verified fixes" },
      { rank: 2, name: "BBMP Bengaluru", role: "Municipal", emoji: "🥈", pts: 1160, stats: "33 verified fixes" },
      { rank: 3, name: "PMC Pune", role: "Municipal", emoji: "🥉", pts: 940, stats: "27 verified fixes" },
      { rank: 4, name: "KMC Kolkata", role: "Municipal", emoji: "🏛️", pts: 780, stats: "21 verified fixes" },
      { rank: 5, name: "GHMC Hyderabad", role: "Municipal", emoji: "🏗️", pts: 610, stats: "16 verified fixes" },
    ],
  },
};

const EXPLAINERS: Record<LeaderboardRole, string> = {
  citizen: "Every report and funded fix earns points. The more your neighbourhood improves, the higher you climb.",
  worker: "After each job the AI compares before/after photos and community reviews award stars. Quality work = more points.",
  investor: "Points grow from verified completions on the campaigns you fund. Impact, not just returns.",
  organization: "Points reflect verified fixes delivered through the platform — public proof of every rupee.",
};

/** Podium icon for the top-3 row. */
const MEDALS = ["🥇", "🥈", "🥉"];

/**
 * 🏆 Shared leaderboard — shown inside every role section via its shell's
 * trophy button. AI-scored points from reviews feed the ranking.
 */
export const LeaderboardScreen: React.FC<NavScreenProps & { role: LeaderboardRole }> = ({ role, back }) => {
  const accent = roleColor(role);
  const board = BOARDS[role] ?? BOARDS.citizen;
  const rest = board.leaders.slice(3);
  const top3 = board.leaders.slice(0, 3);

  return (
    <div className="px-4 pt-5 pb-6">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={back} className="text-slate-300 hover:text-white transition-colors" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}22`, color: accent }}>
          <Trophy className="w-4.5 h-4.5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-white leading-tight">{board.title}</h2>
          <p className="text-xs text-slate-400 truncate">{board.subtitle}</p>
        </div>
      </div>

      {/* AI scoring explainer */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
        <Star className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }} />
        <p className="text-xs leading-relaxed text-slate-300">{EXPLAINERS[role]}</p>
      </div>

      {/* Podium */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {top3.map((l, i) => {
          const isFirst = i === 0;
          return (
            <div
              key={l.name}
              className={`relative flex flex-col items-center rounded-2xl border px-2 pt-6 pb-3 text-center ${
                isFirst ? "border-amber-500/50 bg-amber-500/10" : "border-slate-700/60 bg-slate-900/60"
              }`}
            >
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-lg">{MEDALS[i]}</span>
              <span className={`mt-2 flex h-10 w-10 items-center justify-center rounded-full text-lg font-extrabold ${isFirst ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-200"}`}>
                {l.name.charAt(0)}
              </span>
              <p className="mt-2 w-full truncate text-xs font-bold text-white">{l.name}</p>
              <p className="text-[11px] font-extrabold" style={{ color: accent }}>{l.pts.toLocaleString("en-IN")} pts</p>
              <p className="mt-0.5 px-1 text-[9px] leading-tight text-slate-400">{l.stats}</p>
            </div>
          );
        })}
      </div>

      {/* Rest of the board */}
      <div className="mt-3 rounded-2xl border border-slate-700/50 bg-slate-950/60 overflow-hidden">
        {rest.map((l) => (
          <div key={l.name} className="flex items-center gap-3 border-b border-slate-800/60 px-4 py-2.5 last:border-0">
            <span className="w-6 text-center text-xs font-bold text-slate-400">#{l.rank}</span>
            <span className="text-lg">{l.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{l.name}</p>
              <p className="text-[10px] text-slate-500">{l.stats}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-extrabold" style={{ color: accent }}>{l.pts.toLocaleString("en-IN")}</p>
              <p className="text-[9px] text-slate-500">pts</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI-tracked note */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span>Points are awarded automatically after AI-verified, review-scored completions.</span>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
