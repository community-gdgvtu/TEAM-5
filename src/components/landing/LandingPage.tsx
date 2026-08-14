import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  UserCheck,
  Building2,
  HardHat,
  TrendingUp,
  Camera,
  Coins,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Search,
  HandCoins,
  Wrench,
  ScanLine,
  Menu,
  X,
  ChevronsLeftRight,
  Quote,
  Trophy,
} from "lucide-react";
import { useRouter } from "../../router";
import { CivicImg, CivicAvatar } from "../common/CivicImg";

export interface LandingPageProps {
  onSignIn: () => void;
}

/* =====================================================================
   Motion helpers
   ===================================================================== */

/** Scroll-triggered fade-up reveal. Respects prefers-reduced-motion. */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/** Floating blurred orb for Discord-style ambient energy. */
const Blob: React.FC<{ className?: string; duration?: string; delay?: string; from?: string; to?: string }> = ({
  className = "",
  duration = "14s",
  delay = "0s",
  from = "rgba(255,106,61,0.35)",
  to = "rgba(0,217,163,0.18)",
}) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    style={{
      background: `radial-gradient(circle at 30% 30%, ${from}, ${to} 70%)`,
      animation: `blob-drift ${duration} ease-in-out ${delay} infinite`,
    }}
  />
);

/* =====================================================================
   Data
   ===================================================================== */

const JUST_FIXED = [
  "Sector 22 pothole patched",
  "Streetlight G-14 restored",
  "Drain de-clogged, Sinhagad Rd",
  "Footpath tiles replaced",
  "Storm drain cleared",
  "Zebra crossing repainted",
  "Cable cover secured",
  "Water-main leak sealed",
];

const CITIES = ["Mumbai", "Bengaluru", "Pune", "Kolkata", "Hyderabad", "Chennai", "Indore"];

const PROBLEM_STATS = [
  { value: "5 months", label: "average wait for a municipal fix in Indian cities" },
  { value: "₹8,400", label: "typical single repair cost that sits unfunded" },
  { value: "87%", label: "of repair apps show zero proof of completion" },
];

const STEPS = [
  {
    icon: Camera,
    num: "01",
    photo: "🕳️",
    title: "Report it",
    desc: "Snap the pothole, broken light or choked drain and drop a pin. It lands on your neighbourhood's feed in seconds.",
  },
  {
    icon: Search,
    num: "02",
    photo: "🤖",
    title: "AI prices it",
    desc: "Our AI scopes the damage and estimates the repair cost instantly — an escrow is created on the spot.",
  },
  {
    icon: HandCoins,
    num: "03",
    photo: "🤝",
    title: "Neighbours fund it",
    desc: "Residents, municipal bodies and investors pool micro-donations. Funded campaigns unlock the job.",
  },
  {
    icon: Wrench,
    num: "04",
    photo: "🔨",
    title: "Worker fixes it, AI checks it",
    desc: "A verified local worker repairs it. AI compares before/after photos — only then is the payout released.",
  },
  {
    icon: Trophy,
    num: "05",
    photo: "🏆",
    title: "AI scores it, everyone climbs",
    desc: "AI grades every repair against reviews and awards points — a city-wide leaderboard of citizens, workers, funders and fixes.",
  },
];

/** Mini leaderboard shown inside the how-it-works reward step. */
const REWARD_BOARD = [
  { name: "Ananya Sharma", role: "Reporter", pts: 1240, emoji: "🥇" },
  { name: "Rahul Deshmukh", role: "Worker", pts: 1105, emoji: "🥈" },
  { name: "Nikhil Rao", role: "Funder", pts: 940, emoji: "🥉" },
];

const REWARD_COLORS = ["#00D9A3", "#F4C77B", "#FF6A3D"];

