import React, { useState } from "react";
import { Heart, MessageCircle, Share2, BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";
import { CivicImg, CivicAvatar } from "../common/CivicImg";
import { C, FeedPost } from "../../api/feedApi";

export const TYPE_META: Record<
  FeedPost["type"],
  { label: string; tone: string; chip: string }
> = {
  issue: { label: "Citizen Issue", tone: "amber", chip: "#f59e0b" },
  job: { label: "Open Work", tone: "blue", chip: "#3b82f6" },
  completed: { label: "Work Done", tone: "green", chip: "#22c55e" },
  campaign: { label: "Campaign", tone: "purple", chip: "#a855f7" },
  failed: { label: "Work Failed", tone: "red", chip: "#ef4444" },
};

export const roleColor: Record<FeedPost["authorRole"], string> = {
  citizen: "#22c55e",
  organization: "#3b82f6",
  worker: "#f97316",
  investor: "#a855f7",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export const PostCard: React.FC<{
  post: FeedPost;
  myId: string;
  currentUserName: string;
  onToggleLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onShare: (id: string) => void;
  onCta?: (post: FeedPost) => void;
  ctaLabel?: string;
  onOpen?: (post: FeedPost) => void;
}> = ({ post, myId, currentUserName, onToggleLike, onComment, onShare, onCta, ctaLabel, onOpen }) => {
  const [showAll, setShowAll] = useState(false);
  const [draft, setDraft] = useState("");
  const meta = TYPE_META[post.type];
  const liked = post.likes?.includes(myId) ?? false;
  const shown = showAll ? post.comments : post.comments.slice(-2);

  const funding = post.targetAmount || post.raisedAmount || post.amount;
  const pct =
    post.targetAmount && post.raisedAmount
      ? Math.round((post.raisedAmount / post.targetAmount) * 100)
      : post.type === "completed"
      ? 100
      : null;

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    onComment(post.id, text);
    setDraft("");
  };

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      {/* Post header */}
      <div className="flex items-center gap-2.5 p-3">
        <button
          onClick={() => onOpen?.(post)}
          className="text-left flex items-center gap-2.5 flex-1 min-w-0"
          aria-label={`Open ${post.title}`}
        >
          <CivicAvatar
            name={post.authorName}
            size={36}
            className="w-9 h-9 shrink-0 ring-2 ring-white/10"
            alt={post.authorName}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white truncate">{post.authorName}</span>
              {post.authorVerified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
              <span
                className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: `${roleColor[post.authorRole]}1f`, color: roleColor[post.authorRole] }}
              >
                {post.authorRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {post.area} · {post.location} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </button>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      {/* Cover */}
      <button onClick={() => onOpen?.(post)} className="relative w-full h-44 sm:h-52 overflow-hidden bg-slate-800 block text-left" aria-label={`Open ${post.title}`}>
        {post.photoUrl ? (
          <img src={post.photoUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <CivicImg emoji={post.emoji} width={600} height={400} className="w-full h-full" alt={post.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        {post.status && (
          <div className="absolute top-2 right-2">
            <Badge tone={post.type === "completed" ? "green" : post.type === "failed" ? "red" : meta.tone}>{post.status}</Badge>
          </div>
        )}
        {post.beforeAfter && (
          <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[11px] text-white">
            ✅ After verified on site
          </div>
        )}
        {post.qualityScore != null && (
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[11px] text-amber-300">
            ★ {post.qualityScore}/5 quality target
          </div>
        )}
      </button>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onOpen?.(post)} className="text-left">
            <span className="text-sm font-bold text-white leading-snug">{post.title}</span>
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-snug">
          {post.caption || post.title}
        </p>

        {/* Money / funding */}
        {pct !== null && post.targetAmount && (
          <div className="space-y-1.5">
            <ProgressBar percent={pct} color={meta.chip} />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                {C(post.raisedAmount || 0)}{" "}
                <span className="text-slate-500 font-normal">raised of {C(post.targetAmount)}</span>
              </span>
              <span className="text-slate-400">{post.backers} backers</span>
            </div>
          </div>
        )}
        {pct === null && funding !== null && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {post.type === "issue" ? "AI estimate" : post.type === "job" ? "Contract value" : "Payout"}
            </span>
            <span className="text-slate-200 font-bold">{C(funding)}</span>
          </div>
        )}

        {post.beforeAfter && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold mb-1">Before</p>
              <p className="text-xs text-slate-300">{post.beforeAfter.before}</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-2.5">
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">After</p>
              <p className="text-xs text-slate-300">{post.beforeAfter.after}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {post.hashtags?.map((h) => (
            <span key={h} className="text-xs" style={{ color: meta.chip }}>
              #{h.replace("#", "")}
            </span>
          ))}
        </div>

        {post.taggedWorker && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">👷 Tagged:</span>
            <span className="font-semibold text-slate-200">@{post.taggedWorker}</span>
            <span className="text-slate-500">will be notified</span>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-4 border-t border-slate-800 pt-2.5">
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-1.5 text-sm"
            aria-label="Like"
          >
            <Heart
              className="w-5 h-5"
              style={{ color: liked ? "#ec4899" : "#cbd5e1", fill: liked ? "#ec4899" : "transparent" }}
            />
            <span className="text-slate-300">{post.likeCount?.toLocaleString()}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-slate-300" aria-label="Comments">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-1.5 text-sm text-slate-300"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
            <span>{post.shares}</span>
          </button>
          {onCta && (
            <button
              onClick={() => onCta(post)}
              className="ml-auto px-4 py-1.5 rounded-full text-sm font-semibold text-white"
              style={{ background: meta.chip }}
            >
              {ctaLabel}
            </button>
          )}
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-2.5">
            {shown.map((cm, i) => (
              <div key={cm.id || i} className="flex items-start gap-2">
                <CivicAvatar name={cm.userName} size={28} className="w-7 h-7 shrink-0" alt={cm.userName} />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold text-white">{cm.userName}</span>{" "}
                    <span className="text-slate-300">{cm.text}</span>
                  </p>
                  <span className="text-[10px] text-slate-500">{cm.time || timeAgo(cm.createdAt)}</span>
                </div>
              </div>
            ))}
            {post.comments.length > 2 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Comment input */}
        <div className="flex items-center gap-2 mt-0.5 border-t border-slate-800 pt-2.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitComment();
              }
            }}
            placeholder={`Comment as ${currentUserName}…`}
            className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
          />
          <button
            onClick={submitComment}
            disabled={!draft.trim()}
            className="text-sm font-semibold text-sky-400 disabled:opacity-40"
          >
            Post
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
