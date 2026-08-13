/**
 * Push / SMS notification service.
 * Placeholder — wire Firebase Cloud Messaging + Twilio SMS here.
 */
export async function notifyUser(userId: string, title: string, body: string) {
  console.log(`[NOTIFICATION] to ${userId} -> ${title}: ${body}`);
}