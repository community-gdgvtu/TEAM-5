import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Tag,
  UserRound,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Send,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CivicImg } from "../../components/common/CivicImg";
import { roleColor, TYPE_META } from "../../components/feed/PostCard";
import { useApp } from "../../context/AppContext";
import { NavScreenProps } from "../../navigation/types";
import {
  getWorkTracking,
  createFeedPost,
  FeedPost,
  FeedPostType,
} from "../../api/feedApi";

type TrackingRole = "citizen" | "worker" | "investor" | "organization";

/**
 * 📍 Work tracking — one page for a single work/issue.
 * Shows the original post, every related update posted by any of the 4 roles,
 * tagged workers, AI + user estimates and a status timeline. Any user can post
 * an update here and it lands in the shared feed under the same work thread.
 */
export const WorkTrackingScreen: React.FC<NavScreenProps & { role: TrackingRole }> = ({
  go,
  back,
  params,
  role,
}) => {
  const { currentUser } = useApp();
  const id = (params?.id as string) || (params?.workId as string) || "";
  const [work, setWork] = useState<FeedPost | null>(null);
  const [related, setRelated] = useState<FeedPost[]>([]);
  const [taggedWorkers, setTaggedWorkers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [updateType, setUpdateType] = useState<FeedPostType>("issue");
  const [posting, setPosting] = useState(false);

  const reload = () => {
    setLoading(true);
    getWorkTracking(id)
      .then((d) => {
        setWork(d.work);
        setRelated(d.related);
        setTaggedWorkers(d.taggedWorkers || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const timeline = [work, ...related]
    .filter(Boolean)
    .sort((a, b) => +new Date((a as any).createdAt) - +new Date((b as any).createdAt));

  const postUpdate = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    try {
      const link = work?.issueId || work?.jobId || work?.campaignId || work?.id;
      await createFeedPost({
        type: updateType,
        title: `${currentUser?.name || "Someone"} posted an update`,
        caption: draft.trim(),
        category: work?.category || "General",
        emoji: updateType === "completed" ? "✅" : updateType === "failed" ? "⚠️" : "📢",
        gradient: work?.gradient,
        authorName: currentUser?.name || "You",
        authorAvatar: "🧑",
        authorRole: (role as any) || "citizen",
        authorVerified: false,
        area: work?.area,
        location: work?.location,
        status: updateType === "completed" ? "Completed" : updateType === "failed" ? "Work Failed" : "Updated",
        hashtags: work?.hashtags || ["#Tracking"],
        issueId: work?.type === "issue" || work?.type === "failed" ? work.issueId || work.id : undefined,
        jobId: work?.jobId,
        campaignId: work?.campaignId,
        taggedWorker: work?.taggedWorker,
        locationTag: work?.locationTag,
      });
      setDraft("");
      reload();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setPosting(false);
    }
  };

  const accent = work ? roleColor[work.authorRole] : "#22c55e";
  const meta = work ? TYPE_META[work.type] : TYPE_META.issue;

  return (
    <ScreenShell title="Work Tracking" subtitle="One thread · every update" role={role}>
      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading work thread…</p>}

      {!loading && !work && (
        <Card>
          <p className="text-sm text-slate-300">This work could not be found. It may have been removed.</p>
          <Button color={role} variant="ghost" onClick={back}>← Back</Button>
        </Card>
      )}

      {work && (
        <div className="space-y-3">
          {/* ===== Work card ===== */}
          <Card accent={accent}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: `${meta.chip}1f`, color: meta.chip }}
              >
                {meta.label}
              </span>
              <Badge tone={work.type === "failed" ? "red" : work.type === "completed" ? "green" : "slate"}>
                {work.status}
              </Badge>
              <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {work.area}
              </span>
            </div>

            <h2 className="text-base font-bold text-white leading-snug mb-1.5">{work.title}</h2>
            <p className="text-sm text-slate-300">{work.caption || work.description}</p>

            {/* Media */}
            {work.photoUrl ? (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img src={work.photoUrl} alt={work.title} className="w-full h-48 object-cover" />
              </div>
            ) : (
              <div className="mt-3 relative rounded-xl overflow-hidden h-40 bg-slate-800">
                <CivicImg emoji={work.emoji} width={600} height={300} className="w-full h-full" alt={work.title} />
              </div>
            )}

            {/* Estimates */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-verified" /> AI estimate
                </p>
                <p className="text-lg font-bold text-white mt-1">
                  ₹{(work.amount ?? 0).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-slate-400">auto-generated from the uploaded data</p>
              </div>
              <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Tagged worker</p>
                {work.taggedWorker ? (
                  <>
                    <p className="text-sm font-bold text-orange-300 mt-1 flex items-center gap-1">
                      <UserRound className="w-3.5 h-3.5" /> {work.taggedWorker}
                    </p>
                    <p className="text-[10px] text-slate-400">notified about this work</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 mt-1.5">— none tagged</p>
                )}
              </div>
            </div>

            {work.qualityScore != null && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="text-amber-300 font-semibold">{work.qualityScore}/5</span>
                <span className="text-slate-400">quality benchmark set by the reporter</span>
              </div>
            )}

            {/* Location + hashtags */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {work.location || work.area} — tracked
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {work.hashtags?.map((h) => (
                <span key={h} className="text-[11px]" style={{ color: meta.chip }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Action row */}
            <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> {timeline.length} posts
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-4 h-4" /> {work.shares}
              </span>
              <span className="ml-auto flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> tracked here
              </span>
            </div>
          </Card>

          {/* ===== Tagged workers strip ===== */}
          {taggedWorkers.length > 0 && (
            <Card>
              <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tagged workers
              </p>
              <div className="flex flex-wrap gap-2">
                {taggedWorkers.map((w) => (
                  <span
                    key={w}
                    className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/40 text-xs font-semibold text-orange-300"
                  >
                    @{w}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* ===== Post an update (all 4 roles) ===== */}
          <Card accent={accent}>
            <p className="text-xs font-semibold text-slate-300 mb-2">Post an update to this work</p>
            <div className="flex gap-1.5 mb-2">
              {([
                { k: "issue", label: "Update" },
                { k: "completed", label: "Work done" },
                { k: "failed", label: "Work failed" },
              ] as { k: FeedPostType; label: string }[]).map((t) => (
                <button
                  key={t.k}
                  onClick={() => setUpdateType(t.k)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                    updateType === t.k
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder={`Update ${currentUser?.name || "everyone"} about this work…`}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 text-sm focus:outline-none"
            />
            <Button
              color={role}
              onClick={postUpdate}
              disabled={!draft.trim() || posting}
              className="mt-2"
            >
              {posting ? "Posting…" : "Post update to this work"}
            </Button>
          </Card>

          {/* ===== Timeline ===== */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Timeline · {timeline.length} related {timeline.length === 1 ? "post" : "posts"}
            </p>
            <div className="space-y-2">
              {timeline.map((p, i) => {
                const pMeta = TYPE_META[p.type];
                return (
                  <div key={p.id} className="relative pl-5">
                    {i < timeline.length - 1 && (
                      <span className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-800" />
                    )}
                    <span
                      className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2"
                      style={{ borderColor: pMeta.chip, background: "#0f172a" }}
                    />
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-200">
                          {p.authorRole} · {p.authorName}
                        </span>
                        <span
                          className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{ background: `${roleColor[p.authorRole]}1f`, color: roleColor[p.authorRole] }}
                        >
                          {p.type}
                        </span>
                        <span className="ml-auto">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <p className="text-sm text-slate-300">{p.caption || p.title}</p>
                      {p.taggedWorker && (
                        <p className="mt-1 text-[11px] text-orange-300">
                          👷 @{p.taggedWorker}
                        </p>
                      )}
                      {p.comments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5">
                          {p.comments.slice(0, 2).map((cm) => (
                            <p key={cm.id} className="text-[12px] text-slate-400">
                              <span className="font-semibold text-slate-300">{cm.userName}:</span> {cm.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Button color={role} variant="ghost" onClick={back}>
              ← Back to feed
            </Button>
          </div>
        </div>
      )}
    </ScreenShell>
  );
};

export default WorkTrackingScreen;
