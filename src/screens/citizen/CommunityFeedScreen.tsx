import React, { useEffect, useMemo, useState } from "react";
import { Search, MapPin, TrendingUp } from "lucide-react";
import { getFeedPosts } from "../../api/feedApi";
import type { FeedPost } from "../../api/feedApi";
import { NavScreenProps } from "../../navigation/types";
import { CivicImg } from "../../components/common/CivicImg";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "issue", label: "Issues" },
  { key: "job", label: "Jobs" },
  { key: "campaign", label: "Campaigns" },
  { key: "completed", label: "Completed" },
];

/**
 * 🟢 Community feed (Citizen "Search" tab) — filterable, grid-style browse of
 * the unified feed. Search by title/area/hashtag, filter by post type.
 */
export const CommunityFeedScreen: React.FC<NavScreenProps> = ({ go }) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    getFeedPosts().then(setPosts);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.caption,
        p.category,
        p.area,
        p.location,
        p.authorName,
        ...(p.hashtags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, type]);

  const trending = useMemo(() => {
    const scored = [...posts]
      .map((p) => ({ p, score: p.likeCount * 2 + p.shares + p.comments }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map((s) => s.p);
  }, [posts]);

  const openPost = (p: FeedPost) => {
    const target = p.issueId || p.jobId || p.campaignId || p.id;
    go?.("tracking", { id: target });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Trending row */}
      <div>
        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-2">
          <TrendingUp className="w-3.5 h-3.5" /> Trending now
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {trending.map((p) => (
            <button
              key={p.id}
              onClick={() => openPost(p)}
              className="shrink-0 flex flex-col gap-1.5 w-28 text-left"
            >
              <span className="w-28 h-20 rounded-xl overflow-hidden">
                <CivicImg emoji={p.emoji} width={112} height={80} className="w-full h-full" alt={p.title} />
              </span>
              <span className="text-[10px] text-slate-300 line-clamp-2 leading-tight">{p.title}</span>
              <span className="text-[9px] text-emerald-400">▲ {p.likeCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2.5 sticky top-16 z-10 backdrop-blur bg-slate-900/80">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues, areas, categories…"
          className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-full"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-700/50">
            Clear
          </button>
        )}
      </div>

      {/* Type chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setType(c.key)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              type === c.key
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-slate-800/60 text-slate-300 border-slate-700/60"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">
          No results for “{query}”. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => openPost(p)}
              className="rounded-2xl bg-slate-800/40 border border-slate-700/40 overflow-hidden text-left hover:border-emerald-500/50 transition-colors"
            >
              <span className="block w-full h-20 overflow-hidden">
                <CivicImg emoji={p.emoji} width={300} height={160} className="w-full h-full" alt={p.title} />
              </span>
              <span className="block p-2.5">
                <span className="block text-[11px] font-semibold text-slate-100 leading-snug line-clamp-2">{p.title}</span>
                <span className="mt-1.5 flex items-center gap-1 text-[9px] text-slate-500">
                  <MapPin className="w-2.5 h-2.5" /> {p.area || p.location || "Civic"}
                  <span className="ml-auto text-emerald-400">▲ {p.likeCount}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeedScreen;
