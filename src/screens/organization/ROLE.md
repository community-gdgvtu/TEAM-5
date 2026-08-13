# 🔵 Organization — owned by Teammate B

You own this folder plus:
- `src/api/organizationApi.ts`
- `backend/src/controllers/organization.controller.ts`
- `backend/src/routes/organization.routes.ts`

Screens to build — stubs are ready for you:

| # | Screen | Purpose |
|---|--------|---------|
| 1 | OrgDashboardScreen | Overview: pending reports, active jobs, funded, completion rate |
| 2 | ReportsQueueScreen | List of new citizen reports awaiting review |
| 3 | VerifyReportScreen | View photo + AI estimate, approve/reject, add notes |
| 4 | MarketplacePushScreen | Approved issue becomes an open job for workers |
| 5 | ActiveJobsScreen | Kanban: Open → Claimed → In Progress → Submitted → Verified |
| 6 | DisputeScreen | Handle flagged jobs (bad work, wrong worker, funding issues) |
| 7 | WorkerDirectoryScreen | Registered workers, ratings, verification status |
| 8 | AnalyticsScreen | Heatmap of issue density, response time, category breakdown |
| 9 | TeamSettingsScreen | Add org staff, set permission levels |

Do not touch `src/screens/citizen/`, `worker/`, `investor/`.