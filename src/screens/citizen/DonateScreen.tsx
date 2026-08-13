import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { NavScreenProps } from "../../navigation/types";

/** Donation amounts, payment method selector (UPI/card), Razorpay confirmation. */
export const DonateScreen: React.FC<NavScreenProps> = () => {
  return (
    <ScreenShell title="Donate" subtitle="Fund a repair" role="citizen">
      <Card>
        <p className="text-sm text-slate-400 mb-3">Select a donation amount.</p>
        <div className="grid grid-cols-3 gap-2">
          <button className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-medium border transition-colors hover:bg-slate-700" onClick={() => alert("₹10 donated")}>₹10</button>
          <button className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-medium border transition-colors hover:bg-slate-700" onClick={() => alert("₹25 donated")}>₹25</button>
          <button className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-medium border transition-colors hover:bg-slate-700" onClick={() => alert("₹50 donated")}>₹50</button>
        </div>
        <p className="text-xs text-slate-300 mt-2">Your contribution helps fund the repair and releases funds to the worker upon AI verification.</p>
      </Card>
      <div>
        <Button color="citizen" onClick={() => window.history.back()}>← Back</Button>
        <Button color="citizen" variant="ghost">Donate Now</Button>
      </div>
    </ScreenShell>
  );
};

export default DonateScreen;