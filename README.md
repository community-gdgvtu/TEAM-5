# TEAM-5

# CivicFix 

**Decentralizing urban repair through AI-verified community crowdfunding and micro-gig economies.**

Built for the GDG Hackathon — Team 5

---

## The Problem

Local communities suffer from deteriorating micro-infrastructure (potholes, broken streetlights, damaged sidewalks). Municipal systems digitize complaints but fail to digitize solutions. This creates three systemic failures:

1. **Municipal Bottleneck** — Bureaucratic routing and budget constraints leave minor repairs unresolved for months
2. **Black-Box Reporting** — Citizens submit issues with no feedback, breeding civic apathy
3. **Untapped Workforce** — Local gig workers lack a centralized marketplace for small, immediate jobs

## The Solution

CivicFix AI closes the loop with an AI-powered, community-driven repair platform:

1. **Citizen reports** a civic issue with a photo (auto geo-tagged)
2. **AI estimates** the repair cost via computer vision
3. **Community funds** the repair through micro-crowdfunding
4. **Local worker** claims the job from a gig marketplace
5. **AI verifies** completion by comparing before/after photos
6. **Funds released** via escrow only after verification

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Backend | Express.js, Node.js |
| Animations | Framer Motion |
| Icons | Lucide React |
| Auth | WhatsApp Business API (Meta/Twilio), OTP verification |
| AI | Google Gemini API (cost estimation, completion verification) |
| Hosting | Vercel / Railway / Render |

## User Roles

| Role | Description | Accent Color |
|---|---|---|
| **Citizen** | Report issues, donate to campaigns, track progress | Green |
| **Organization** | Municipal body reviewing reports, managing tenders | Blue |
| **Worker** | Local contractor bidding on and completing repairs | Orange |
| **Investor** | Funding high-impact civic infrastructure projects | Purple |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd civic-fix-2

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` and configure:

```env
# Gemini AI (required for AI features)
GEMINI_API_KEY="your_key"

# WhatsApp OTP (Meta or Twilio — optional, runs in sandbox mode without)
META_WHATSAPP_TOKEN=""
META_PHONE_NUMBER_ID=""
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
civic-fix-2/
├── server.ts                  # Express backend (API + Vite dev server)
├── src/
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── types.ts               # TypeScript types
│   ├── context/
│   │   └── AppContext.tsx      # Global state + i18n translations
│   ├── data/
│   │   └── roleConfig.ts      # Role configs + country codes
│   ├── lib/
│   │   └── api/
│   │       └── auth.ts        # WhatsApp OTP API client
│   └── components/
│       ├── auth/
│       │   ├── LoginSignupFlow.tsx
│       │   └── CivicosMascot.tsx
│       ├── dashboard/
│       │   └── RoleDashboard.tsx
│       └── ui/
│           ├── aurora-background.tsx
│           ├── location-picker.tsx
│           └── snowfall.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

## Features

- **WhatsApp OTP Authentication** — Secure login via Meta WhatsApp Cloud API or Twilio
- **Multi-Language Support** — English, Hindi, Spanish, Marathi, Tamil
- **Role-Based Dashboards** — Tailored views for each user type
- **Dark / Light Theme** — Toggle with system preference
- **AI Cost Estimation** — Computer vision estimates repair costs from photos
- **AI Completion Verification** — Before/after photo comparison for trustless payouts
- **Community Crowdfunding** — Micro-donations pooled via escrow
- **Gig Marketplace** — Local workers bid on nearby repair jobs
- **Responsive Design** — Works on mobile and desktop

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/auth/whatsapp-status` | WhatsApp gateway provider status |
| POST | `/api/auth/check-number` | Check if mobile number is registered |
| POST | `/api/auth/send-otp` | Send WhatsApp OTP |
| POST | `/api/auth/verify-otp` | Verify OTP and authenticate |

## License

MIT
