/**
 * Shared design tokens — one accent color per role.
 * green = citizen, blue = org, orange = worker, purple = investor.
 * Edit carefully: every screen reads these.
 */
export const COLORS = {
  citizen: "#22c55e",
  organization: "#3b82f6",
  worker: "#f97316",
  investor: "#a855f7",
  surface: "#0f172a",
  surfaceAlt: "#1e293b",
  border: "#1e293b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
};

export type RoleKey = "citizen" | "organization" | "worker" | "investor";

export const roleColor = (role: RoleKey): string => COLORS[role] || COLORS.citizen;