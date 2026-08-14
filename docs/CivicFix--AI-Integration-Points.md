# CivicFix — Where AI Needs to Be Integrated (Free API Plan)

This lists every place in the product where AI is doing real work, what it needs to do, and which free-tier APIs can power it for a hackathon build.

---

## 1. Citizen App — Cost Estimate Screen

**Where:** `ReportIssueScreen → CostEstimateScreen`
**What AI does:** Looks at the uploaded photo + category (pothole/streetlight/tree/cleaning), returns a severity score and an estimated repair cost.
**Input:** photo + category + rough location
**Output:** `{ severity: "moderate", estimated_cost_inr: 1400, confidence: 0.82 }`

**Free API options:**
- **Google Gemini API (free tier)** — `gemini-1.5-flash` or `gemini-2.0-flash` — multimodal, accepts image + text prompt directly, generous free quota. Best pick for a hackathon: fast, cheap, good at "describe what's damaged and how bad."
- **Hugging Face Inference API (free tier)** — image classification/captioning models if you want an open-source route instead of a hosted LLM.
- Fallback: if the AI call fails or is rate-limited, use a simple rule-based table (category × keyword in AI's text description × region) so the demo never breaks on stage.

---

## 2. Worker App — Completion Verification

**Where:** `UploadProofScreen → VerificationStatusScreen`
**What AI does:** Compares the "before" photo (from the citizen's report) against the "after" photo (worker's upload) and decides if the same issue was actually fixed.
**Input:** before photo + after photo + issue type/location
**Output:** `{ match: true, confidence: 0.96, notes: "streetlight now lit, pole intact" }`

**Free API options:**
- **Gemini API** again — send both images in one multimodal prompt: "Here is a before photo and an after photo of a [streetlight repair]. Does the after photo show this specific issue resolved? Answer with a confidence score and short reasoning."
- This is the single most important AI call in the whole product — it's what your escrow/payout logic gates on. Budget the most testing time here.

---

## 3. Organization Dashboard — Report Verification

**Where:** `VerifyReportScreen`
**What AI does:** Pre-screens incoming citizen reports — flags duplicates, checks if the photo actually matches the selected category, filters obvious spam/joke submissions before a human reviews them.
**Input:** photo + category + recent nearby reports
**Output:** `{ is_valid: true, is_duplicate: false, flag_reason: null }`

**Free API options:**
- Same Gemini call, different prompt — reuse one AI service module, don't build a separate pipeline.
- Duplicate detection can be mostly non-AI: compare geolocation + category + timestamp proximity in your own DB query, and only call AI to compare photos when two reports are suspiciously close.

---

## 4. Investor Dashboard — Trust/Quality Score

**Where:** `TrustScoreScreen` on the Investor app
**What AI does:** Combines the AI cost-estimate confidence, the org's verification status, and the worker's past rating into one readable trust score investors see before funding.
**Input:** stored confidence scores + worker rating + org verification flag
**Output:** `{ trust_score: 87, label: "High trust" }`

**Free API options:**
- This one doesn't need a live AI call — it's just a weighted formula over data you already generated in steps 1–3. Compute it in your own backend, no API needed. Saves your free-tier quota for the two calls that actually matter (cost estimate + verification).

---

## 5. Dispute Resolution (Organization)

**Where:** `DisputeScreen`
**What AI does:** When a citizen or investor flags a completed job as unsatisfactory, AI re-runs the before/after comparison with a stricter prompt and surfaces a second opinion for the human moderator.
**Input:** before/after photos + the dispute complaint text
**Output:** a written assessment the org staff can read before deciding

**Free API options:**
- Same Gemini multimodal call, prompt adjusted to weigh the citizen's complaint text alongside the photos.

---

## 6. Community Feed / Comments — Content Moderation (optional, nice-to-have)

**Where:** any comment thread (Issue Detail, Job Detail, Campaign Detail)
**What AI does:** Basic toxicity/spam filter on posted comments before they go live.
**Free API options:**
- **Hugging Face Inference API** — free hosted toxicity-classification models (e.g. a `unitary/toxic-bert`-style model) — lightweight, doesn't need a big multimodal call.
- Skip this for the hackathon demo unless you have spare time — it doesn't move the core pitch.

---

## 7. Search/Discovery — "Explore" Feed Ranking (optional, nice-to-have)

**Where:** Citizen `CommunityFeedScreen`, Investor `InvestorDashboardScreen`
**What AI does:** Ranks campaigns by a mix of urgency, funding gap, and trust score instead of plain recency.
**Free API options:**
- No external API needed — this is a sorting formula on your own data, same as the trust score in #4.

---

## Summary Table

| # | Feature | Screen(s) | Needs live AI call? | Suggested free API |
|---|---------|-----------|----------------------|---------------------|
| 1 | Cost estimation | CostEstimateScreen | Yes | Gemini API (free tier) |
| 2 | Completion verification | VerificationStatusScreen | Yes | Gemini API (free tier) |
| 3 | Report pre-screening | VerifyReportScreen | Yes (light use) | Gemini API (free tier) |
| 4 | Trust score | TrustScoreScreen | No — computed formula | — |
| 5 | Dispute re-check | DisputeScreen | Yes | Gemini API (free tier) |
| 6 | Comment moderation | any comment thread | Optional | Hugging Face Inference API |
| 7 | Feed ranking | Community/Investor feeds | No — computed formula | — |

**Bottom line:** you really only need **one** AI service wired up — a multimodal image+text call — reused across cost estimation, verification, pre-screening, and disputes. That's 3–4 different prompts hitting the same API, not 4 different integrations. Get that one service rock-solid first; everything else in the table is either free (formula-based) or optional polish.

---

## Getting a Free Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with a Google account and click "Create API key."
3. Free tier covers a generous number of requests/day — enough for a hackathon demo and judging round.
4. Store the key in your backend `.env` as `AI_API_KEY`, never in frontend code.

## One shared AI service (backend)

Keep this to a single file so every teammate calls the same function instead of writing their own prompt logic:

```
backend/src/services/ai.service.js
  ├── estimateCost(photoUrl, category)        // used by feature #1
  ├── verifyCompletion(beforeUrl, afterUrl)    // used by feature #2
  ├── prescreenReport(photoUrl, category)      // used by feature #3
  └── reviewDispute(beforeUrl, afterUrl, note) // used by feature #5
```

Whoever owns the AI integration builds this file once; every role's controller just calls into it.
