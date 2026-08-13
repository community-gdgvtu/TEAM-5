import React from "react";
import { roleColor, RoleKey } from "../../theme/colors";

/** Shared button with role accent color. */
export const Button: React.FC<{
  onClick?: () => void;
  color?: "citizen" | "organization" | "worker" | "investor";
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, color = "citizen", variant = "primary", disabled, children, className = "" }) => {
  const accent = roleColor((color ?? "citizen") as RoleKey);
  const base =
    "px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed " +
    className;

  if (variant === "ghost") {
    return (
      <button onClick={onClick} disabled={disabled} className={`${base} text-slate-300 hover:text-white hover:bg-slate-700/50`}>
        {children}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} border bg-transparent hover:brightness-125`}
        style={{ borderColor: `${accent}66`, color: accent }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} text-white shadow-lg`}
      style={{ backgroundColor: accent, boxShadow: `0 10px 30px -12px ${accent}88` }}
    >
      {children}
    </button>
  );
};