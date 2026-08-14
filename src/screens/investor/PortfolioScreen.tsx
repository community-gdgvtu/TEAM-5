import React from "react";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getPortfolio, fmtMoney, Campaign } from "../../api/investorApi";
import { useApp } from "../../context/AppContext";
import { LayoutGrid, CheckCircle2, Coins } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { CivicImg } from "../../components/common/CivicImg";
import { statusTone } from "../../components/investor/InvestorBits";

/** Screen 5 — Portfolio: funded projects with live status (profile-grid style). */
export const PortfolioScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { currentUser } = useApp();
  const { data } = useFetch<Campaign[]>(() => getPortfolio(), []);

  const list = data || [];
  const deployed = list.reduce((s, c) => s + (c.payout?.released ?? c.raisedAmount), 0);
  const backers = list.reduce((s, c) => s + c.backers, 0);
  const initials = (currentUser?.name || "IV").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="pb-4">
      {/* Profile header */}
      <div className="p-4 flex items-center gap-4 border-b border-slate-800/60">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-xl font-bold text-white ring-2 ring-purple-500/30 shadow-lg shadow-purple-900/30 transition-transform duration-300 hover:scale-105">
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-white">{currentUser?.name || "Investor"}</div>
          <div className="text-xs text-slate-400">
            {currentUser?.supplementaryData?.investorEntityName || "Civic Impact Fund"}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Badge tone="green"><CheckCircle2 className="w-3 h-3 mr-1" /> KYC {currentUser?.supplementaryData?.investorKycStatus || "Verified"}</Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-800/60 border-b border-slate-800/60">
        <div className="py-3 text-center">
          <div className="text-lg font-bold text-white">{list.length}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Funded</div>
        </div>
        <div className="py-3 text-center">
          <div className="text-lg font-bold text-white">{fmtMoney(deployed)}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Deployed</div>
        </div>
        <div className="py-3 text-center">
          <div className="text-lg font-bold text-white">{backers.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Backers</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-400">
        <LayoutGrid className="w-3.5 h-3.5" /> Funded projects
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1 px-1 sm:px-4">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => (c.status === "Completed" || c.status === "Verified" ? go("completion", { id: c.id }) : go("detail", { id: c.id }))}
            className="group relative aspect-square rounded-md overflow-hidden card-lift"
            style={{ background: c.gradient }}
          >
            <CivicImg emoji={c.emoji} alt={c.title} className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-110" rounded="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-purple-400/50" />
            <div className="absolute top-1 right-1 transition-transform duration-300 group-hover:-translate-y-0.5">
              <Badge tone={statusTone[c.status] || "slate"}>{c.status}</Badge>
            </div>
            <div className="absolute bottom-1 left-1 right-1 bg-black/45 rounded px-1.5 py-0.5 text-[9px] text-white truncate transition-colors duration-300 group-hover:bg-purple-600/70">
              {fmtMoney(c.raisedAmount)}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4">
        <button
          onClick={() => go("impact")}
          className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-600/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/20 active:scale-95"
        >
          <Coins className="w-4 h-4" /> Regional impact analytics →
        </button>
      </div>
    </div>
  );
};

export default PortfolioScreen;
