# CivicFix — Project File Structure (Implemented)

> This is now the **actual** repo layout. The app is a single **Vite + React + Tailwind** web app served by an **Express + MongoDB** backend (with a graceful in-memory fallback when Mongo is down). Each teammate works inside their **own role folder** on both frontend and backend — that's how merge conflicts stay near zero.

Role owners:
- 🟢 **Teammate A** → Citizen
- 🔵 **Teammate B** → Organization
- 🟠 **Teammate C** → Worker
- 🟣 **Teammate D** → Investor

---

## Top-Level Structure

```
civic-fix-2/
├── backend/                 # Express + MongoDB API
├── src/                     # React frontend (role folders)
├── docs/                    # planning docs
├── assets/                  # graphics
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Backend Structure (Express + MongoDB)

```
backend/
├── server.ts                        # entry point — bootstraps app + Vite dev / static prod
└── src/
    ├── app.ts                       # Express assembly, mounts /api router
    ├── config/
    │   ├── env.ts                   # central env access
    │   └── db.ts                    # MongoDB connect + in-memory fallback (getUserModel)
    ├── models/                      # Mongoose schemas — shared, mostly additive
    │   ├── User.model.ts
    │   ├── Issue.model.ts
    │   ├── Campaign.model.ts
    │   ├── Job.model.ts
    │   ├── Bid.model.ts
    │   ├── Transaction.model.ts
    │   └── Review.model.ts
    ├── routes/
    │   ├── index.ts                 # mounts all routers (touched when adding one)
    │   ├── auth.routes.ts           # shared — login/signup/OTP
    │   ├── citizen.routes.ts        # 🟢 Teammate A
    │   ├── organization.routes.ts   # 🔵 Teammate B
    │   ├── worker.routes.ts         # 🟠 Teammate C
    │   └── investor.routes.ts       # 🟣 Teammate D
    ├── controllers/
    │   ├── auth.controller.ts       # shared
    │   ├── citizen.controller.ts    # 🟢 A — mocks fallback
    │   ├── organization.controller.ts # 🔵 B — mocks fallback
    │   ├── worker.controller.ts     # 🟠 C — mocks fallback
    │   └── investor.controller.ts   # 🟣 D — mocks fallback
    ├── services/
    │   ├── phone.util.ts            # E.164 normalization + masking
    │   ├── whatsapp.service.ts      # OTP store + Meta/Twilio/sandbox gateway
    │   ├── ai.service.ts            # estimate + verification (Gemini, mock fallback)
    │   ├── payment.service.ts       # Razorpay/escrow stubs
    │   ├── notification.service.ts  # stub
    │   └── upload.service.ts        # stub
    └── middleware/
        ├── auth.middleware.ts       # Bearer session-token check
        ├── role.middleware.ts       # role guard
        └── errorHandler.ts          # 404 + error handler
```

---

## Frontend Structure (Vite + React + Tailwind)

```
src/
├── App.tsx                          # login vs RootNavigator switch
├── main.tsx
├── index.css
├── types.ts
├── api/                             # API clients — one file per role, matches backend routes
│   ├── index.ts                     # apiFetch helper
│   ├── authApi.ts                   # shared
│   ├── citizenApi.ts                # 🟢 A
│   ├── organizationApi.ts           # 🔵 B
│   ├── workerApi.ts                 # 🟠 C
│   └── investorApi.ts               # 🟣 D
├── screens/
│   ├── shared/                      # Splash, Onboarding, RoleSelect, Login, Signup
│   │   └── (ROLE.md + stubs)
│   ├── citizen/                     # 🟢 A — 10 screens (ROLE.md lists build order)
│   ├── organization/                # 🔵 B — 9 screens
│   ├── worker/                      # 🟠 C — 11 screens
│   └── investor/                    # 🟣 D — 9 screens
├── navigation/
│   ├── RootNavigator.tsx            # shared — role-based switch
│   ├── CitizenNavigator.tsx         # 🟢 A
│   ├── OrgNavigator.tsx             # 🔵 B
│   ├── WorkerNavigator.tsx          # 🟠 C
│   └── InvestorNavigator.tsx        # 🟣 D
├── context/AppContext.tsx           # i18n (5 langs) + theme + auth state
├── hooks/useFetch.ts                # shared data-fetch hook
├── data/roleConfig.ts               # role metadata + accent colors + country codes
├── theme/colors.ts                  # role color tokens — shared design tokens
├── utils/index.ts                   # date/currency/validators
└── components/
    ├── common/ScreenShell.tsx       # shared screen layout
    ├── auth/                        # LoginSignupFlow, CivicosMascot
    ├── dashboard/RoleDashboard.tsx  # working demo hub (each navigator uses it for now)
    └── ui/                          # aurora-background, location-picker, snowfall
```

---

## Why This Avoids Merge Conflicts

- Each role has its **own screen folder, its own API file, its own route file, and its own controller file** — 4 people almost never touch the same file.
- The only shared files (`RootNavigator`, models, `theme/colors.ts`, `routes/index.ts`) should be edited via small, separate PRs — agree who touches these and when.
- Each role screen folder ships a `ROLE.md` listing screens + the demo-critical build order.
- Git branch naming: `feature/citizen-report-screen`, `feature/worker-bid-api`, etc.

---

## `.env` (backend + frontend — see `.env.example`)

```
GEMINI_API_KEY=""
META_WHATSAPP_TOKEN=""
META_PHONE_NUMBER_ID=""
WHATSAPP_TEMPLATE_NAME="civicfix_otp_verification"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_NUMBER=""
OTP_SECRET=""
MONGODB_URI="mongodb://localhost:27017/civicfix"   # optional; falls back to in-memory
PORT=3000
```

---

## Commands

```
npm run dev        # backend/server.ts + Vite HMR  → http://localhost:3000
npm run lint       # tsc --noEmit
npm run build      # vite build + bundle backend/server.ts → dist/
npm run start      # node dist/server.cjs
```

## Next Steps for Teammates

1. Open your `src/screens/<role>/ROLE.md` and build screen stubs in order.
2. Replace the mock responses in `backend/src/controllers/<role>.controller.ts` with real DB queries on the shared models.
3. Swap your real screen into `src/navigation/<Role>Navigator.tsx` once ready.