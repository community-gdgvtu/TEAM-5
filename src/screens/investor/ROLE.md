# 🟣 Investor — owned by Teammate D

You own this folder plus:
- `src/api/investorApi.ts`
- `backend/src/controllers/investor.controller.ts`
- `backend/src/routes/investor.routes.ts`

Screens to build — stubs are ready for you:

| # | Screen | Purpose |
|---|--------|---------|
| 1 | InvestorDashboardScreen | Browse active campaigns needing funding |
| 2 | CampaignDetailScreen | Cost estimate, worker bids, community engagement, verification status |
| 3 | TrustScoreScreen | AI confidence score + org track record + worker rating |
| 4 | FundingDecisionScreen | Set contribution amount / accept a worker's quote |
| 5 | PortfolioScreen | All funded projects with live status tracking |
| 6 | CompletionReportScreen | Before/after AI comparison, impact summary |
| 7 | PayoutConfirmScreen | Funds released to worker after verification |
| 8 | RegionalAnalyticsScreen | Jobs completed, $ deployed, areas improved |
| 9 | InvestorSettingsScreen | Payment methods, KYC, notification prefs |

**Demo-critical (build these first):** InvestorDashboardScreen → FundingDecisionScreen → PayoutConfirmScreen.

Do not touch `src/screens/citizen/`, `organization/`, `worker/`.