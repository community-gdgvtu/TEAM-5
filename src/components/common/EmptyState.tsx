import React from "react";

/** Friendly empty state so no screen looks broken while data loads. */
export const EmptyState: React.FC<{ title?: string; hint?: string }> = ({
  title = "Nothing here yet",
  hint = "Check back later — new items appear here.",
}) => {
  return (
    <div className="py-10 text-center border border-dashed border-slate-700 rounded-2xl">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  );
};