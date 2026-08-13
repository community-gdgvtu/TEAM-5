import React from "react";
import AuroraBackground from "../ui/aurora-background";
import { ArrowRight, UserCheck, Building2, HardHat, TrendingUp, Camera, Coins, ShieldCheck, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Snap & Report",
    desc: "Citizens capture a photo; our AI scopes the repair and estimates the cost instantly.",
    color: "#22c55e",
  },
  {
    icon: Coins,
    title: "Crowd-Fund Fixes",
    desc: "Neighbors, orgs, and investors pool micro-donations into transparent escrow.",
    color: "#3b82f6",
  },
  {
    icon: HardHat,
    title: "Local Workers",
    desc: "Verified workers claim jobs, complete the work, and get paid on verification.",
    color: "#f97316",
  },
  {
    icon: ShieldCheck,
    title: "AI-Verified",
    desc: "Before/after photos are scored by AI so payouts release only on real completion.",
    color: "#a855f7",
  },
];

const steps = [
  "Report Issue",
  "AI Estimate",
  "Campaign",
  "Community Funds",
  "Worker Claims",
  "Job Done",
  "AI Verify",
  "Payout",
];

const roles = [
  { key: "citizen", label: "Citizen", icon: UserCheck, color: "#22c55e" },
  { key: "organization", label: "Organization", icon: Building2, color: "#3b82f6" },
  { key: "worker", label: "Worker", icon: HardHat, color: "#f97316" },
  { key: "investor", label: "Investor", icon: TrendingUp, color: "#a855f7" },
];

export interface LandingPageProps {
  onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <AuroraBackground theme="dark">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-900/40">
              CF
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Civic Fix</span>
          </div>
          <button
            onClick={onSignIn}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
          >
            Sign In
          </button>
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-5">
            Decentralized Urban Repair
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
            Fix your city with{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI-verified crowdfunding
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl">
            Snap a pothole, fund a fix, claim a job. Civic Fix turns community
            reports into verified, completed repairs — transparently.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSignIn}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <span
                  key={r.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: `${r.color}55`, color: r.color, backgroundColor: `${r.color}11` }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </span>
              );
            })}
          </div>
        </section>

        {/* Feature grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${f.color}22`, color: f.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </section>

        {/* 8-step loop */}
        <section className="py-8">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-4">
            From report to verified completion
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {s}
                </span>
                {i < steps.length - 1 && <span className="text-slate-600">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Trust footer */}
        <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800/40 flex items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp-verified identities
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> On-chain escrow payouts
          </span>
        </footer>
      </div>
    </AuroraBackground>
  );
}
