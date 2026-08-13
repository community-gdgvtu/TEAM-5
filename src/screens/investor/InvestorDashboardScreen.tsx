import React, { useState, useRef } from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getInvestorFeed, Campaign, Comment } from "../../api/investorApi";
import { useApp } from "../../context/AppContext";
import { Search, BadgeCheck } from "lucide-react";
import { CampaignCover, FundingMeter, PostActions } from "../../components/investor/InvestorBits";
import { Badge } from "../../components/common/Badge";

/** Screen 1 — Investor Dashboard: Instagram-style feed of campaigns needing funding. */
export const InvestorDashboardScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data, loading } = useFetch<Campaign[]>(() => getInvestorFeed(), []);
  const { currentUser } = useApp();

  const [commentList, setCommentList] = useState<Record<string, Comment[]>>({});
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getComments = (c: Campaign) => commentList[c.id] ?? c.comments;

  const addComment = (c: Campaign) => {
    const text = (drafts[c.id] || "").trim();
    if (!text) return;
    const next: Comment = {
      user: currentUser?.name || "You",
      avatar: "💜",
      text,
      time: "now",
      likes: 0,
    };
    setCommentList((prev) => ({ ...prev, [c.id]: [...getComments(c), next] }));
    setDrafts((prev) => ({ ...prev, [c.id]: "" }));
  };

  const openComments = (id: string) => {
    setShowAll((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => inputRefs.current[id]?.focus(), 60);
  };

  return (
    <div className="px-3 pt-3 sm:px-5 sm:pt-5 space-y-4">
      {/* Discover bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            placeholder="Search campaigns, areas, orgs…"
            className="bg-transparent outline-none text-sm text-slate-200 w-full placeholder-slate-500"
          />
        </div>
        <button className="px-3 py-2 rounded-full bg-purple-600/15 text-purple-300 text-xs font-semibold border border-purple-500/30">
          Impact
        </button>
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading feed…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(data || []).map((c) => {
          const comments = getComments(c);
          const shown = showAll[c.id] ? comments : comments.slice(-2);
          return (
            <article key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              {/* Post header */}
              <div className="flex items-center gap-2.5 p-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: c.gradient }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-white truncate">{c.org}</span>
                    {c.orgVerified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{c.area} · {c.location}</p>
                </div>
                <button
                  onClick={() => go("detail", { id: c.id })}
                  className="text-slate-500 hover:text-slate-300 text-2xl leading-none"
                  aria-label="Open"
                >
                  ⋯
                </button>
              </div>

              {/* Cover — stays on dashboard */}
              <div className="block w-full text-left">
                <CampaignCover campaign={c} />
              </div>

              {/* Body */}
              <div className="p-3 flex flex-col gap-2.5">
                <PostActions
                  campaign={c}
                  commentCount={comments.length}
                  onComment={() => openComments(c.id)}
                  onFund={() => go("fund", { id: c.id })}
                />

                <p className="text-sm text-slate-200">
                  <span className="font-semibold text-white">{c.likes.toLocaleString()} likes</span>
                </p>

                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">{c.org}</span> {c.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {c.hashtags.map((h) => (
                    <span key={h} className="text-xs text-purple-400">#{h.replace("#", "")}</span>
                  ))}
                </div>

                {/* Comments */}
                {comments.length > 0 && (
                  <div className="space-y-2.5">
                    {shown.map((cm, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-sm shrink-0">
                          {cm.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-snug">
                            <span className="font-semibold text-white">{cm.user}</span>{" "}
                            <span className="text-slate-300">{cm.text}</span>
                          </p>
                          <span className="text-[10px] text-slate-500">{cm.time}</span>
                        </div>
                      </div>
                    ))}
                    {comments.length > 2 && !showAll[c.id] && (
                      <button
                        onClick={() => setShowAll((prev) => ({ ...prev, [c.id]: true }))}
                        className="text-xs text-slate-400"
                      >
                        View all {comments.length} comments
                      </button>
                    )}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex items-center gap-2 mt-1 border-t border-slate-800 pt-2.5">
                  <input
                    ref={(el) => {
                      inputRefs.current[c.id] = el;
                    }}
                    value={drafts[c.id] || ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addComment(c);
                      }
                    }}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
                  />
                  <button
                    onClick={() => addComment(c)}
                    disabled={!(drafts[c.id] || "").trim()}
                    className="text-sm font-semibold text-sky-400 disabled:opacity-40"
                  >
                    Post
                  </button>
                </div>

                <div className="mt-1">
                  <FundingMeter campaign={c} />
                </div>

                <div>
                  <Badge tone="purple">AI trust {Math.round(c.aiConfidence * 100)}%</Badge>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(data || []).length === 0 && !loading && (
        <p className="text-center text-slate-500 text-sm py-10">No active campaigns right now.</p>
      )}
    </div>
  );
};

export default InvestorDashboardScreen;
