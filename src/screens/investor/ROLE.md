# 🟣 Investor — owned by Teammate D

You own this folder plus:
- `src/api/investorApi.ts`
- `backend/src/controllers/investor.controller.ts`
- `backend/src/routes/investor.routes.ts`

## Shared shell pattern (every role uses this)

```
┌─────────────────────────────┐
│  Top bar: logo · search · 🔔 │
├─────────────────────────────┤
│  Stories/highlights strip     │  ← "Funding deadline today", "Verified completions"
├─────────────────────────────┤
│  MAIN FEED                  │  ← Reddit-style vertical cards
├─────────────────────────────┤
│  Bottom tabs (5):            │
│  Discover · Portfolio · Analytics · 💬 Messages · Settings │
└─────────────────────────────┘
```

- Feed card = one campaign needing funding. Tap → **CampaignDetailScreen** (thread view: cost estimate, worker bids as comments, verification status).
- **[+] center tab** is NOT used for Investor — Portfolio replaces it.
- **Messages tab** = IG-DM inbox; threads are per-funded-project (e.g. "Org ↔ You, re: Andheri Flyover"). On web it renders as a side panel next to the feed.
- **Settings tab** = payment methods, KYC, notification prefs.

## Tab bar

`Discover(feed) · Portfolio · Analytics · Messages · Settings`

## Screens

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

**Already built:** all screens above (incl `MessagesScreen`); v2 5-tab bar `Discover / Portfolio / Analytics / Messages / Settings` (Impact renamed to Analytics, Feed tab removed — Discover is the feed). Remaining per spec: "Hot / Top / New" sort on the Discover feed.

Do not touch `src/screens/citizen/`, `organization/`, `worker/`.
