import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

const TOAST_STORE: Toast[] = [];
const MAX_TOASTS = 3;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem("civic_toasts");
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("civic_toasts", JSON.stringify(toasts));
  }, [toasts]);

  const add = (opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { ...opts, id };
    setToasts((prev) => {
      // Remove oldest if at limit
      if (prev.length >= MAX_TOASTS) {
        const newPrev = prev.slice(1);
        newPrev.push(toast);
        return newPrev;
      }
      return [...prev, toast];
    });
    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, opts.duration ?? 5000);
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, add, remove };
};

export const Toast: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { t } = useApp();
  const variants: Record<string, string> = {
    default: "bg-slate-800/90 text-slate-100",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 max-w-sm w-full rounded-xl border border-${toast.variant || "default"} border-opacity-50 px-4 py-3 shadow-lg animate-in slide-in-from-top-0 fade-in-zu items-center gap-3 ${
        variants[toast.variant || "default"]
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium">{toast.title}</p>
        {toast.description && <p className="text-sm line-clamp-2">{toast.description}</p>}
      </div>
      <button
        onClick={() => useApp().currentUser && /* remove toast */ {}}
        className="btn btn-sm icon-btn opacity-70 rounded-md hover:bg-accent"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export const useToastPopup = () => {
  const { add } = useToast();

  const show = (opts: Omit<Toast, "id">) => {
    add({ ...opts, duration: opts.duration ?? 5000 });
  };

  return { show };
};