const ROLES = [
  {
    key: "citizen",
    icon: UserCheck,
    photo: "📸",
    title: "Citizen",
    pitch: "See something broken? Report it in seconds.",
    bullets: ["One-tap photo reports", "Track your fix to completion", "Community leaderboards"],
    color: "#22c55e",
  },
  {
    key: "organization",
    icon: Building2,
    photo: "🏛️",
    title: "Organization",
    pitch: "Turn reports into verified work orders.",
    bullets: ["AI triage of your queue", "Push repairs to the local market", "Public proof of every rupee"],
    color: "#3b82f6",
  },
  {
    key: "worker",
    icon: HardHat,
    photo: "🔨",
    title: "Worker",
    pitch: "Get paid for fixing your own street.",
    bullets: ["Claim verified jobs nearby", "Escrow-backed payouts", "Build a verifiable reputation"],
    color: "#f97316",
  },
  {
    key: "investor",
    icon: TrendingUp,
    photo: "🌉",
    title: "Investor",
    pitch: "Fund the fixes that actually move the needle.",
    bullets: ["Vetted infrastructure campaigns", "AI-verified completion", "Real-time impact analytics"],
    color: "#a855f7",
  },
];

const TRUST_POINTS = [
  {
    icon: ScanLine,
    title: "Image-match AI",
    desc: "Before and after photos are scored against the original report — same location, real repair.",
  },
  {
    icon: Coins,
    title: "Escrow, not goodwill",
    desc: "Donations sit in escrow and release only after verification passes. No pay, no play.",
  },
  {
    icon: ShieldCheck,
    title: "A fair dispute path",
    desc: "If verification fails, the worker appeals to a reviewer — the money stays locked until it's settled.",
  },
];

const STORIES = [
  {
    role: "Citizen",
    name: "Ananya S.",
    place: "Mumbai",
    color: "#22c55e",
    text: "Reported a pothole after school, neighbours funded it in a week, and it was patched before the monsoon route reopened.",
  },
  {
    role: "Municipality",
    name: "BMC Ops",
    place: "Mumbai",
    color: "#3b82f6",
    text: "AI triage cut our inspection queue from days to hours. Our crews now spend time on real failures, not guesswork.",
  },
  {
    role: "Worker",
    name: "Rahul D.",
    place: "Bengaluru",
    color: "#f97316",
    text: "Verified jobs with escrow payouts changed everything. I get paid on proof of work, not on promises.",
  },
  {
    role: "Investor",
    name: "Nikhil R.",
    place: "Mumbai",
    color: "#a855f7",
    text: "Every rupee I fund lands in an AI-verified completion. It's the first civic platform I actually trust.",
  },
];

const PHOTO_WALL = [
  { emoji: "🕳️", tag: "Pothole · Sector 22", badge: "✓ Fixed", tone: "bg-verified text-asphalt", sub: "₹42,500 escrowed → released" },
  { emoji: "💡", tag: "Streetlight · G-14", badge: "In progress", tone: "bg-sand text-asphalt", sub: "₹8,200 of ₹9,000 funded", tall: true },
  { emoji: "🔨", tag: "Drain de-clogging · Sinhagad Rd", badge: "Claimed", tone: "bg-safety text-white", sub: "Worker on site · 12:40" },
  { emoji: "📸", tag: "Footpath tiles replaced", badge: "✓ AI verified", tone: "bg-verified text-asphalt", sub: "Before/after match · 94%", tall: true },
  { emoji: "🌳", tag: "Garden refurb", badge: "Funded", tone: "bg-sand text-asphalt", sub: "312 neighbours chipped in" },
  { emoji: "🌉", tag: "Bridge lighting", badge: "Campaign live", tone: "bg-safety text-white", sub: "₹1.2L of ₹2.0L raised" },
];

/* =====================================================================
   Before / After drag slider — real photos, auto-cycling scenarios
   ===================================================================== */

const SORTED_IMAGES = "/imagesuiused/sortedimages";

