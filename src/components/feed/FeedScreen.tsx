import React, { useMemo, useState } from "react";
import { Search, RefreshCw, Bell } from "lucide-react";
import { NavScreenProps } from "../../navigation/types";
import { useApp } from "../../context/AppContext";
import { useFeed } from "../../hooks/useFeed";
import { FeedPost, FeedPostType } from "../../api/feedApi";
import { PostCard } from "./PostCard";

export type FeedRole = "citizen" | "worker" | "investor" | "organization";

const FILTERS: { key: "all" | FeedPostType; label: string; color: string }[] = [
  { key: "all", label: "All", color: "#94a3b8" },
  { key: "completed", label: "Work Done", color: "#22c55e" },
  { key: "campaign", label: "Campaigns", color: "#a855f7" },
  { key: "job", label: "Open Work", color: "#3b82f6" },
  { key: "issue", label: "Citizen", color: "#f59e0b" },
];

const ROLE_TAGLINE: Record<FeedRole, string> = {
  citizen: "Issues you and your neighbours reported — updated live.",
  worker: "New work, completed fixes and funded campaigns in one place.",
  investor: "Campaigns, work in progress and verified completions.",
  organization: "Everything moving across your city — reports, bids and completions.",
};

/**
 * 🌐 Shared community feed — the single stream every role sees.
 * Polls /api/feed (8s), supports search + type filters, and shows a
 * role-appropriate CTA (Fund / Bid / View / Manage) with deep links.
 */
export const FeedScreen: React.FC<NavScreenProps & { role: FeedRole }> = ({ go, role }) => {
  const { posts, loading, refreshing, refresh, toggleLike, addComment, share } = useFeed();
  const { currentUser } = useApp();
  const [filter, setFilter] = useState<"all" | FeedPostType>("all");
  const [query, setQuery] = useState("");

  const myId = currentUser?.id || "user_demo_001";
  const myName = currentUser?.name || "You";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== "all" && p.type !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.hashtags.join(" ").toLowerCase().includes(q)
      );
    });
  }, [posts, filter, query]);

  /** Role-appropriate deep-link + CTA label per post type. */
  const ctaFor = (post: FeedPost): { label: string; action: () => void } | null => {
    switch (role) {
      case "investor":
        if (post.type === "campaign" && post.campaignId) {
          return { label: "Fund", action: () => go("fund", { id: post.campaignId }) };
        }
        if (post.type === "job" && post.jobId) {
          return { label: "View", action: () => go("discover") };
        }
        return null;
      case "worker":
        if (post.type === "job" && post.jobId) {
          return { label: "Bid now", action: () => go("detail", { id: post.jobId }) };
        }
        if (post.type === "completed") {
          return { label: "My jobs", action: () => go("active") };
        }
        return null;
      case "citizen":
        if (post.type === "issue" && post.issueId) {
          return { label: "Track", action: () => go("detail", { id: post.issueId }) };
        }
        return null;
      case "organization":
        if (post.type === "job" || post.type === "campaign") {
          return { label: "Manage", action: () => go("jobs") };
        }
        return null;
    }
  };

  return (
    <div className="px-3 pt-3 sm:px-5 sm:pt-5">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, work, areas, orgs…"
            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
          />
        </div>
        <button
          onClick={refresh}
          className="px-3 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Live</span>
        </button>
        <button className="text-slate-300 hover:text-white" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2.5">{ROLE_TAGLINE[role]}</p>

      {/* Type filter chips */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap"
            style={
              filter === f.key
                ? { background: `${f.color}22`, color: f.color, borderColor: `${f.color}55` }
                : { background: "transparent", color: "#94a3b8", borderColor: "#1e293b" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading feed…</p>}

      <div className="grid gap-4 mt-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((post) => {
          const cta = ctaFor(post);
          return (
            <PostCard
              key={post.id}
              post={post}
              myId={myId}
              currentUserName={myName}
              onToggleLike={toggleLike}
              onComment={addComment}
              onShare={share}
              onCta={cta ? cta.action : undefined}
              ctaLabel={cta?.label}
            />
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-center text-slate-500 text-sm py-10">
          {posts.length === 0 ? "Feed is quiet right now." : "No posts match your filters."}
        </p>
      )}
    </div>
  );
};

export default FeedScreen;
