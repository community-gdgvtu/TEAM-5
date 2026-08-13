import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";
import { getWallet, C, Withdrawal, EarningsTx } from "../../api/workerApi";
import { Badge } from "../../components/common/Badge";
import { Wallet, TrendingUp, Lock, Plus, ArrowUpRight, ArrowDownLeft, Landmark } from "lucide-react";

type WithdrawStatus = Withdrawal["status"];

const STATUS_TONE: Record<WithdrawStatus, string> = {
  Success: "green",
  Processing: "amber",
  Failed: "red",
};

const TX_META: Record<EarningsTx["type"], { tone: string; sign: string; icon: React.ElementType }> = {
  escrow_release: { tone: "green", sign: "+", icon: ArrowDownLeft },
  milestone: { tone: "green", sign: "+", icon: Plus },
  withdrawal: { tone: "red", sign: "-", icon: ArrowUpRight },
  topup: { tone: "blue", sign: "+", icon: Plus },
};

/** Screen 9 — Earnings & Wallet: balance, withdrawal, payment history. */
export const EarningsScreen: React.FC<NavScreenProps> = ({ go }) => {
  const { data, loading } = useFetch<Awaited<ReturnType<typeof getWallet>>>(() => getWallet(), []);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);
  const [method, setMethod] = useState("UPI");
  const [withdrawn, setWithdrawn] = useState<Withdrawal[]>([]);

  const allWithdrawals = [...(withdrawn ?? []), ...(data?.withdrawals ?? [])];
  const balance = data ? data.balance - withdrawn.reduce((s, w) => s + w.amount, 0) : 0;
  const valid = withdrawAmount !== null && withdrawAmount > 0 && withdrawAmount <= balance;

  const request = () => {
    if (!valid) return;
    setWithdrawOpen(false);
    setWithdrawAmount(null);
    setWithdrawn((prev) => [
      { id: `w_${Date.now()}`, method, accountMasked: method === "UPI" ? "•8802@okhdfc" : "HDFC ••• 4521", amount: withdrawAmount!, date: "Today", status: "Processing" },
      ...prev,
    ]);
  };

  return (
    <div className="px-4 pt-4 sm:px-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Earnings & Wallet</h1>
        <p className="text-xs text-slate-400 mt-0.5">Escrow-protected payouts, always traceable.</p>
      </div>

      {loading && <p className="text-center text-slate-500 text-sm py-10">Loading wallet…</p>}

      {data && (
        <>
          {/* Balance hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-orange-600/25 via-slate-900 to-slate-900 border border-orange-500/40"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl bg-orange-500/15 pointer-events-none" />
            <div className="flex items-center gap-2 text-[11px] font-semibold text-orange-300 uppercase tracking-wider">
              <Wallet className="w-4 h-4" /> Available balance
            </div>
            <div className="text-4xl font-extrabold text-white mt-1.5 drop-shadow">{C(balance)}</div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>{C(data.escrowPending)} pending in active escrow</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{C(data.lifetime)} lifetime earnings</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setWithdrawOpen((o) => !o)}
                className="py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-900/30"
              >
                {withdrawOpen ? "Cancel" : "Withdraw →"}
              </motion.button>
              <button
                onClick={() => go("reviews")}
                className="py-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                View reviews
              </button>
            </div>
          </motion.div>

          {/* Withdraw panel */}
          <AnimatePresence>
            {withdrawOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Landmark className="w-4 h-4 text-orange-400" /> Request withdrawal
                  </div>
                  <div className="flex gap-2">
                    {["UPI", "Bank Transfer", "Wallet"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          method === m
                            ? "bg-orange-500/15 text-orange-300 border-orange-500/40"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={withdrawAmount ?? ""}
                      onChange={(e) => setWithdrawAmount(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Processing fee: ₹10</span>
                    <span>Available: {C(balance)}</span>
                  </div>
                  <motion.button
                    whileTap={valid ? { scale: 0.98 } : undefined}
                    onClick={request}
                    disabled={!valid}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      valid
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/30"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Request {withdrawAmount ? C(withdrawAmount) : "withdrawal"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Withdrawals */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Withdrawals</div>
            {allWithdrawals.map((w) => (
              <div key={w.id} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{w.method}</div>
                  <div className="text-[11px] text-slate-400">{w.accountMasked} · {w.date}</div>
                </div>
                <div className="text-sm font-bold text-slate-200">-{C(w.amount)}</div>
                <Badge tone={STATUS_TONE[w.status]}>{w.status}</Badge>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Payment history</div>
            {data.history.map((tx, i) => {
              const meta = TX_META[tx.type];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl"
                >
                  <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg">{tx.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{tx.jobTitle}</div>
                    <div className="text-[11px] text-slate-400">{tx.note} · {tx.date}</div>
                  </div>
                  <div className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {meta.sign}{C(Math.abs(tx.amount))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EarningsScreen;