const SCENARIOS = [
  {
    key: "road",
    before: `${SORTED_IMAGES}/a2-roadfixed-before.webp`,
    after: `${SORTED_IMAGES}/a2-roadfixed-after.webp`,
    label: "Road repair",
    place: "Potholed stretch re-laid",
    status: "Fixed · AI match 93%",
    detail: "Re-laid in 7 days · ₹48,000 released",
  },
  {
    key: "river-cleanup-1",
    before: `${SORTED_IMAGES}/a7-river-before.webp`,
    after: `${SORTED_IMAGES}/a7-river-after.webp`,
    label: "River cleanup",
    place: "Polluted riverbank cleared",
    status: "Fixed · AI match 95%",
    detail: "Cleared in 12 days · ₹36,500 funded",
  },
  {
    key: "river-cleanup-2",
    before: `${SORTED_IMAGES}/a5-river-before.webp`,
    after: `${SORTED_IMAGES}/a5-river-after.webp`,
    label: "River cleanup",
    place: "Garbage hotspot removed",
    status: "Fixed · AI match 97%",
    detail: "Restored in 9 days · ₹28,000 funded",
  },
];

const BeforeAfterSlider: React.FC = () => {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const paused = useRef(false);
  const sc = SCENARIOS[active];

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  };

  const go = (i: number) => {
    setActive(i);
    setPos(50);
  };

  // Auto-advance through scenarios, like a live feed.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!dragging.current && !paused.current) {
        setActive((a) => (a + 1) % SCENARIOS.length);
        setPos(50);
      }
    }, 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={ref}
        className="relative aspect-[16/10] w-full select-none touch-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/60 cursor-ew-resize"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {/* AFTER (bottom layer, right side) */}
        <div className="absolute inset-0">
          <CivicImg
            src={sc.after}
            width={960}
            height={576}
            className="h-full w-full object-cover"
            alt={`${sc.label} after repair`}
            rounded=""
          />
          <div className="pointer-events-none absolute inset-0 bg-verified/10 mix-blend-screen" />
        </div>

        {/* BEFORE (top layer, clipped to the left of the handle) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <CivicImg
            src={sc.before}
            width={960}
            height={576}
            className="h-full w-full object-cover grayscale-[35%]"
            alt={`${sc.label} before repair`}
            rounded=""
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0E1319]/25 via-transparent to-transparent" />
        </div>

        {/* scenario label + live pulse */}
        <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-safety" style={{ animation: "pulse-glow 1.6s ease-in-out infinite" }} />
          Live · {sc.label}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-verified backdrop-blur">
          <ScanLine className="h-3.5 w-3.5" /> {sc.status}
        </span>

        {/* AI-verified stamp on the after side */}
        <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-verified px-2.5 py-1.5 text-[11px] font-bold text-asphalt shadow-lg shadow-black/40">
          <CheckCircle2 className="h-3.5 w-3.5" /> AI verified
        </span>

        {/* Before / After corner labels */}
        <span className="absolute left-3 bottom-3 rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300 backdrop-blur">
          Before
        </span>
        <span className="absolute right-3 bottom-12 rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-verified backdrop-blur">
          After
        </span>

        {/* divider + handle */}
        <div className="absolute inset-y-0 w-0.5 bg-white/85" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-asphalt shadow-lg shadow-black/50">
            <ChevronsLeftRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* scenario pills + caption */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => go(i)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              i === active
                ? "border-verified/50 bg-verified/15 text-verified"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col items-center justify-between gap-1.5 text-center sm:flex-row sm:text-left">
        <p className="text-sm font-semibold text-slate-100">
          {sc.label} · <span className="text-slate-400">{sc.place}</span>
        </p>
        <p className="text-xs text-slate-500">{sc.detail}</p>
      </div>
    </div>
  );
};

/* =====================================================================
   City leaderboard — AI-globe donut with hover-driven slices
   ===================================================================== */

