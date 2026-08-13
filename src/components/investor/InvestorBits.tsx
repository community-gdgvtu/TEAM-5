import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";
import { Badge } from "../common/Badge";
import { fmtMoney, Campaign } from "../../api/investorApi";

export const statusTone: Record<string, string> = {
  Funding: "amber",
  InProgress: "blue",
  Verified: "green",
  Completed: "purple",
};

export const CampaignCover: React.FC<{ campaign: Campaign; height?: string }> = ({ campaign, height = "h-64" }) => (
  <div
    className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}
    style={{ background: campaign.gradient }}
  >
    <span className="text-7xl drop-shadow-lg">{campaign.emoji}</span>
    <div className="absolute top-2 right-2">
      <Badge tone={statusTone[campaign.status] || "slate"}>{campaign.status}</Badge>
    </div>
    <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[11px] text-white">
      {campaign.area} · {campaign.location}
    </div>
  </div>
);

export const FundingMeter: React.FC<{ campaign: Campaign; color?: string }> = ({ campaign, color = "#a855f7" }) => {
  const pct = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
  return (
    <div className="space-y-1.5">
      <ProgressBar percent={pct} color={color} />
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
      <button onClick={() => setLiked((v) => !v)} className="flex items-center gap-1.5 text-sm" aria-label="Like">
        <Heart className="w-5 h-5" style={{ color: liked ? "#ec4899" : "#cbd5e1", fill: liked ? "#ec4899" : "transparent" }} />
        <span className="text-slate-300">{likeCount.toLocaleString()}</span>
      </button>
      <button onClick={onComment} className="flex items-center gap-1.5 text-sm text-slate-300" aria-label="Comments">
        <MessageCircle className="w-5 h-5" />
        <span>{count}</span>
      </button>
      <button className="flex items-center gap-1.5 text-sm text-slate-300" aria-label="Share">
        <Share2 className="w-5 h-5" />
        <span>{campaign.shares}</span>
      </button>
      <button
        onClick={onFund}
        className="ml-auto px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500"
      >
        Fund
      </button>
    </div>
  );
};

export const TrustRing: React.FC<{ value: number; size?: number; label?: string }> = ({ value, size = 96, label }) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
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
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-extrabold text-white">{value}</div>
        {label && <div className="text-[9px] text-slate-400">{label}</div>}
      </div>
    </div>
  );
};
