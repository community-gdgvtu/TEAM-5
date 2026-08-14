import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Zap } from "lucide-react";
import { Badge } from "../common/Badge";
import { CivicImg } from "../common/CivicImg";
import { fmtMoney, Campaign } from "../../api/investorApi";

export const statusTone: Record<string, string> = {
  Funding: "amber",
  InProgress: "blue",
  Verified: "green",
  Completed: "purple",
};

export const CampaignCover: React.FC<{ campaign: Campaign; height?: string }> = ({ campaign, height = "h-64" }) => (
  <div
    className={`group relative w-full ${height} overflow-hidden`}
    style={{ background: campaign.gradient }}
  >
    <CivicImg
      emoji={campaign.emoji}
      alt={campaign.title}
      className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
      rounded=""
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
    <span className="sheen pointer-events-none absolute inset-0" />
    <div className="absolute top-2 right-2 transition-transform duration-300 group-hover:-translate-y-0.5">
      <Badge tone={statusTone[campaign.status] || "slate"}>{campaign.status}</Badge>
    </div>
    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-0.5 text-[11px] text-white border border-white/10">
      {campaign.area} · {campaign.location}
    </div>
  </div>
);

export const FundingMeter: React.FC<{ campaign: Campaign; color?: string }> = ({ campaign, color = "#a855f7" }) => {
  const pct = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
  return (
    <div className="space-y-1.5">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc), linear-gradient(90deg, #a855f7, #ec4899)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300 font-semibold">
          {fmtMoney(campaign.raisedAmount)} <span className="text-slate-500 font-normal">raised of {fmtMoney(campaign.targetAmount)}</span>
        </span>
        <span className="text-slate-400">{campaign.backers} backers</span>
      </div>
    </div>
  );
};

export const PostActions: React.FC<{
  campaign: Campaign;
  onComment?: () => void;
  onFund?: () => void;
  commentCount?: number;
}> = ({ campaign, onComment, onFund, commentCount }) => {
  const [liked, setLiked] = useState(false);
  const likeCount = campaign.likes + (liked ? 1 : 0);
  const count = commentCount ?? campaign.comments.length;
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setLiked((v) => !v)}
        className="flex items-center gap-1.5 text-sm transition-transform duration-200 hover:scale-110 active:scale-90"
        aria-label="Like"
      >
        <Heart
          className="w-5 h-5 transition-colors duration-200"
          style={{ color: liked ? "#ec4899" : "#cbd5e1", fill: liked ? "#ec4899" : "transparent" }}
        />
        <span className="text-slate-300">{likeCount.toLocaleString()}</span>
      </button>
      <button
        onClick={onComment}
        className="flex items-center gap-1.5 text-sm text-slate-300 transition-transform duration-200 hover:scale-110 active:scale-90"
        aria-label="Comments"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{count}</span>
      </button>
      <button
        className="flex items-center gap-1.5 text-sm text-slate-300 transition-transform duration-200 hover:scale-110 active:scale-90"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5" />
        <span>{campaign.shares}</span>
      </button>
      <button
        onClick={onFund}
        className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/40 transition-all duration-300 hover:from-purple-500 hover:to-fuchsia-500 hover:scale-105 active:scale-95"
      >
        <Zap className="w-3.5 h-3.5" /> Fund
      </button>
    </div>
  );
};

export const TrustRing: React.FC<{ value: number; size?: number; label?: string }> = ({ value, size = 96, label }) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div
      className="relative inline-flex items-center justify-center group"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-90"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)" }}
      />
      <svg width={size} height={size} className="-rotate-90 relative drop-shadow-[0_0_10px_rgba(168,85,247,0.35)] transition-transform duration-500 group-hover:scale-105">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#a855f7"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-extrabold text-white">{value}</div>
        {label && <div className="text-[9px] text-slate-400">{label}</div>}
      </div>
    </div>
  );
};
