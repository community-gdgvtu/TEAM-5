# CivicFix AI

Decentralizing urban repair through AI-verified community crowdfunding and micro-gig economies.

## Project Overview

CivicFix AI closes the "Civic Execution Gap" — where civic tech systems digitize complaints but fail to digitize solutions. The platform connects citizens, municipal organizations, gig workers, and investors to repair micro-infrastructure (potholes, streetlights, parks, sidewalks) using AI-verified cost estimation, micro-crowdfunding, and AI-verified completion proof.

## Core Problem

- **Municipal Bottleneck**: Minor repairs take ~6 months due to bureaucratic routing and budget constraints
- **Citizen Apathy**: One-way reporting creates black-box experiences; residents stop reporting due to lack of feedback
- **Untapped Workforce**: Local gig workers seek small jobs but have no trustless marketplace connecting them to needed repairs

## Solution

Using accessible multimodal AI to:
- Estimate repair costs via computer vision from citizen photos
- Pool micro-donations securely via UPI/Razorpay
- Verify completed work via AI before/after photo comparison
- Release funds only after verification — trust without a middleman

## 8-Step Core Loop

1. Citizen reports issue (photo + location)
2. AI estimates repair cost
3. Campaign auto-created for micro-crowdfunding
4. Neighbors fund via UPI/cards
5. Gig worker claims job from marketplace
6. Worker completes & submits "after" photo
7. AI verifies completion (before/after match)
8. Funds released from escrow

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| **Frontend** | Flutter (mobile), Next.js + Tailwind (admin) | One codebase for Android/iOS; fast polished dashboards |
| **Backend** | Node.js (Express/NestJS) or Python FastAPI | Keeps AI pipeline in one language |
| **Database** | PostgreSQL + PostGIS, Redis | Relational data, geo-queries, caching |
| **AI/ML** | Multimodal LLM (Claude/GPT-4V) or YOLOv8 | Fast demo reliability or custom CV story |
| **Payments** | Razorpay (UPI support) | India-first, easy sandbox for demo |
| **Storage** | AWS S3 / Cloudinary / Firebase | Before/after photos |
| **Maps** | Google Maps API / Mapbox | Pin issues, show nearby jobs |
| **Notifications** | FCM + Twilio SMS | Keep citizens looped in |
| **Infra** | Vercel + Railway/Render | Free tiers cover hackathon |

## Key Screens (from CivicFix-AI-Screens.md)

### Citizen Role (12 screens)
- Home Feed (map + nearby issues)
- Report New Issue (camera + geo-tag)
- AI Cost Estimate Preview
- Campaign Created / Confirmation
- My Reports (status tracker)
- Issue Detail Page (photos, funding progress)
- Donate to a Campaign
- Community Feed (browse local campaigns)
- Comments/Discussion
- Notifications
- Impact/Leaderboard
- Profile & Settings

### Organization (Municipal Admin) (10 screens)
- Org Dashboard (overview)
- Incoming Reports Queue
- Report Verification Screen
- Push to Marketplace
- Active Jobs Tracker (Kanban)
- Dispute Resolution
- Worker Directory
- Area Analytics
- Team/Access Management
- Settings

### Worker ("Tender") (11 screens)
- Verification/Onboarding
- Job Marketplace Feed
- Job Detail Screen
- Submit Bid/Tender Comment
- Bid Status Screen
- Active Job Screen
- Upload Completion Proof
- AI Verification Status
- Earnings & Wallet
- Ratings & Reviews
- Worker Profile/Portfolio

### Investor / Funder (9 screens)
- Investor Dashboard
- Campaign Detail (Investor View)
- Quality/Trust Score Screen
- Funding Decision Screen
- Portfolio Screen
- Completion & Verification Report
- Payout Confirmation
- Regional Impact Analytics
- Settings

## Build Order (from CivicFix-AI-TechStack.md)

1. Backend + DB schema (users, issues, campaigns, jobs, transactions)
2. Citizen: report issue with photo → backend → S3
3. AI cost estimation: photo → multimodal API → cost estimate
4. Crowdfunding: campaign screen + Razorpay test payment
5. Worker: job feed + claim job
6. Completion proof: worker uploads "after" photo → AI verification
7. Payout: trigger Razorpay payout on verification success
8. Notifications: tie it all together

**If time runs out**, steps 1–4 + 6 make the demo convincing — prioritize AI cost estimate and AI verification.

## Roles

- **Citizen/Community** — report, donate, track progress
- **Organization (Municipal Admin)** — verify reports, manage jobs, analytics
- **Worker (Contractor)** — browse jobs, submit bids, upload proof, earn ratings
- **Investor / Funder** — browse campaigns, fund projects, view impact analytics

## Local Development

All code is in `/home/mike/Desktop/alldown/hackthons/gdg/civic-fix-2`:

- `docs/` — Architecture and screen documentation
- `src/` — Source code
- `server.ts` — Backend entry point
- `components/` — Reusable UI components
- `package.json` / `vite.config.ts` — Build configuration
- `.env.example` — Environment variables template

## Contributing

See `CONTRIBUTING.md` for sprint guidelines (GDGoC Summer DevSprint 2026, Aug 12–14).

## Quick Start

1. Clone the repo
2. Set up `.env` with Firebase, Razorpay, and AI API keys
3. `npm install` + `npm run dev`
4. Deploy to Vercel + Railway using provided CI/CD configs

---

*Hackathon project — prioritize steps 1–4 + 6 for a convincing demo.*