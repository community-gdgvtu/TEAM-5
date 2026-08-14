import React from "react";
import { roleColor, RoleKey } from "../../theme/colors";

/** Shared button with role accent color — Discord-inspired. */
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
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed " +
    `shadow-sm ${className}`;

  const padding = "px-3 py-1.5";
  const textClass = "text-sm";

  if (variant === "ghost") {
    return (
      <button onClick={onClick} disabled={disabled} className={`${base} ${padding} text-slate-300 hover:text-white hover:bg-slate-700/50`}>
        {children}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${padding} border bg-transparent hover:brightness-125`}
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
      className={`${base} ${padding} text-white`}
      style={{ backgroundColor: accent, boxShadow: `0 1px 2px 0 ${accent}20` }}
    >
      {children}
    </button>
  );
};