const GlobeLeaderboard: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);
  const total = REWARD_BOARD.reduce((s, r) => s + r.pts, 0);
  const R = 54;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = REWARD_BOARD.map((r, i) => {
    const frac = r.pts / total;
    const dash = frac * C - 4;
    const off = -acc;
    acc += r.pts;
    return { ...r, i, dash, off };
  });

  const current = active === null ? null : REWARD_BOARD[active];

  return (
    <div className="w-full max-w-xs shrink-0 rounded-2xl border border-white/10 bg-[#0E1319]/80 p-4 shadow-lg shadow-black/30">
      <p className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>City leaderboard</span>
        <span className="flex items-center gap-1.5 text-verified">
          <span className="h-1.5 w-1.5 rounded-full bg-verified" style={{ animation: "pulse-glow 1.6s ease-in-out infinite" }} />
          live
        </span>
      </p>

      {/* AI globe donut */}
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
        {/* rotating meridians */}
        <div
          className="absolute -inset-2 rounded-full border border-dashed border-white/10"
          style={{ animation: "spin-slow 24s linear infinite" }}
        />
        <div
          className="absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(60% 60% at 32% 28%, rgba(255,255,255,0.22), transparent 50%), radial-gradient(80% 80% at 70% 80%, rgba(0,217,163,0.10), transparent 60%)",
          }}
        />

        <svg viewBox="0 0 140 140" className="relative h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />
          {segs.map((s) => (
            <circle
              key={s.name}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={REWARD_COLORS[s.i]}
              strokeWidth={active === s.i ? 28 : 16}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={s.off}
              strokeLinecap="round"
              opacity={active === null ? 1 : active === s.i ? 1 : 0.3}
              className="cursor-pointer transition-all duration-300"
              style={{
                filter: active === s.i ? `drop-shadow(0 0 10px ${REWARD_COLORS[s.i]}80)` : undefined,
              }}
              onMouseEnter={() => setActive(s.i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {/* centre readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {current ? (
            <>
              <span className="text-base leading-none">{current.emoji}</span>
              <span className="mt-1 max-w-[5.5rem] truncate text-[11px] font-bold leading-tight text-white">
                {current.name.split(" ")[0]}
              </span>
              <span className="font-mono text-[10px] font-bold" style={{ color: REWARD_COLORS[active!] }}>
                {current.pts.toLocaleString("en-IN")} pts
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-xl font-bold text-white">{total.toLocaleString("en-IN")}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500">points earned</span>
            </>
          )}
        </div>
      </div>

      {/* legend rows */}
      <div className="mt-3 space-y-1.5">
        {REWARD_BOARD.map((r, i) => (
          <button
            key={r.name}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-all duration-300"
            style={{
              background: active === i ? `${REWARD_COLORS[i]}16` : "transparent",
              transform: active === i ? "translateX(2px)" : undefined,
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="w-6 text-center text-sm">{r.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-white">{r.name}</span>
              <span className="block text-[10px]" style={{ color: REWARD_COLORS[i] }}>
                {r.role}
              </span>
            </span>
            <span className="font-mono text-[10px] font-bold text-slate-400">{r.pts.toLocaleString("en-IN")}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* =====================================================================
   Landing page
   ===================================================================== */

export default function LandingPage({ onSignIn }: LandingPageProps) {
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const goReport = () => navigate("/login?next=/citizen/dashboard");
  const goWorker = () => navigate("/login?next=/worker/marketplace");

  const navLinks = [
    { href: "#how-it-works", label: "How it works" },
    { href: "#for-everyone", label: "For everyone" },
    { href: "#ai-verification", label: "AI verification" },
    { href: "#stories", label: "Stories" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0E1319] font-sans text-[#F3F0E9]">
      {/* ================= Nav ================= */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0E1319]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl xl:max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <img
              src="/civic-fix.png"
              alt="CivicFix logo"
              className="h-10 w-10 rounded-xl shadow-lg shadow-black/40"
            />
            <span className="font-display text-lg font-bold tracking-tight">
              CivicFix <span className="text-safety">AI</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={onSignIn}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
            >
              Log in
            </button>
            <button
              onClick={goReport}
              className="rounded-lg bg-[#FF6A3D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition-transform hover:scale-[1.03]"
            >
              Report an issue
            </button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <button
                  onClick={onSignIn}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100"
                >
                  Log in
                </button>
                <button
                  onClick={goReport}
                  className="rounded-lg bg-[#FF6A3D] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Report an issue
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <Blob className="-top-24 left-1/2 h-96 w-96 -translate-x-1/2" from="rgba(255,106,61,0.35)" to="rgba(168,85,247,0.15)" />
        <Blob className="top-1/2 left-[-5rem] h-72 w-72" duration="17s" delay="1.2s" from="rgba(0,217,163,0.35)" to="rgba(59,130,246,0.12)" />
        <Blob className="bottom-[-4rem] right-1/4 h-64 w-64" duration="20s" delay="0.6s" from="rgba(244,199,123,0.3)" to="rgba(255,106,61,0.1)" />

        {/* subtle Discord-style grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "radial-gradient(70% 55% at 50% 30%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(70% 55% at 50% 30%, black 30%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl xl:max-w-7xl items-center gap-14 px-5 pt-14 pb-16 sm:px-8 xl:max-w-7xl xl:grid-cols-2 xl:gap-10 xl:pt-20 xl:pb-24">
          {/* Left: tagline + CTAs */}
          <div className="text-center xl:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-verified shadow-lg shadow-black/20 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-verified" style={{ animation: "pulse-glow 2.4s ease-in-out infinite" }} />
                Decentralized Urban Repair
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display mx-auto mt-7 max-w-4xl text-[2.1rem] font-bold leading-[1.12] tracking-tight sm:text-5xl xl:mx-0 xl:text-[3.2rem]">
                Your street's deteriorating infrastructure isn't the government's problem — it's your{" "}
                <span className="bg-gradient-to-r from-[#00D9A3] via-[#F4C77B] to-[#FF6A3D] bg-clip-text text-transparent">
                  neighbourhood's project.
                </span>
                <span className="mt-3 block bg-gradient-to-r from-[#FF6A3D] via-[#F4C77B] to-[#00D9A3] bg-clip-text text-transparent">
                  Solve it. Earn it.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row xl:justify-start">
                <button
                  onClick={goReport}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A3D] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.04]"
                >
                  Report an issue
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={goWorker}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-slate-100 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors hover:bg-white/10"
                >
                  <HardHat className="h-4 w-4 text-safety" />
                  I'm a contractor
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right: before/after mockup */}
          <Reveal delay={280} className="relative mx-auto mt-2 w-full max-w-4xl xl:mt-0">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-x-8 -top-8 -bottom-8 rounded-[2.5rem] opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 20% 20%, rgba(0,217,163,0.18), transparent 60%), radial-gradient(50% 50% at 80% 30%, rgba(255,106,61,0.16), transparent 60%), radial-gradient(50% 50% at 50% 90%, rgba(168,85,247,0.16), transparent 60%)",
                }}
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-1.5 px-3 pt-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 h-4 flex-1 rounded-md bg-white/[0.05]" />
                </div>
                <BeforeAfterSlider />
              </div>

              {/* floating glass cards (desktop only, so they never collide on phones) */}
              <div
                className="absolute -left-10 top-8 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#131A22]/85 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl xl:flex"
                style={{ animation: "float 7s ease-in-out infinite" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-verified/15 text-verified">
                  <Coins className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">₹42,500 escrowed</div>
                  <div className="text-[10px] text-slate-400">released on AI verify</div>
                </div>
              </div>

              <div
                className="absolute -right-10 top-1/3 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#131A22]/85 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl xl:flex"
                style={{ animation: "float 8s ease-in-out 1.1s infinite" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-safety/15 text-safety">
                  <Wrench className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Worker verified</div>
                  <div className="text-[10px] text-slate-400">on site · 12:40</div>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -left-8 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#131A22]/85 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl xl:flex"
                style={{ animation: "float 9s ease-in-out 0.6s infinite" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand/15 text-sand">
                  <HandCoins className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">312 neighbours</div>
                  <div className="text-[10px] text-slate-400">funded in 5 days</div>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -right-8 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#131A22]/85 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl xl:flex"
                style={{ animation: "float 7.5s ease-in-out 1.7s infinite" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-verified/15 text-verified">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">AI match 94%</div>
                  <div className="text-[10px] text-slate-400">before / after proof</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* live-looking stats — full width under the split */}
          <Reveal delay={360} className="xl:col-span-2">
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Cost estimate", value: "₹42,500" },
                { label: "Funders", value: "312" },
                { label: "AI match", value: "94%" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-center shadow-lg shadow-black/20 backdrop-blur-xl"
                >
                  <div className="font-mono text-xl font-bold text-verified sm:text-2xl">{s.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Ticker strip ================= */}
      <section className="border-y border-white/5 bg-[#101720]/80 py-3">
        <div className="group flex overflow-hidden">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
              style={{ animation: "marquee 30s linear infinite", animationDelay: copy === 1 ? "-15s" : "0s" }}
            >
              {JUST_FIXED.map((item, i) => (
                <span key={`${copy}-${i}`} className="flex items-center gap-3 whitespace-nowrap px-6">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-verified" />
                  <span className="text-sm font-medium text-slate-200">{item}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {CITIES[i % CITIES.length]}
                  </span>
                  <span className="ml-6 h-1 w-1 rounded-full bg-slate-600" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= Problem ================= */}
      <section className="mx-auto max-w-6xl xl:max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
            The civic execution gap is{" "}
            <span className="text-safety">embarrassingly wide.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {PROBLEM_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors hover:border-white/15">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-safety/15 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="font-mono text-3xl font-bold tracking-tight text-safety sm:text-4xl">{s.value}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

{/* ================= How it works ================= */}
      <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-[#10161d]/60">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-verified">How it works</span>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One loop, four moves
              </h2>
              <p className="mt-4 text-slate-400">
                A real process, not a pitch — number one through four, every time.
              </p>
            </div>
          </Reveal>

          {/* ===== Animated flow line with travelling pulse ===== */}
          <div className="relative mx-auto mt-14 hidden max-w-3xl lg:block">
            <div className="absolute inset-x-6 top-6 h-px bg-white/15" />
            {/* travelling dot */}
            <div className="flow-dot absolute top-6 h-3 w-3 -translate-y-1/2 rounded-full bg-verified shadow-[0_0_12px_2px_rgba(0,217,163,0.8)]" />
            {/* connector chevrons */}
            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
              {Array.from({ length: 3 }).map((_, k) => (
                <span key={k} className="relative" style={{ left: `${(k + 1) * 25}%` }}>
                  <svg className="flow-chev h-4 w-4 text-safety" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          {/* ===== Steps grid ===== */}
          <div className="relative mt-10 grid gap-10 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4 lg:gap-6">
            {STEPS.filter((s) => s.num !== "05").map((step, i) => (
              <Reveal key={step.num} delay={i * 140}>
                <div className="group relative flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-verified/40 hover:bg-white/[0.06]">
                  {/* number badge */}
                  <div className="font-mono absolute -top-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-xl border border-white/15 bg-[#0E1319] text-xs font-bold text-safety shadow-lg shadow-black/40">
                    {step.num}
                  </div>
                  {/* image */}
                  <div className="mt-4 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
                    <CivicImg
                      emoji={step.photo}
                      width={200}
                      height={150}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      alt={step.title}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1319]/60 via-transparent to-transparent" />
                  </div>
                  <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg text-verified" style={{ backgroundColor: "rgba(0,217,163,0.12)" }}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-display mt-2 text-base font-bold leading-tight">{step.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ===== Reward loop: AI scores → leaderboard → loop back ===== */}
          <Reveal delay={140}>
            <div className="relative mt-12 overflow-hidden rounded-2xl border border-verified/25 bg-gradient-to-r from-[#0A140F] via-[#0E1319] to-[#0E1319] p-6 sm:p-8">
              {/* ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-verified/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-safety/10 blur-3xl" />

              <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
                {/* Loop-back arrow (reports → more fixes) */}
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-verified/30 bg-verified/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-verified">
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  <span className="hidden sm:inline">loop back to report 01</span>
                  <span className="sm:hidden">loop</span>
                </div>

                {/* AI scoring blurb */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-verified" style={{ backgroundColor: "rgba(0,217,163,0.12)" }}>
                      <Trophy className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{STEPS[4].title}</h3>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{STEPS[4].desc}</p>
                </div>

                {/* Live leaderboard preview */}
                <GlobeLeaderboard />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Keyframe animations for the flow effect */}
      <style>{`
        @keyframes flowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .flow-dot {
          animation: flowTravel 4s linear infinite;
        }
        @keyframes flowTravel {
          0%   { left: 1.5rem; opacity: 0; }
          8%   { opacity: 1; }
          50%  { left: calc(100% - 1.5rem); opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 1.5rem; opacity: 0; }
        }
        .flow-chev {
          animation: chevFade 2s ease-in-out infinite;
        }
        .flow-chev:nth-child(2) { animation-delay: 0.4s; }
        .flow-chev:nth-child(3) { animation-delay: 0.8s; }
        @keyframes chevFade {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ================= Roles bento ================= */}
      <section id="for-everyone" className="mx-auto scroll-mt-20 max-w-6xl xl:max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-sand">For everyone</span>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for all four sides of the fix
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => (
            <Reveal key={r.key} delay={i * 90}>
              <div
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.05] p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-transform hover:-translate-y-1"
                style={{ borderColor: `${r.color}33` }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: `radial-gradient(60% 100% at 50% 0%, ${r.color}55, transparent)` }}
                />
                <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden">
                  <CivicImg
                    emoji={r.photo}
                    width={640}
                    height={360}
                    className="h-24 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    alt={r.title}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: `linear-gradient(to top, #0E1319 4%, ${r.color}22 70%, transparent)` }}
                  />
                </div>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${r.color}1f`, color: r.color }}
                >
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold" style={{ color: r.color }}>
                  {r.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-slate-200">{r.pitch}</p>
                <ul className="mt-4 space-y-2.5">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-slate-400">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: r.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= AI verification ================= */}
      <section id="ai-verification" className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-[#10161d]/60">
        <Blob className="-bottom-24 right-1/5 h-72 w-72" duration="19s" from="rgba(0,217,163,0.3)" to="rgba(255,106,61,0.1)" />
        <div className="relative mx-auto grid max-w-6xl xl:max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 xl:grid-cols-2">
          <Reveal>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-verified">The trust layer</span>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Why would a stranger fund a stranger's pothole?
              </h2>
              <p className="mt-4 max-w-lg text-slate-400">
                Because the money only moves when the work is proven. Here's how the AI keeps every
                fix honest.
              </p>
              <div className="mt-8 space-y-5">
                {TRUST_POINTS.map((p) => (
                  <div key={p.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-verified/10 text-verified">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
              <span
                className="absolute inset-0 rounded-full border border-verified/20"
                style={{ animation: "ping-ring 3s ease-out infinite" }}
              />
              <span
                className="absolute inset-0 rounded-full border border-safety/25"
                style={{ animation: "ping-ring 3s ease-out 1.5s infinite" }}
              />
              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/50 backdrop-blur"
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                <ShieldCheck className="h-16 w-16 text-verified" />
                <div className="absolute -right-3 -top-3 rounded-full bg-safety px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg">
                  94%
                </div>
                <div className="absolute -left-4 -bottom-3 flex items-center gap-1 rounded-full bg-verified/90 px-2.5 py-1 text-[10px] font-bold text-asphalt shadow-lg">
                  <ScanLine className="h-3.5 w-3.5" /> Verified
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Live from the street ================= */}
      <section className="mx-auto scroll-mt-20 max-w-6xl xl:max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-verified">Live from the street</span>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Real fixes, real money, right now
            </h2>
            <p className="mt-4 text-slate-400">
              Every card below is a live campaign — photo in, verified fix out.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTO_WALL.map((item, i) => (
            <Reveal key={item.tag} delay={(i % 3) * 90} className={item.tall ? "lg:row-span-2" : ""}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10">
                <CivicImg
                  emoji={item.emoji}
                  width={640}
                  height={item.tall ? 760 : 400}
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                    item.tall ? "min-h-[260px] h-full lg:min-h-[420px]" : "h-56"
                  }`}
                  alt={item.tag}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1319] via-[#0E1319]/30 to-transparent" />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg ${item.tone}`}
                >
                  {item.badge}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-sm font-bold text-white drop-shadow">{item.tag}</h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300">
                    <Coins className="h-3.5 w-3.5 text-verified" />
                    {item.sub}
                  </div>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00D9A3] to-[#F4C77B]"
                      style={{
                        width: `${i % 2 === 0 ? "100%" : 60 + i * 7}%`,
                        animation: "shimmer 3s linear infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= Stories marquee ================= */}
      <section id="stories" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-5 pt-20 sm:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sand">Stories</span>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Every side of the loop, speaking
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="group relative mt-12 flex overflow-hidden border-y border-white/5 py-6">
          <div
            className="flex shrink-0 items-stretch gap-4 pr-4"
            style={{ animation: "marquee 45s linear infinite" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4">
                {STORIES.map((s) => (
                  <figure
                    key={`${copy}-${s.name}`}
                    className="w-80 shrink-0 rounded-2xl border bg-white/[0.05] p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors group-hover:[animation-play-state:paused] hover:border-white/15"
                    style={{ borderColor: `${s.color}22` }}
                  >
                    <div className="flex items-center gap-3">
                      <CivicAvatar name={s.name} size={40} className="ring-2 ring-white/10" />
                      <div>
                        <div className="text-sm font-bold text-slate-100">{s.name}</div>
                        <div className="text-xs text-slate-500">
                          {s.role} · {s.place}
                        </div>
                      </div>
                      <Quote className="ml-auto h-4 w-4 text-slate-600" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">"{s.text}"</p>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Final CTA ================= */}
      <section className="mx-auto max-w-6xl xl:max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center sm:px-12"
            style={{
              background:
                "radial-gradient(120% 180% at 50% 0%, #241a2e 0%, #123030 48%, #0E1319 100%)",
            }}
          >
            <Blob className="left-1/4 top-0 h-64 w-64" from="rgba(255,106,61,0.4)" to="rgba(0,217,163,0.15)" />
            <Blob className="right-1/5 bottom-0 h-56 w-56" duration="16s" from="rgba(168,85,247,0.35)" to="rgba(255,106,61,0.12)" />
            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                Your street isn't a complaint.
                <br />
                <span className="bg-gradient-to-r from-[#00D9A3] via-[#F4C77B] to-[#FF6A3D] bg-clip-text text-transparent">
                  It's a project.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-slate-300">
                Report the next broken thing, or come fix it. Either way, the neighbourhood is
                watching.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={goReport}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6A3D] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.03]"
                >
                  Report an issue
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={goWorker}
                  className="inline-flex items-center gap-2 rounded-xl border border-verified/40 bg-verified/10 px-7 py-3.5 text-sm font-semibold text-verified transition-colors hover:bg-verified/20"
                >
                  <HardHat className="h-4 w-4" />
                  I'm a contractor
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= Footer ================= */}
      <footer className="border-t border-white/5 bg-[#0c1116]">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <img src="/civic-fix.png" alt="CivicFix logo" className="h-10 w-10 rounded-xl" />
                <span className="font-display text-lg font-bold tracking-tight">
                  CivicFix <span className="text-safety">AI</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                AI-verified urban repair, neighbourhood by neighbourhood.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Report an issue", "Track a fix", "Fund a repair", "Join as a contractor"],
              },
              {
                title: "Roles",
                links: ["Citizens", "Municipal bodies", "Local contractors", "Investors"],
              },
              {
                title: "Company",
                links: ["About", "How AI verification works", "Privacy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-slate-200">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-200">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} CivicFix — a Google AI Studio hackathon build.
            </p>
            <p className="text-[11px] text-slate-600">
              Demo imagery is placeholder and must be swapped for licensed photography before a real launch.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
