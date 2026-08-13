# 🟠 Worker — owned by Teammate C

You own this folder plus:
- `src/api/workerApi.ts`
- `backend/src/controllers/worker.controller.ts`
- `backend/src/routes/worker.routes.ts`

Screens to build — stubs are ready for you:

| # | Screen | Purpose |
|---|--------|---------|
| 1 | WorkerOnboardingScreen | Upload ID, select skill category |
| 2 | JobFeedScreen | Nearby open jobs, filter tabs, "Claim Job" CTA |
| 3 | JobDetailScreen | Issue photos, location, AI cost estimate, funding status |
| 4 | SubmitBidScreen | Quote price + timeline (tender comment) |
| 5 | BidStatusScreen | Pending / Awarded / Rejected |
| 6 | ActiveJobScreen | Navigation, job checklist, instructions |
| 7 | UploadProofScreen | Mandatory "after" photo capture |
| 8 | VerificationStatusScreen | Pass/fail/pending on before-after AI match |
| 9 | EarningsScreen | Balance, withdrawal, payment history |
| 10 | ReviewsScreen | Citizen/org feedback on completed jobs |
| 11 | WorkerProfileScreen | Past jobs, before/after gallery, badges |

**Demo-critical (build these first):** JobFeedScreen → SubmitBidScreen → UploadProofScreen → VerificationStatusScreen.

Do not touch `src/screens/citizen/`, `organization/`, `investor/`.