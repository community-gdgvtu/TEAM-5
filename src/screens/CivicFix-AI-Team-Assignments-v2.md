# CivicFix — Team Assignments v2 (Feed + Messages UI format)

Every role now follows the **same app shell pattern** (Instagram-style bottom tabs + Reddit-style feed cards + a dedicated Messages section), so the 4 apps feel like one product even though 4 different people are building them.

## Shared Shell Pattern (all 4 roles use this)

```
┌─────────────────────────────┐
│  Top bar: logo · search · 🔔 │
├─────────────────────────────┤
│  Stories/highlights strip     │  ← Instagram-style: "Trending near you",
│  (horizontal scroll)          │     "Funding deadline today", etc.
├─────────────────────────────┤
│                               │
│   MAIN FEED                  │  ← Reddit-style vertical card feed:
│   (scrollable cards)         │     photo, title, status pill,
│                               │     progress/upvote bar, comment count
│                               │
├─────────────────────────────┤
│  Bottom tabs (5):            │
│  Feed · Search · [+] · 💬 Messages · Profile │
└─────────────────────────────┘
```

- **Feed card** = one issue / job / campaign. Tap → opens **Detail screen** (Reddit-thread style: big photo, description, status timeline, comment thread underneath).
- **[+] center tab** = the role's primary action (Citizen: report issue · Worker: n/a, replaced with Jobs tab · Org: n/a, replaced with Reports tab · Investor: n/a, replaced with Portfolio tab). Only Citizen truly needs a center "create" button; other roles get a 5-tab bar without it — noted per role below.
- **Messages tab** = Instagram-DM-style inbox. On tablet/web this renders as a **side panel** next to the feed instead of a separate tab. Threads are per-issue/per-job, not freeform chat — e.g. "Org ↔ You, re: Pothole on MG Road."
- **Profile tab** = Instagram-grid style — a grid of the user's own posts/jobs/campaigns with photos, not a boring settings list.

---

# 🟢 Citizen — owned by Teammate A

**Owned:** `src/screens/citizen/*`, `src/api/citizenApi.ts`, `backend/src/controllers/citizen.controller.ts`, `backend/src/routes/citizen.routes.ts`

**Tab bar:** `Feed · Search · Report(+) · Messages · Profile`

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | HomeFeedScreen | Feed tab | Reddit-style card feed of nearby issues/campaigns — photo, funding progress bar, comment count |
| 2 | CommunityFeedScreen | Search/Discover tab | Explore-style grid, filterable by category (like subreddits: "Potholes," "Streetlights," "Trees") |
| 3 | ReportIssueScreen | `+` center tab | Camera capture + geo-tag + category — like Instagram's "new post" flow |
| 4 | CostEstimateScreen | after Report | AI cost estimate preview before posting |
| 5 | IssueDetailScreen | tap any feed card | Reddit-thread view: photo, funding bar, status timeline, comment thread |
| 6 | DonateScreen | inline on Detail screen | "Fund this" action — sits where a like button would be |
| 7 | MessagesScreen | Messages tab | DM-style threads with Org/Workers about your own reports |
| 8 | NotificationsScreen | 🔔 top bar icon | Funding milestones, job claimed, work completed |
| 9 | ProfileScreen | Profile tab | IG-grid of your own reported issues (before/after thumbnails) |
| 10 | LeaderboardScreen | inside Profile | Civic points, badges — shown as a strip above the grid |

**Demo-critical (build first):** ReportIssueScreen → CostEstimateScreen → DonateScreen.
**Do not touch:** `src/screens/organization/`, `worker/`, `investor/`.

---

# 🔵 Organization — owned by Teammate B

**Owned:** `src/screens/organization/*`, `src/api/organizationApi.ts`, `backend/src/controllers/organization.controller.ts`, `backend/src/routes/organization.routes.ts`, `src/navigation/OrgNavigator.tsx`

**Tab bar:** `Reports(feed) · Jobs · Analytics · Messages · Team`
Stack routes off those tabs: `verify`, `push`, `disputes`, `directory`, `settings`.

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | OrgDashboardScreen | opens on login | Overview strip: pending reports, active jobs, funded, completion rate |
| 2 | ReportsQueueScreen | Reports tab (feed) | Reddit-mod-queue style feed of new citizen reports, live arrivals |
| 3 | VerifyReportScreen | `verify` (tap a card) | Detail/thread view — photo + AI feature detection, approve/reject |
| 4 | MarketplacePushScreen | `push` | Confirmation step — approved issue becomes an open job |
| 5 | ActiveJobsScreen | Jobs tab | Kanban: Open → Claimed → In Progress → Submitted → Verified |
| 6 | DisputeScreen | `disputes` | Flagged-job threads — same comment-thread UI as citizen Detail screen |
| 7 | WorkerDirectoryScreen | `directory` | IG-grid of registered workers with ratings |
| 8 | AnalyticsScreen | Analytics tab | Heatmap of issue density, response time, category breakdown |
| 9 | MessagesScreen | Messages tab | DM threads with citizens (report clarifications) and workers (dispute chats) |
| 10 | TeamSettingsScreen | Team tab | Add org staff, set permission levels |
| 11 | SettingsScreen | inside Team tab | Org profile + notification & escrow preferences |

