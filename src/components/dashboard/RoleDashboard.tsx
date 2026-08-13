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
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"} transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
            style={{ backgroundColor: cfg.accentColor }}
          >
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{t("appTitle")}</h1>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${cfg.accentColor}22`,
                  borderColor: `${cfg.accentColor}44`,
                  color: cfg.accentColor,
                }}
              >
                {cfg.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span>
                {currentUser.location.city}, {currentUser.location.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs font-medium focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="es">Español</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Profile Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${cfg.accentColor}15` }} />

          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl text-white shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("verifiedBadge")}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                +91 {currentUser.mobile} • {currentUser.email} • {currentUser.age} yrs
              </p>
              <div className="mt-2 text-xs text-slate-300 flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Role: {cfg.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Jurisdiction: {currentUser.location.city}, {currentUser.location.state}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "issues"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Issues & Projects
            </button>
          </div>
        </div>

        {/* ROLE-SPECIFIC DASHBOARD PANELS */}
        {currentUser.role === "citizen" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Reported Issues</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">3 Active</div>
                <p className="text-[11px] text-slate-400">2 Potholes, 1 Drainage overflow logged</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Community Funded</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">₹12,500 Escrow</div>
                <p className="text-[11px] text-slate-400">4 civic repair drives supported</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Civic Impact Score</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-300">920 Points</div>
                <p className="text-[11px] text-slate-400">Top 5% active citizen in {currentUser.location.city}</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-900/50 rounded-2xl space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Report New Civic Issue</h3>
                <p className="text-xs text-slate-300">
                  Upload photos, mark coordinates, and initiate community repair funding for road hazards, broken lights, or park damage.
                </p>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors">
                  Submit Report
                </button>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-900/50 rounded-2xl space-y-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Fund Neighborhood Fixes</h3>
                <p className="text-xs text-slate-300">
                  Micro-fund local contractor bids with milestone-based smart escrow contracts released only when work is verified.
                </p>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition-colors">
                  Explore Drives
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === "organization" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Municipal Tenders</span>
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">8 Works Open</div>
                <p className="text-[11px] text-slate-400">Jurisdiction: {currentUser.location.city}</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Contractor Bids</span>
                  <HardHat className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">24 Bids Pending</div>
                <p className="text-[11px] text-slate-400">Review skill ratings & license approvals</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Escrow Budget</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">₹4,80,000</div>
                <p className="text-[11px] text-slate-400">100% verified WhatsApp org profile</p>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === "worker" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Open Job Bids</span>
                  <HardHat className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">12 Jobs Nearby</div>
                <p className="text-[11px] text-slate-400">Category: {currentUser.supplementaryData?.workerSkillCategory || "General Civil"}</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Escrow Claimable</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">₹35,000</div>
                <p className="text-[11px] text-slate-400">Milestone 2 photo inspection passed</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Contractor Rating</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-300">4.9 ★★★★★</div>
                <p className="text-[11px] text-slate-400">License: {currentUser.supplementaryData?.workerLicenseId || "Verified"}</p>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === "investor" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Infrastructure Capital</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-300">₹25,00,000</div>
                <p className="text-[11px] text-slate-400">Entity: {currentUser.supplementaryData?.investorEntityName || "Individual"}</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Civic Yield ROI</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">14.2% Social Impact</div>
                <p className="text-[11px] text-slate-400">18 public works accelerated</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>KYC Status</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{currentUser.supplementaryData?.investorKycStatus || "Verified"}</div>
                <p className="text-[11px] text-slate-400">WhatsApp Auth linked & audited</p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Feed / Activity Table */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Active Civic Infrastructure Feed</h3>
            <span className="text-xs text-purple-400 font-medium">Live Stream</span>
          </div>

          <div className="divide-y divide-slate-800">
            {[
              {
                id: "PRJ-901",
                title: "Andheri Flyover Pothole Emergency Resurfacing",
                loc: "Mumbai, Maharashtra",
                budget: "₹85,000 Escrow",
                status: "Work in Progress",
                worker: "Rajesh Verma Contractors",
              },
              {
                id: "PRJ-902",
                title: "Sector 14 Streetlight LED Grid Replacement",
                loc: "Delhi NCR",
                budget: "₹1,20,000 Escrow",
                status: "Bidding Open",
                worker: "Awaiting Bids",
              },
              {
                id: "PRJ-903",
                title: "Koramangala 4th Block Drain Clearing",
                loc: "Bengaluru, Karnataka",
                budget: "₹45,000 Escrow",
                status: "Completed & Verified",
                worker: "City Services Collective",
              },
            ].map((prj) => (
              <div key={prj.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-purple-400">{prj.id}</span>
                    <h4 className="text-sm font-semibold text-slate-100">{prj.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {prj.loc} • Contractor: {prj.worker}
                  </p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {prj.budget}
                  </span>
                  <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg">
                    {prj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
