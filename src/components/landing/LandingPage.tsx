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
} from "lucide-react";
import { useRouter } from "../../router";

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
  { value: "14.6 yrs", label: "average wait for a municipal fix in Indian cities" },
  { value: "₹8,400", label: "typical single repair cost that sits unfunded" },
  { value: "87%", label: "of repair apps show zero proof of completion" },
];

const STEPS = [
  {
    icon: Camera,
    num: "01",
    title: "Report it",
    desc: "Snap the pothole, broken light or choked drain and drop a pin. It lands on your neighbourhood's feed in seconds.",
  },
  {
    icon: Search,
    num: "02",
    title: "AI prices it",
    desc: "Our AI scopes the damage and estimates the repair cost instantly — an escrow is created on the spot.",
  },
  {
    icon: HandCoins,
    num: "03",
    title: "Neighbours fund it",
    desc: "Residents, municipal bodies and investors pool micro-donations. Funded campaigns unlock the job.",
  },
  {
    icon: Wrench,
    num: "04",
    title: "Worker fixes it, AI checks it",
    desc: "A verified local worker repairs it. AI compares before/after photos — only then is the payout released.",
  },
];

const ROLES = [
  {
    key: "citizen",
    icon: UserCheck,
    title: "Citizen",
    pitch: "See something broken? Report it in seconds.",
    bullets: ["One-tap photo reports", "Track your fix to completion", "Community leaderboards"],
    color: "#22c55e",
  },
  {
    key: "organization",
    icon: Building2,
    title: "Organization",
    pitch: "Turn reports into verified work orders.",
    bullets: ["AI triage of your queue", "Push repairs to the local market", "Public proof of every rupee"],
    color: "#3b82f6",
  },
  {
    key: "worker",
    icon: HardHat,
    title: "Worker",
    pitch: "Get paid for fixing your own street.",
    bullets: ["Claim verified jobs nearby", "Escrow-backed payouts", "Build a verifiable reputation"],
    color: "#f97316",
  },
  {
    key: "investor",
    icon: TrendingUp,
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

/* =====================================================================
   Before / After drag slider (signature element)
   ===================================================================== */

const BeforeScene: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
    <defs>
      <linearGradient id="b-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c2733" />
        <stop offset="1" stopColor="#10161d" />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#b-sky)" />
    {/* city silhouette */}
    <g fill="#0c1117">
      <rect x="20" y="120" width="34" height="80" />
      <rect x="60" y="142" width="26" height="58" />
      <rect x="90" y="110" width="40" height="90" />
      <rect x="135" y="136" width="24" height="64" />
      <rect x="298" y="126" width="30" height="74" />
      <rect x="334" y="142" width="38" height="58" />
    </g>
    {/* road */}
    <rect x="0" y="180" width="400" height="60" fill="#1a2129" />
    <rect x="0" y="180" width="400" height="4" fill="#0c1117" />
    {/* pothole + cracks */}
    <ellipse cx="150" cy="206" rx="46" ry="16" fill="#0a0e13" />
    <ellipse cx="150" cy="206" rx="33" ry="11" fill="#06090d" />
    <g stroke="#0a0e13" strokeWidth="2" fill="none">
      <path d="M203 206 l24 -6 l15 4" />
      <path d="M97 206 l-21 -8" />
      <path d="M186 195 l11 -13" />
      <path d="M121 193 l-9 -15" />
    </g>
    {/* broken streetlight */}
    <g>
      <rect x="52" y="120" width="6" height="62" rx="2" fill="#2a3644" />
      <path d="M58 126 l34 -10" stroke="#2a3644" strokeWidth="6" strokeLinecap="round" />
      <rect x="82" y="106" width="20" height="10" rx="3" fill="#1a232e" transform="rotate(-24 92 111)" />
    </g>
    {/* warning cone */}
    <g>
      <polygon points="300,208 310,190 320,208" fill="#FF6A3D" />
      <polygon points="306,200 310,190 314,200" fill="#f3f0e9" />
      <rect x="304" y="208" width="22" height="5" rx="2" fill="#FF6A3D" />
    </g>
  </svg>
);

const AfterScene: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
    <defs>
      <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#12242e" />
        <stop offset="1" stopColor="#0f1b24" />
      </linearGradient>
      <radialGradient id="lamp-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#F4C77B" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#FF6A3D" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FF6A3D" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="patch-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#00D9A3" stopOpacity="0.5" />
        <stop offset="1" stopColor="#00D9A3" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="240" fill="url(#a-sky)" />
    {/* city silhouette */}
    <g fill="#0c151c">
      <rect x="20" y="120" width="34" height="80" />
      <rect x="60" y="142" width="26" height="58" />
      <rect x="90" y="110" width="40" height="90" />
      <rect x="135" y="136" width="24" height="64" />
      <rect x="298" y="126" width="30" height="74" />
      <rect x="334" y="142" width="38" height="58" />
    </g>
    {/* road */}
    <rect x="0" y="180" width="400" height="60" fill="#16212c" />
    <rect x="0" y="180" width="400" height="4" fill="#0c1117" />
    {/* repaired patch */}
    <ellipse cx="150" cy="206" rx="50" ry="18" fill="#101a22" />
    <ellipse cx="150" cy="206" rx="44" ry="14" fill="#1b2733" stroke="#2c3e4e" strokeWidth="1.5" />
    <ellipse cx="150" cy="206" rx="40" ry="12" fill="url(#patch-glow)" />
    {/* fixed streetlight with glow */}
    <circle cx="88" cy="112" r="46" fill="url(#lamp-glow)" />
    <g>
      <rect x="52" y="120" width="6" height="62" rx="2" fill="#38485a" />
      <path d="M58 126 l34 -10" stroke="#38485a" strokeWidth="6" strokeLinecap="round" />
      <path d="M82 106 l6 12 -22 0 z" fill="#F4C77B" />
      <rect x="78" y="100" width="20" height="12" rx="4" fill="#4a5d70" />
      <circle cx="88" cy="106" r="3.5" fill="#FFF7E6" />
    </g>
    {/* sapling */}
    <g>
      <rect x="316" y="196" width="4" height="14" rx="2" fill="#2a3644" />
      <circle cx="318" cy="194" r="8" fill="#00D9A3" opacity="0.85" />
      <circle cx="311" cy="198" r="6" fill="#0f3d33" />
    </g>
    {/* soft sand light pool on road */}
    <ellipse cx="88" cy="206" rx="52" ry="10" fill="#F4C77B" opacity="0.08" />
  </svg>
);

