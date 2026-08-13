import React from "react";
import { motion } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getReviews, Review } from "../../api/workerApi";
import { Badge } from "../../components/common/Badge";
import { Star } from "lucide-react";

const Stars: React.FC<{ n: number }> = ({ n }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className="w-3.5 h-3.5" style={{ color: i <= n ? "#f59e0b" : "#334155" }} fill={i <= n ? "#f59e0b" : "none"} />
    ))}
  </span>
);

/** Screen 10 — Ratings & Reviews: citizen/org feedback on completed jobs. */
export const ReviewsScreen: React.FC<NavScreenProps> = ({ back }) => {
  const { data, loading } = useFetch<Review[]>(() => getReviews(), []);

  const avg = data?.length ? (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1) : "0.0";
  const summary = { 5: 1, 4: 1, 3: 0, 2: 0, 1: 0 };
  (data || []).forEach((r) => {
    summary[r.rating as keyof typeof summary] = (summary[r.rating as keyof typeof summary] ?? 0) + 1;
  });

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Ratings & Reviews</h1>
          <p className="text-xs text-slate-400 mt-0.5">Feedback from citizens and organizations.</p>
        </div>
        <button onClick={back} className="text-xs text-slate-400 hover:text-white transition-colors">Close</button>
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading reviews…</p>}

      {data && (
        <>
          {/* Summary */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white">{avg}</div>
              <Stars n={Math.round(Number(avg))} />
              <p className="text-[11px] text-slate-400 mt-1.5">{data.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = summary[s as keyof typeof summary] ?? 0;
                const pct = data.length ? (count / data.length) * 100 : 0;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-2">{s}</span>
                    <Star className="w-3 h-3 text-amber-400" fill="#f59e0b" />
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {data.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-lg">{r.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white">{r.author}</span>
                      <Badge tone={r.role === "Organization" ? "blue" : "green"}>{r.role}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{r.jobTitle} · {r.date}</p>
                  </div>
                  <Stars n={r.rating} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">"{r.text}"</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsScreen;
