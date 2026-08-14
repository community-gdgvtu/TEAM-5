import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ROLE_CONFIGS } from "../../data/roleConfig";
import {
  UserCheck,
  Building2,
  HardHat,
  TrendingUp,
  MapPin,
  CheckCircle2,
  LogOut,
  PlusCircle,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertTriangle,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Search,
} from "lucide-react";

const ROLE_ICONS: Record<string, React.ElementType> = {
  citizen: UserCheck,
  organization: Building2,
  worker: HardHat,
  investor: TrendingUp,
};

export const RoleDashboard: React.FC = () => {
  const { currentUser, logout, t, theme, toggleTheme, language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  if (!currentUser) return null;

  const cfg = ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.citizen;
  const RoleIcon = ROLE_ICONS[currentUser.role] || UserCheck;

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950" : "min-h-screen bg-slate-100"} />
  );
};