const BeforeAfterSlider: React.FC = () => {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  };

  return (
    <div className="w-full">
      <div
        ref={ref}
        className="relative aspect-[5/3] w-full select-none touch-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 cursor-ew-resize"
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
      >
        {/* AFTER (bottom layer, right side) */}
        <div className="absolute inset-0">
          <AfterScene />
        </div>
        {/* BEFORE (top layer, clipped to the left of the handle) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <BeforeScene />
        </div>

        {/* labels */}
        <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300 backdrop-blur">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-verified backdrop-blur">
          After
        </span>

        {/* divider + handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/80"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-asphalt shadow-lg shadow-black/50">
            <ChevronsLeftRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-500">
        Drag the handle — same street, before and after AI verification
      </p>
    </div>
  );
};

/* =====================================================================
   Landing page
   ===================================================================== */

export default function LandingPage({ onSignIn }: LandingPageProps) {
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const goReport = () => navigate("/citizen/dashboard");
  const goWorker = () => navigate("/worker/marketplace");

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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <img
              src="/civic-fix.png"
              alt="CivicFix AI logo"
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
        <Blob className="-top-24 right-[-6rem] h-80 w-80" from="rgba(255,106,61,0.4)" to="rgba(168,85,247,0.15)" />
        <Blob className="top-1/2 left-[-5rem] h-72 w-72" duration="17s" delay="1.2s" from="rgba(0,217,163,0.35)" to="rgba(59,130,246,0.12)" />
        <Blob className="bottom-[-4rem] right-1/4 h-64 w-64" duration="20s" delay="0.6s" from="rgba(244,199,123,0.3)" to="rgba(255,106,61,0.1)" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-2 lg:pt-20 lg:pb-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-verified/30 bg-verified/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-verified">
                <span className="h-1.5 w-1.5 rounded-full bg-verified" style={{ animation: "pulse-glow 2.4s ease-in-out infinite" }} />
                Decentralized Urban Repair
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Your street's pothole isn't the government's problem — it's your{" "}
                <span className="bg-gradient-to-r from-[#00D9A3] via-[#F4C77B] to-[#FF6A3D] bg-clip-text text-transparent">
                  neighbourhood's project.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Citizens report it, AI prices it, neighbours fund it, a local worker fixes it — and AI
                verifies the work before a single rupee moves.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={goReport}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A3D] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.03]"
                >
                  Report an issue
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur transition-colors hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
            </Reveal>

            {/* live-looking stats */}
            <Reveal delay={320}>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  { label: "Cost estimate", value: "₹42,500" },
                  { label: "Funders", value: "312" },
                  { label: "AI match", value: "94%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-3 text-center">
                    <div className="font-mono text-base font-bold text-verified sm:text-lg">{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:pl-4">
            <BeforeAfterSlider />
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
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
            The civic execution gap is{" "}
            <span className="text-safety">embarrassingly wide.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {PROBLEM_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-colors hover:border-white/15">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-safety/15 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="font-mono text-3xl font-bold tracking-tight text-safety sm:text-4xl">{s.value}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= How it works ================= */}
      <section id="how-it-works" className="relative scroll-mt-20 border-t border-white/5 bg-[#10161d]/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
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

          <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden lg:block">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 110}>
                <div className="relative">
                  <div className="font-mono relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0E1319] font-bold text-safety shadow-lg shadow-black/40">
                    {step.num}
                  </div>
                  <div
                    className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl text-verified"
                    style={{ backgroundColor: "rgba(0,217,163,0.1)" }}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Roles bento ================= */}
      <section id="for-everyone" className="mx-auto scroll-mt-20 max-w-6xl px-5 py-20 sm:px-8">
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
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.04] p-6 transition-transform hover:-translate-y-1"
                style={{ borderColor: `${r.color}33` }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: `radial-gradient(60% 100% at 50% 0%, ${r.color}55, transparent)` }}
                />
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
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
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

      {/* ================= Stories marquee ================= */}
      <section id="stories" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
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
                    className="w-80 shrink-0 rounded-2xl border bg-white/[0.04] p-5 transition-colors group-hover:[animation-play-state:paused] hover:border-white/15"
                    style={{ borderColor: `${s.color}22` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                        style={{ backgroundColor: `${s.color}22`, color: s.color }}
                      >
                        {s.name.charAt(0)}
                      </div>
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
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
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
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <img src="/civic-fix.png" alt="CivicFix AI logo" className="h-10 w-10 rounded-xl" />
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
              © {new Date().getFullYear()} CivicFix AI — a Google AI Studio hackathon build.
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
