# CivicFix AI — Next Screens (Critical Demo Path)

This doc documents the additional screens needed for the minimum viable demo, prioritizing the core loop steps 1–4 + 6 (citizen report → AI estimate → crowdfunding → worker job → completion proof).

---

## 1. Report Issue Screen (Citizen)

| # | Element | Description |
|---|---------|-------------|
| 1 | Camera Viewfinder | Full-screen camera with circular capture button at bottom center |
| 2 | Category Chips | Pothole, Streetlight, Tree, Cleaning, Sidewalk, Other (scrollable horizontal strip) |
| 3 | Auto-Location Tag | Shows city/neighborhood detected from GPS; tap to edit |
| 4 | Photo Preview Thumbnail | Small preview of just-taken photo in bottom-right, taps to retake |
| 5 | Submit Button | Primary CTA "Report Issue" — disabled until photo is captured |

---

## 2. AI Cost Estimate Result Screen (Citizen)

| # | Element | Description |
|---|---------|-------------|
| 1 | Severity Bar | Visual bar from "Minor" (green) to "Critical" (red) with AI-generated percentage |
| 2 | Estimated Cost | Large centered text: "Estimated repair cost: $45" |
| 3 | Description Text | AI-generated summary: "Small pothole on Main St — requires asphalt fill + compaction" |
| 4 | Confirm Button | "Use this estimate" — proceeds to campaign creation |
| 5 | Edit Photo | "Retake photo" link to re-run AI estimation |

---

## 3. Campaign Creation Confirmation (Citizen)

| # | Element | Description |
|---|---------|-------------|
| 1 | Campaign Title | Auto-generated: "Fix the pothole on Main St — $45 target" |
| 2 | Funding Progress Bar | Empty bar showing "$0 / $45" with animated fill capability |
| 3 | Share Options | WhatsApp, SMS, Copy Link — "Spread the word to neighbors" |
| 4 | Back Button | "Return to home" — keeps report in draft state |

---

## 4. Donate Screen (Citizen/Investor)

| # | Element | Description |
|---|---------|-------------|
| 1 | Campaign Summary | Photo, issue type, location, AI estimate, current funds raised |
| 2 | Donation Amounts | Preset chips: "$5", "$10", "$20", "$50", "Custom amount" |
| 3 | Payment Method Selector | UPI ID, Card, Net Banking — default to last used |
| 4 | Donate CTA | Primary button — shows spinners during Razorpay sandbox flow |
| 5 | Transaction Confirmation | "Thank you! Your contribution will be released upon verification" |

---

## 5. Job Marketplace Feed (Worker)

| # | Element | Description |
|---|---------|-------------|
| 1 | Filter Tabs | "All Jobs", "Nearby", "My Bids", "Near completion" |
| 2 | Job Cards (grid) | Issue photo, category, distance, AI estimate, funding status |
| 3 | "Claim Job" CTA | Primary button on each card — triggers bid submission flow |
| 4 | Empty State | "No jobs nearby" with prompt to refresh later |

---

## 6. Worker Bid Submission Screen

| # | Element | Description |
|---|---------|-------------|
| 1 | Job Details Summary | Issue photo, location, AI cost estimate visible |
| 2 | Quote Input | Numeric field "Your quoted price: $__" with validation (min $20, max estimate) |
| 3 | Timeline Input | Dropdown: "1 day", "3 days", "1 week", "2 weeks" |
| 4 | Submit Bid Button | Primary CTA — shows "Bid submitted!" toast on success |
| 5 | Cancel Link | "Return to job feed" |

---

## 7. Completion Proof Upload (Worker)

| # | Element | Description |
|---|---------|-------------|
| 1 | Before/After Toggle | Swipe or tab control to view "before" (issue photo) or capture "after" |
| 2 | Capture After Photo | Camera button — mandatory, annotated "Must show completed repair" |
| 3 | Photo Preview | Thumbnail of after-photo with checkmark if lighting is adequate |
| 4 | Submit for AI Verification | Disabled until after-photo is captured |
| 5 | Skip (Explains why) | Small link "Why is this mandatory?" — modal with trust explanation |

---

## 8. AI Verification Result (Worker)

| # | Element | Description |
|---|---------|-------------|
| 1 | Match Confidence Score | Large number: "92% match" with visual gauge (0–100%) |
| 2 | Pass/Fail Status | "Verification passed" (green) or "Review needed" (orange) |
| 3 | Side-by-Side Preview | Left: before photo, Right: after photo with alignment hints |
| 4 | Proceed to Payout | "Funds can now be released" — enables payout CTA |
| 5 | Retake | "Upload different after photo" |

---

## 9. Payout Confirmation (Admin/Worker)

| # | Element | Description |
|---|---------|-------------|
| 1 | Funds Released Summary | "$45 released to worker — verification completed on [date]" |
| 2 | Transaction ID | Razorpay payout reference number |
| 3 | Citizen Notification Toggle | "Notify citizen when work is complete" [checkbox] |
| 4 | Close CTA | "Return to dashboard" |
| 5 | Impact Summary | "This repair improved safety for 2,000+ daily commuters" |

---

## End-to-End Demo Flow Diagram

```
Citizen: Report Issue → AI Estimate → Campaign Created → Donate
         ↓                                   ↓
Worker:    Job Feed → Submit Bid → Complete Job → Upload After Photo
         ↓                                   ↓
Investor:  Browse Campaign → Fund → AI Verification → Payout Released
```

Every role sees the same pipeline move through the loop — the closed loop is the whole pitch.

---