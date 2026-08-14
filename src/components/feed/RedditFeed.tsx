import React, { useMemo, useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  BadgeCheck,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { CivicImg } from "../common/CivicImg";
import { FeedPost, FeedPostType } from "../../api/feedApi";
import { TYPE_META, roleColor } from "./PostCard";

type Sort = "hot" | "new" | "top";

const SORTS: { key: Sort; label: string }[] = [
  { key: "hot", label: "Hot" },
  { key: "new", label: "New" },
  { key: "top", label: "Top" },
];

const FILTERS: { key: "all" | FeedPostType; label: string; color: string }[] = [
  { key: "all", label: "All", color: "#94a3b8" },
  { key: "issue", label: "Citizen", color: "#f59e0b" },
  { key: "campaign", label: "Campaigns", color: "#a855f7" },
  { key: "job", label: "Open Work", color: "#3b82f6" },
  { key: "completed", label: "Work Done", color: "#22c55e" },
  { key: "failed", label: "Work Failed", color: "#ef4444" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export interface RedditFeedProps {
  posts: FeedPost[];
  loading: boolean;
  myId: string;
  currentUserName: string;
  onToggleLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onShare: (id: string) => void;
  ctaFor: (post: FeedPost) => { label: string; action: () => void } | null;
  onOpen?: (post: FeedPost) => void;
}

/**
 * 🔴 Citizen dashboard — Reddit-style community feed.
 * Vote rail (▲ score ▼), r/CivicFix community header, Hot/New/Top sorting,
 * collapsible comments and save. Photos instead of emoji tiles.
 */
export const RedditFeed: React.FC<RedditFeedProps> = ({
  posts,
  loading,
  myId,
  currentUserName,
  onToggleLike,
  onComment,
  onShare,
  ctaFor,
  onOpen,
}) => {
  const [sort, setSort] = useState<Sort>("hot");
  const [filter, setFilter] = useState<"all" | FeedPostType>("all");
  const [query, setQuery] = useState("");
  const [joined, setJoined] = useState(true);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const scoreFor = (p: FeedPost) => (p.likeCount ?? 0) + (votes[p.id] ?? 0);
  const hoursAgo = (p: FeedPost) =>
    Math.max(0.05, (Date.now() - new Date(p.createdAt).getTime()) / 3.6e6);
  const hotScore = (p: FeedPost) => scoreFor(p) / Math.log(hoursAgo(p) + 2);

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) => {
      if (filter !== "all" && p.type !== filter) return false;
      if (!q) return true;
      return (p.title + " " + p.caption + " " + p.authorName + " " + p.area)
        .toLowerCase()
        .includes(q);
    });
    return [...list].sort((a, b) =>
      sort === "new"
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : sort === "top"
          ? scoreFor(b) - scoreFor(a)
          : hotScore(b) - hotScore(a)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, filter, query, sort, votes]);

  const toggleVote = (id: string, dir: 1 | -1) =>
    setVotes((v) => {
      const cur = v[id] ?? 0;
      return { ...v, [id]: cur === dir ? 0 : dir };
    });

  const toggleSaved = (id: string) =>
    setSaved((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleComments = (id: string) =>
    setOpenComments((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submitComment = (id: string) => {
    const text = (drafts[id] ?? "").trim();
    if (!text) return;
    onComment(id, text);
    setDrafts((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div>
      {/* ===== r/CivicFix community header ===== */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <div className="h-16 bg-gradient-to-r from-[#FF6A3D] via-[#00D9A3] to-[#a855f7] opacity-80" />
        <div className="-mt-8 px-4 pb-4">
          <div className="flex items-end gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-slate-900 bg-slate-800">
              <CivicImg emoji="🛣️" width={64} height={64} className="w-full h-full" alt="r/CivicFix" />
            </div>
            <div className="flex-1 min-w-0 pb-0.5">
              <h1 className="text-lg font-extrabold text-white">r/CivicFix</h1>
              <p className="text-[11px] text-slate-400 truncate">r/CivicFixMumbai · Civic issues, funded fixes</p>
            </div>
            <button
              onClick={() => setJoined((j) => !j)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                joined
                  ? "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
                  : "bg-[#FF6A3D] text-white"
              }`}
            >
              {joined ? "Joined" : "Join"}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              <span className="font-semibold text-slate-200">128K</span> members
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 214 online
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-verified" /> AI-verified fixes
            </span>
          </div>
        </div>
      </div>

      {/* ===== toolbar: search + sort ===== */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search r/CivicFix…"
            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                sort === s.key ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* filter chips */}
      <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border whitespace-nowrap"
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

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading r/CivicFix…</p>}

      {/* ===== post list ===== */}
      <div className="mt-3 space-y-2 pb-6">
        {sorted.map((post) => {
          const meta = TYPE_META[post.type];
          const score = scoreFor(post);
          const vote = votes[post.id] ?? 0;
          const expanded = openComments.has(post.id);
          const cta = ctaFor(post);
          const likes = post.likes?.includes(myId) ?? false;
          return (
            <article
              key={post.id}
              className="flex rounded-lg border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-600/60 transition-colors"
            >
              {/* vote rail */}
              <aside className="flex flex-col items-center gap-0.5 bg-slate-950 w-9 py-2 shrink-0">
                <button
                  onClick={() => toggleVote(post.id, 1)}
                  className="p-1 rounded transition-colors"
                  aria-label="Upvote"
                >
                  <ArrowBigUp
                    className="w-5 h-5 transition-colors"
                    style={{ color: vote > 0 ? "#FF6A3D" : "#475569", fill: vote > 0 ? "#FF6A3D" : "transparent" }}
                  />
                </button>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color: vote > 0 ? "#FF6A3D" : vote < 0 ? "#7193ff" : "#94a3b8" }}
                >
                  {score.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => toggleVote(post.id, -1)}
                  className="p-1 rounded transition-colors"
                  aria-label="Downvote"
                >
                  <ArrowBigDown
                    className="w-5 h-5 transition-colors"
                    style={{ color: vote < 0 ? "#7193ff" : "#475569", fill: vote < 0 ? "#7193ff" : "transparent" }}
                  />
                </button>
              </aside>

              {/* content */}
              <div className="flex-1 min-w-0">
                <header className="px-3 pt-2 flex items-center gap-1 flex-wrap text-[11px] text-slate-400">
                  <span className="text-xs font-semibold text-slate-200">r/CivicFix</span>
                  <span className="text-slate-600">•</span>
                  <span>
                    Posted by <span className="text-slate-300">u/{post.authorName}</span>
                  </span>
                  {post.authorVerified && <BadgeCheck className="w-3 h-3 text-sky-400" />}
                  <span className="text-slate-600">•</span>
                  <span>{timeAgo(post.createdAt)}</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {post.area}
                  </span>
                  <span
                    className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: `${meta.chip}1f`, color: meta.chip }}
                  >
                    {meta.label}
                  </span>
                </header>

                <button
                  onClick={() => onOpen?.(post)}
                  className="block w-full text-left"
                  aria-label={`Open ${post.title}`}
                >
                  <h2 className="px-3 pt-1 text-sm font-semibold text-white leading-snug hover:text-slate-300 transition-colors">
                    {post.title}
                  </h2>

                  {/* media */}
                  <div className="px-3 pt-2">
                    <div className="relative rounded-lg overflow-hidden h-40 sm:h-48 bg-slate-800">
                      {post.photoUrl ? (
                        <img src={post.photoUrl} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <CivicImg emoji={post.emoji} width={600} height={300} className="w-full h-full" alt={post.title} />
                      )}
                      {post.status && (
                        <span
                          className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-white"
                          style={{ border: `1px solid ${meta.chip}55` }}
                        >
                          {post.status}
                        </span>
                      )}
                      {post.qualityScore != null && (
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-amber-300">
                          ★ {post.qualityScore}/5
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <p className="px-3 pt-2 text-[13px] text-slate-300 leading-snug line-clamp-2">{post.caption}</p>

                {post.taggedWorker && (
                  <p className="px-3 pt-1.5 text-[11px] text-slate-400">
                    👷 Tagged <span className="font-semibold text-slate-200">@{post.taggedWorker}</span>
                  </p>
                )}

                {/* hashtags */}
                {post.hashtags?.length > 0 && (
                  <div className="px-3 pt-1.5 flex gap-1.5 flex-wrap">
                    {post.hashtags.slice(0, 4).map((h) => (
                      <span key={h} className="text-[11px]" style={{ color: meta.chip }}>
                        #{h.replace("#", "")}
                      </span>
                    ))}
                  </div>
                )}

                {/* action bar */}
                <footer className="px-2 py-1.5 mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                  <button
                    onClick={() => onShare(post.id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => toggleSaved(post.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors ${
                      saved.has(post.id) ? "text-amber-300 hover:bg-slate-800" : "hover:bg-slate-800"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved.has(post.id) ? "fill-amber-300" : ""}`} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
                    aria-label="Like"
                  >
                    <span style={{ color: likes ? "#ec4899" : undefined }}>
                      {likes ? "♥" : "♡"}
                    </span>
                    <span>{post.likeCount?.toLocaleString("en-IN")}</span>
                  </button>
                  {cta && (
                    <button
                      onClick={cta.action}
                      className="ml-auto px-3 py-1.5 rounded-full text-[11px] font-bold text-white"
                      style={{ background: meta.chip }}
                    >
                      {cta.label}
                    </button>
                  )}
                </footer>

                {/* comments */}
                {expanded && (
                  <div className="border-t border-slate-800 px-3 py-2.5 space-y-2.5">
                    {post.comments.slice(0, 4).map((cm) => (
                      <div key={cm.id} className="flex items-start gap-2">
                        <span
                          className="w-6 h-6 rounded-full shrink-0 text-[10px] font-bold flex items-center justify-center"
                          style={{ background: `${roleColor[post.authorRole]}22`, color: roleColor[post.authorRole] }}
                        >
                          {cm.userName.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] leading-snug">
                            <span className="font-semibold text-white">{cm.userName}</span>{" "}
                            <span className="text-slate-300">{cm.text}</span>
                          </p>
                          <span className="text-[10px] text-slate-500">{cm.time || timeAgo(cm.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                    {post.comments.length > 4 && (
                      <p className="text-[11px] text-slate-500">View all {post.comments.length} comments</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        value={drafts[post.id] ?? ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitComment(post.id);
                          }
                        }}
                        placeholder={`Comment as ${currentUserName}…`}
                        className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500 border-b border-slate-800 pb-1"
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!(drafts[post.id] ?? "").trim()}
                        className="text-xs font-bold text-sky-400 disabled:opacity-40"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!loading && sorted.length === 0 && (
        <p className="text-center text-slate-500 text-sm py-10">
          {posts.length === 0 ? "r/CivicFix is quiet right now." : "No posts match your filters."}
        </p>
      )}
    </div>
  );
};

export default RedditFeed;
