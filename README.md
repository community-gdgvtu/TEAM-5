<div align="center">

# 🏗️ CivicFix AI

### Decentralizing urban repair through AI-verified community crowdfunding and micro-gig economies.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## 🧩 The Problem: The "Civic Execution Gap"

Cities digitize **complaints** but fail to digitize **solutions**. Local communities suffer from deteriorating micro-infrastructure — potholes, broken streetlights, damaged sidewalks — while municipalities are bottlenecked by bureaucratic routing, budget constraints, and limited bandwidth. Citizens lose trust, small repairs snowball into large crises, and local workers who *could* fix these issues have no way to connect with the demand.

CivicFix AI bridges this gap by creating a **decentralized repair ecosystem** where citizens report, communities crowdfund, local workers bid, and AI verifies — all without waiting for municipal budgets.

---

## 🏛️ Architecture: 4-Role System

CivicFix operates through four distinct user roles, each with their own dashboard:

| Role | Color | Description |
|------|-------|-------------|
| 🟢 **Citizen** | Green | Report issues, crowdfund repairs, track progress, vote on priorities |
| 🔵 **Organization** | Blue | Municipal admin — verify reports, manage pipeline, resolve disputes, analytics |
| 🟠 **Worker** | Orange | Local contractors — browse jobs, submit bids, complete repairs |
| 🟣 **Investor** | Purple | Fund repairs, set auto-investment rules, track portfolio impact |

### Flow
```
Citizen Reports → Org Verifies → Crowdfunding → Workers Bid → Repair Completed → AI Verifies → Payout
```

---

## 🔵 Organization Dashboard (Role 2) — 10 Screens

The Organization (Municipal Admin) dashboard is the operational command center. It includes:

### Screen Map

| # | Screen | Component | Description |
|---|--------|-----------|-------------|
| 1 | **Overview** | `OrgOverview.tsx` | KPI cards (Pending, Active, Funded, Resolution Rate), SVG donut chart for status distribution, CSS bar chart for category breakdown, audit log timeline, quick actions |
| 2 | **Incoming Queue** | `IncomingQueue.tsx` | Filterable queue of citizen reports (category, severity, search, safety hazard toggle), bulk approve/reject with reason modal, sort by AI confidence |
| 3 | **Report Verification** | `ReportVerification.tsx` | Two-column deep-dive: photo viewer, location info, reporter profile, AI analysis panel (cost estimate, confidence score, severity reasoning), Haversine duplicate check (200m radius), municipal notes |
| 4 | **Approval Confirmation** | *(within ReportVerification)* | Animated checkmark confirmation when an issue is pushed to the crowdfunding marketplace |
| 5 | **Jobs Pipeline** | `ActiveJobsKanban.tsx` | 5-column Kanban board (Funding → Job Open → In Progress → Submitted → Verified), SLA warning badges, funding progress bars, worker assignments |
| 6 | **Dispute Resolution** | `DisputeResolution.tsx` | Open/Investigating/Resolved tabs, before/after photo comparison, AI verification results, resolution actions with notes |
| 7 | **Worker Directory** | `WorkerDirectory.tsx` | Searchable grid of registered workers — ratings, skill categories, verification status, masked phone numbers, expandable detail cards |
| 8 | **Area Analytics** | `AreaAnalytics.tsx` | Pure SVG charts (category bars, status donut, monthly trends), ward performance table, budget analysis (allocated vs crowdfunded vs AI-estimated) |
| 9 | **Team & Access** | `TeamManagement.tsx` | Staff roster CRUD, permission levels (Admin/Manager/Viewer), category assignment, audit log timeline for org activity |
| 10 | **Settings** | `OrgSettings.tsx` | Org profile, SLA configuration per severity, notification toggles, auto-routing rules preview, JSON/PDF data export, Open Data API toggle |

### Navigation
- Collapsible **sidebar** with blue-accent active states
- **Badge counts** on Incoming Queue (pending reports) and Disputes (open disputes)
- Seamless routing between all 10 screens

---

## 🤖 AI Features

- **Gemini Vision**: Analyzes uploaded photos to auto-detect issue category, estimate severity, and generate repair cost estimates
- **AI Confidence Score**: Each report gets a confidence percentage for the cost estimate
- **AI Verification**: Computer vision compares before/after photos to verify repair quality
- **CIVICOS Chatbot**: AI-powered civic assistant for citizens, workers, and orgs
- **Smart Severity Reasoning**: AI provides human-readable reasoning for severity classifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5, Tailwind CSS 4 |
| **Icons** | Lucide React |
| **AI** | Google Gemini API (multimodal vision + text) |
| **Backend** | Node.js, Express, Vite (SSR) |
| **State** | Singleton StoreManager with localStorage persistence |
| **Charts** | Pure SVG (no chart libraries) |
| **PDF** | Custom PDF generator for area reports |
| **i18n** | Multi-language support (English, Hindi, Kannada) |

---

## 🚀 Run Locally

**Prerequisites:** Node.js (v20+)

```bash
# 1. Install dependencies
npm install

# 2. Set your Gemini API key
#    Edit .env.local and set GEMINI_API_KEY=your_key_here

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Quick Demo

1. Click **"Load Demo Data"** in the top banner to populate sample issues, bids, workers, and disputes
2. Use the **role pills** in the header to switch between Citizen, Organization, Worker, and Investor views
3. For the Org dashboard: navigate through all 10 screens using the left sidebar

---

## 📁 Project Structure

```
src/
├── components/
│   ├── citizen/          # Citizen dashboard screens
│   ├── org/              # Organization dashboard (10 screens)
│   │   ├── OrgDashboard.tsx       # Navigation shell
│   │   ├── OrgOverview.tsx        # KPI + charts
│   │   ├── IncomingQueue.tsx      # Report queue
│   │   ├── ReportVerification.tsx # Verify + approve
│   │   ├── ActiveJobsKanban.tsx   # Pipeline board
│   │   ├── DisputeResolution.tsx  # Dispute management
│   │   ├── WorkerDirectory.tsx    # Worker profiles
│   │   ├── AreaAnalytics.tsx      # Analytics + charts
│   │   ├── TeamManagement.tsx     # Staff CRUD
│   │   └── OrgSettings.tsx        # Configuration
│   ├── worker/           # Worker dashboard screens
│   ├── investor/         # Investor dashboard screens
│   ├── shared/           # Shared components (Header, IssueModal, etc.)
│   └── civicos/          # CIVICOS AI chatbot
├── lib/
│   ├── store.ts          # Singleton state manager
│   ├── aiService.ts      # Gemini AI integration
│   ├── pdfGenerator.ts   # PDF report generation
│   ├── icsGenerator.ts   # Calendar file generation
│   └── i18n.ts           # Internationalization
├── types/
│   └── index.ts          # All TypeScript interfaces
└── main.tsx              # App entry point
```

---

## 👥 Team

Built for a hackathon. Each team member owns one role dashboard:

- **Role 1 (Citizen)** — Community reporting & crowdfunding
- **Role 2 (Organization)** — Municipal admin command center ← *This repo's focus*
- **Role 3 (Worker)** — Contractor job marketplace
- **Role 4 (Investor)** — Impact investment dashboard

---

<div align="center">

**CivicFix AI** — *Turning civic complaints into community solutions* 🏙️

</div>
