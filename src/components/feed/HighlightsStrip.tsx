import React from "react";
import { Sparkles } from "lucide-react";
import { CivicImg } from "../common/CivicImg";

export interface HighlightItem {
  id: string;
  label: string;
  sublabel: string;
  emoji: string;
  accent: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "h-trending",
    label: "Trending near you",
    sublabel: "Potholes · MG Road",
    emoji: "🕳️",
    accent: "#FF6A3D",
  },
  {
    id: "h-deadline",
    label: "Funding deadline today",
    sublabel: "6 campaigns · 4 hrs left",
    emoji: "⏰",
    accent: "#a855f7",
  },
  {
    id: "h-verified",
    label: "AI-verified this week",
    sublabel: "47 fixes completed",
    emoji: "🤖",
    accent: "#00D9A3",
  },
  {
    id: "h-new",
    label: "New reports in your ward",
    sublabel: "Streetlights · Bandra",
    emoji: "💡",
    accent: "#f4c77b",
  },
  {
    id: "h-funding",
    label: "Fully funded",
    sublabel: "Cleaning · Colaba",
    emoji: "💰",
    accent: "#22c55e",
  },
];

/** Instagram-style stories/highlights strip above the citizen feed. */
export const HighlightsStrip: React.FC<{ onClick?: (item: HighlightItem) => void }> = ({ onClick }) => {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-verified" />
          Highlights
        </span>
        <span className="text-[11px] text-slate-500">Live now</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {HIGHLIGHTS.map((item) => (
          <button
            key={item.id}
            onClick={() => onClick?.(item)}
            className="shrink-0 w-24 text-left group"
          >
            <div
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 relative transition-transform group-hover:scale-[1.03]"
              style={{ borderColor: `${item.accent}66` }}
            >
              <CivicImg
                emoji={item.emoji}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                alt={item.label}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-slate-200 leading-tight line-clamp-2">
              {item.label}
            </p>
            <p className="text-[9px] text-slate-500 truncate">{item.sublabel}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HighlightsStrip;