**Demo entry:** "One-Click Demo Login — Organization" on the auth page (role `organization`, reg id `MC-MUM-2026-99`).
**Do not touch:** `src/screens/citizen/`, `worker/`, `investor/`.

---

# 🟠 Worker — owned by Teammate C

**Owned:** `src/screens/worker/*` (all 11 screens), `src/navigation/WorkerNavigator.tsx`, `src/components/worker/WorkerShell.tsx`, `src/data/workerMock.ts`, `src/api/workerApi.ts`

**Tab bar:** `Marketplace(feed) · My Jobs · Wallet · Messages · Profile`

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | WorkerOnboardingScreen | `onboarding` | Upload ID, select skill category + license |
| 2 | JobFeedScreen | Marketplace tab (`feed`) | Reddit-style feed of open jobs, sortable by distance/payout/urgency |
| 3 | JobDetailScreen | `detail` | Thread view: issue photos, location, AI cost estimate, funding status |
| 4 | SubmitBidScreen | `submit` (reply box on Detail) | Quote price + timeline — styled like a top-level comment reply |
| 5 | BidStatusScreen | `bidStatus` | Pending / Awarded / Rejected |
| 6 | ActiveJobScreen | My Jobs tab (`active`) | Navigation to site, checklist, instructions |
| 7 | UploadProofScreen | `upload` | Mandatory "after" photo capture — IG-style photo picker |
| 8 | VerificationStatusScreen | `verification` | AI pass/fail/pending before-after match |
| 9 | MessagesScreen | Messages tab | DM threads with org/citizen about specific jobs |
| 10 | EarningsScreen | Wallet tab (`earnings`) | Balance, withdrawal, payment history |
| 11 | ReviewsScreen | `reviews` | Citizen/org feedback on completed jobs |
| 12 | WorkerProfileScreen | Profile tab (`profile`) | IG-grid of before/after job photos, badges, portfolio |

**Demo entry:** "One-Click Demo Login — Worker" creates a demo contractor who lands on onboarding, then flows through marketplace → bid → active job → proof upload → AI verification → wallet → profile.
**Tab roots:** `marketplace → feed` · `jobs → active` · `wallet → earnings` · `profile → profile`.
**Do not touch:** `src/screens/citizen/`, `organization/`, `investor/`.

---

# 🟣 Investor — owned by Teammate D

**Owned:** `src/screens/investor/*`, `src/api/investorApi.ts`, `backend/src/controllers/investor.controller.ts`, `backend/src/routes/investor.routes.ts`

**Tab bar:** `Discover(feed) · Portfolio · Analytics · Messages · Settings`

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | InvestorDashboardScreen | Discover tab (feed) | Reddit-style feed of campaigns needing funding, sortable "Hot / Top / New" |
| 2 | CampaignDetailScreen | tap any card | Thread view: cost estimate, worker bids as comments, community engagement, verification status |
| 3 | TrustScoreScreen | badge on Detail screen | AI confidence score + org track record + worker rating |
| 4 | FundingDecisionScreen | action on Detail screen | Set contribution amount / accept a worker's quote |
| 5 | PortfolioScreen | Portfolio tab | IG-grid of all funded projects with live status overlay |
| 6 | CompletionReportScreen | tap a Portfolio item | Before/after AI comparison, impact summary |
| 7 | PayoutConfirmScreen | action inside Completion Report | Confirms funds released to worker |
| 8 | MessagesScreen | Messages tab | DM threads with orgs/workers on funded projects |
| 9 | RegionalAnalyticsScreen | Analytics tab | Jobs completed, $ deployed, areas improved |
| 10 | InvestorSettingsScreen | Settings tab | Payment methods, KYC, notification prefs |

**Demo-critical (build first):** InvestorDashboardScreen → FundingDecisionScreen → PayoutConfirmScreen.
**Do not touch:** `src/screens/citizen/`, `organization/`, `worker/`.

---

## Notes for whoever builds `MessagesScreen` in each role folder

Each role owns its **own** `MessagesScreen` (don't try to share one component across roles — the thread list differs per role). But keep the same visual pattern everywhere:
- Left/top: thread list (avatar, name, last message preview, timestamp) — Instagram DM list style
- Right/detail: open thread — bubble chat, with a pinned card at the top showing which issue/job/campaign the thread is about

This keeps all 4 apps visually consistent even though the folders are fully separate.
