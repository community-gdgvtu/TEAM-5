import { env } from "../config/env";

/**
 * Razorpay / escrow logic.
 * Payments are held in escrow (DB) until AI verification passes, then released via Razorpay Payouts.
 * Placeholder — wire Razorpay sandbox here.
 */

export async function createOrder(campaignId: string, amount: number): Promise<{ orderId: string }> {
  if (!env.razorpayKey) {
    console.warn("[PAYMENT] No RAZORPAY_KEY configured — using mock order", { campaignId, amount });
  }
  return { orderId: `order_mock_${Date.now()}` };
}

export async function releasePayout(workerId: string, amount: number, reference: string) {
  console.warn("[PAYMENT] payout requested (mock)", { workerId, amount, reference });
  return { status: "released", reference };
}