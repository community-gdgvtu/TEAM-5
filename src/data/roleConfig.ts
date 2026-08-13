import { RoleConfig, CountryCodeOption } from "../types";

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  citizen: {
    id: "citizen",
    title: "Citizen",
    shortDesc: "I live here and want to report or fund local repairs.",
    accentColor: "#22c55e",
    borderColor: "border-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    auroraColors: ["rgba(34,197,94,0.3)", "rgba(16,185,129,0.25)"],
    iconName: "UserCheck",
  },
  organization: {
    id: "organization",
    title: "Organization",
    shortDesc: "Municipal body or civic organization managing public projects.",
    accentColor: "#3b82f6",
    borderColor: "border-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    auroraColors: ["rgba(59,130,246,0.3)", "rgba(14,165,233,0.25)"],
    iconName: "Building2",
  },
  worker: {
    id: "worker",
    title: "Worker",
    shortDesc: "Local handyman, contractor, or technician bidding for repairs.",
    accentColor: "#f97316",
    borderColor: "border-orange-500",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    auroraColors: ["rgba(249,115,22,0.3)", "rgba(234,88,12,0.25)"],
    iconName: "HardHat",
  },
  investor: {
    id: "investor",
    title: "Investor",
    shortDesc: "Individual or entity funding high-impact civic infrastructure.",
    accentColor: "#a855f7",
    borderColor: "border-purple-500",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    auroraColors: ["rgba(168,85,247,0.3)", "rgba(129,140,248,0.25)"],
    iconName: "TrendingUp",
  },
};

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: "+91", country: "India", flag: "🇮🇳", formatPlaceholder: "98765 43210" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸", formatPlaceholder: "(555) 019-2834" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", formatPlaceholder: "7911 123456" },
  { code: "+61", country: "Australia", flag: "🇦🇺", formatPlaceholder: "412 345 678" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", formatPlaceholder: "8123 4567" },
  { code: "+971", country: "UAE", flag: "🇦🇪", formatPlaceholder: "50 123 4567" },
  { code: "+49", country: "Germany", flag: "🇩🇪", formatPlaceholder: "151 23456789" },
];
