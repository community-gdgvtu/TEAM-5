import React, { useState } from "react";
import { NavScreenProps } from "../../navigation/types";
import { useApp } from "../../context/AppContext";
import { useRouter } from "../../router";
import { CreditCard, ShieldCheck, Bell, Globe, LogOut, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../../components/common/Badge";

/** Screen 9 — Investor Settings. */
export const InvestorSettingsScreen: React.FC<NavScreenProps> = ({ go, back }) => {
  const { currentUser, logout } = useApp();
  const { navigate } = useRouter();
  const [notifs, setNotifs] = useState(true);
  const [impactAlerts, setImpactAlerts] = useState(true);
  const [autoFund, setAutoFund] = useState(false);

  const Row: React.FC<{ icon: React.ElementType; label: string; value?: string; onClick?: () => void; tone?: string }> = ({
    icon: Icon,
    label,
    value,
    onClick,
    tone = "text-slate-300",
  }) => (
    <button onClick={onClick} className="group w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-left transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-600/5 hover:translate-x-1 hover:shadow-lg hover:shadow-purple-900/20 active:scale-[0.99]">
      <Icon className="w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-purple-300 group-hover:scale-110" />
      <span className={`flex-1 text-sm ${tone}`}>{label}</span>
      {value && <span className="text-xs text-slate-400">{value}</span>}
      <ChevronRight className="w-4 h-4 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-purple-300" />
    </button>
  );

  const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
    <button
      onClick={onClick}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-purple-600" : "bg-slate-700"}`}
      aria-label="Toggle"
    >
      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );

  return (
    <div className="p-4 space-y-3 sm:mx-auto sm:max-w-2xl sm:px-6">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-xs text-slate-400">{currentUser?.name || "Investor"}</p>
      </div>

      <div className="space-y-2">
        <Row icon={CreditCard} label="Payment methods" value="UPI · Card" />
        <Row
          icon={ShieldCheck}
          label="KYC & entity"
          value={currentUser?.supplementaryData?.investorKycStatus || "Verified"}
          tone="text-emerald-300"
        />
        <div className="w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 transition-colors duration-300 hover:border-slate-700">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-sm text-slate-300">Notifications</span>
          <Toggle on={notifs} onClick={() => setNotifs((v) => !v)} />
        </div>
        <div className="w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 transition-colors duration-300 hover:border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-sm text-slate-300">Impact alerts</span>
          <Toggle on={impactAlerts} onClick={() => setImpactAlerts((v) => !v)} />
        </div>
        <div className="w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 transition-colors duration-300 hover:border-slate-700">
          <SparklesLite />
          <span className="flex-1 text-sm text-slate-300">Auto-fund top-trust campaigns</span>
          <Toggle on={autoFund} onClick={() => setAutoFund((v) => !v)} />
        </div>
        <Row icon={Globe} label="Language" value="English" />
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-rose-500/20 hover:border-rose-500/50 hover:scale-[1.02] active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <Badge tone="green"><CheckCircle2 className="w-3 h-3 mr-1" /> Escrow-secured</Badge>
        <Badge tone="purple">WhatsApp verified</Badge>
      </div>
    </div>
  );
};

const SparklesLite: React.FC = () => <span className="w-4 h-4 text-slate-400">✦</span>;

export default InvestorSettingsScreen;
