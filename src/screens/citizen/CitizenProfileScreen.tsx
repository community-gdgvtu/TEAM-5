import React, { useEffect, useMemo } from "react";
import { MapPin, BadgeCheck, LogOut, Trophy, FileText, Grid3X3, Tag } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useRouter } from "../../router";
import { getFeedPosts } from "../../api/feedApi";
import type { FeedPost } from "../../api/feedApi";
import { NavScreenProps } from "../../navigation/types";

const LEADERBOARD = [
  { name: "Priya M.", points: 1240, emoji: "🏆" },
  { name: "Ravi T.", points: 980, emoji: "🥈" },
  { name: "Anita K.", points: 815, emoji: "🥉" },
  { name: "Simran D.", points: 640, emoji: "🌱" },
  { name: "Debajyoti R.", points: 520, emoji: "🌱" },
];

/**
 * 🟢 Citizen profile — IG-grid style: stats row, leaderboard strip,
 * and a 3-column grid of the citizen's own posts. "My Reports" links into
 * the full report history.
 */
export const CitizenProfileScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { currentUser, logout } = useApp();
  const { navigate } = useRouter();
  const [posts, setPosts] = React.useState<FeedPost[]>([]);

  useEffect(() => {
    getFeedPosts().then(setPosts);
  }, []);

  const mine = useMemo(() => {
    const name = currentUser?.name?.toLowerCase() || "ananya";
    return posts.filter(
      (p) =>
        p.type === "issue" ||
        (p.authorName?.toLowerCase().includes(name) && p.authorRole === "citizen")
    );
  }, [posts, currentUser]);

  const initials = (currentUser?.name || "CU")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-5 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-3xl font-extrabold text-white shrink-0 ring-2 ring-emerald-400/40">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-extrabold text-white truncate">{currentUser?.name || "Ananya Sharma"}</h2>
            <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {currentUser?.location?.city || "Mumbai"}, Maharashtra
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Fixing my city one report at a time 🏙️
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 mt-4">
        {[
          { n: mine.length, label: "Posts" },
          { n: "2", label: "Fixed" },
          { n: "148", label: "Followers" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 py-2.5 text-center">
            <p className="text-lg font-extrabold text-white">{s.n}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 mt-3">
        <button
          onClick={() => go?.("my")}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
        >
          <FileText className="w-4 h-4" /> My Reports
        </button>
        <button className="flex-1 text-sm font-semibold py-2 rounded-xl bg-slate-800/70 text-slate-200 border border-slate-700/60 hover:bg-slate-800 transition-colors">
          Edit Profile
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="px-3 flex items-center justify-center rounded-xl bg-slate-800/70 text-rose-400 border border-slate-700/60 hover:bg-rose-500/10 transition-colors"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Leaderboard */}
      <div className="mt-5 px-4">
        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-2">
          <Trophy className="w-3.5 h-3.5" /> Citizen Leaderboard
        </p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LEADERBOARD.map((l, i) => (
            <div
              key={l.name}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/50 px-3 py-2"
            >
              <span className="text-lg">{l.emoji}</span>
              <div>
                <p className="text-[11px] font-semibold text-white">{l.name}</p>
                <p className="text-[9px] text-emerald-400">{l.points.toLocaleString("en-IN")} pts</p>
              </div>
              {i === 0 && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">#1</span>}
            </div>
          ))}
        </div>
      </div>

      {/* IG grid */}
      <div className="mt-5">
        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 px-4 mb-2">
          <Grid3X3 className="w-3.5 h-3.5" /> Posts
        </p>
        {mine.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            No posts yet — report an issue to start your grid.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-px bg-slate-800/60 border-y border-slate-800">
            {mine.map((p) => (
              <button
                key={p.id}
                onClick={() => go?.("detail", { id: p.issueId || p.id })}
                className="relative aspect-square flex items-center justify-center text-3xl"
                style={{ background: p.gradient || "linear-gradient(135deg,#334155,#1e293b)" }}
              >
                {p.emoji || "📍"}
                <span className="absolute bottom-1 left-1 right-1 text-[8px] font-medium text-white/90 bg-black/40 rounded px-1 py-0.5 truncate">
                  {p.title}
                </span>
                <span className="absolute top-1 right-1 flex items-center gap-0.5 text-[8px] text-white/90 bg-black/40 rounded-full px-1.5 py-0.5">
                  <Tag className="w-2 h-2" /> {p.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenProfileScreen;
