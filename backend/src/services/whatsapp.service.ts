import crypto from "crypto";
import { env } from "../config/env";
import { E164PhoneResult } from "./phone.util";

export interface OtpStore {
  hashedCode: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const otpStore: Map<string, OtpStore> = new Map();

export function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", env.otpSecret).update(otp).digest("hex");
}

export function saveOtp(fullPhone: string, code: string) {
  const now = Date.now();
  otpStore.set(fullPhone, {
    hashedCode: hashOtp(code),
    expiresAt: now + 5 * 60 * 1000,
    attempts: 0,
    lastSentAt: now,
  });
}

export function getOtp(fullPhone: string): OtpStore | undefined {
  return otpStore.get(fullPhone);
}

export function deleteOtp(fullPhone: string) {
  otpStore.delete(fullPhone);
}

export function isRateLimited(fullPhone: string): boolean {
  const existing = otpStore.get(fullPhone);
  return !!existing && Date.now() - existing.lastSentAt < 15000;
}

export interface SendOtpApiResponse {
  success: boolean;
  provider?: "meta" | "twilio" | "sandbox";
  error?: string;
  errorCode?: string | number;
  devOtp?: string;
}

/**
 * Real Server-side WhatsApp Business API integration dispatcher.
 * Priority: Meta Cloud API -> Twilio -> sandbox console preview.
 */
export async function sendWhatsAppOtp(phone: E164PhoneResult, otpCode: string): Promise<SendOtpApiResponse> {
  const metaToken = env.metaWhatsappToken;
  const phoneNumberId = env.metaPhoneNumberId;

  const twilioSid = env.twilioSid;
  const twilioToken = env.twilioToken;
  const twilioNumber = env.twilioWhatsappNumber;

  const templateName = env.whatsappTemplateName;
  const templateLang = env.whatsappTemplateLang;

  // 1. Meta WhatsApp Cloud API
  if (metaToken && phoneNumberId) {
    try {
      const primaryPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone.e164WithoutPlus,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLang },
          components: [
            { type: "body", parameters: [{ type: "text", text: otpCode }] },
            { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: otpCode }] },
          ],
        },
      };

      let res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${metaToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(primaryPayload),
      });

      let data = await res.json();

      if (!res.ok && data.error && (data.error.code === 100 || data.error.error_subcode === 2494056)) {
        console.warn("[META WHATSAPP] Retrying with single-component body template payload...");
        const fallbackPayload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone.e164WithoutPlus,
          type: "template",
          template: {
            name: templateName,
            language: { code: templateLang },
            components: [{ type: "body", parameters: [{ type: "text", text: otpCode }] }],
          },
        };

        res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: { Authorization: `Bearer ${metaToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(fallbackPayload),
        });

        data = await res.json();
      }

      if (!res.ok || data.error) {
        const errObj = data.error || {};
        const metaCode = errObj.code || res.status;
        const subCode = errObj.error_subcode ? ` (subcode ${errObj.error_subcode})` : "";
        const userMsg = errObj.error_user_msg || errObj.message || "Meta WhatsApp Cloud API delivery failed."

        console.error("[META WHATSAPP API ERROR]", {
          status: res.status,
          code: metaCode,
          subCode,
          message: userMsg,
          details: errObj.error_data?.details,
        });

        let helpfulDetail = userMsg;
        if (metaCode === 132000) {
          helpfulDetail = `Template '${templateName}' in language '${templateLang}' was not found or is not approved in Meta Business Manager.`;
        } else if (metaCode === 131026) {
          helpfulDetail = `Recipient number (${phone.e164}) is not registered on WhatsApp or unable to receive messages.`;
        } else if (metaCode === 190) {
          helpfulDetail = `Meta API access token is expired or invalid. Please update META_WHATSAPP_TOKEN.`;
        } else if (metaCode === 100) {
          helpfulDetail = `Invalid Meta API parameters or Phone Number ID (${phoneNumberId}). ${userMsg}`;
        }

        return {
          success: false,
          provider: "meta",
          errorCode: metaCode,
          error: `Meta WhatsApp API Delivery Error (Code ${metaCode}${subCode}): ${helpfulDetail}`,
        };
      }

      console.log(`[META WHATSAPP SUCCESS] Dispatched OTP to ${phone.e164}. Message ID: ${data.messages?.[0]?.id}`);
      return { success: true, provider: "meta" };
    } catch (err: any) {
      console.error("[META WHATSAPP FETCH EXCEPTION]", err);
      return {
        success: false,
        provider: "meta",
        error: `Meta WhatsApp Gateway Connection Failure: ${err.message || "Unable to reach Meta Cloud API endpoint."}`,
      };
    }
  }

  // 2. Twilio WhatsApp API
  if (twilioSid && twilioToken && twilioNumber) {
    try {
      const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      const cleanTwilioNumber = twilioNumber.startsWith("+") ? twilioNumber : `+${twilioNumber.replace(/\D/g, "")}`;

      const params = new URLSearchParams();
      params.append("To", `whatsapp:${phone.e164}`);
      params.append("From", `whatsapp:${cleanTwilioNumber}`);
      params.append("Body", `Your Civic Fix WhatsApp verification code is: ${otpCode}. Valid for 5 minutes.`);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await res.json();

      if (!res.ok || data.error_code || data.code) {
        const errCode = data.error_code || data.code || res.status;
        const twilioMsg = data.message || "Twilio WhatsApp delivery failed."

        console.error("[TWILIO WHATSAPP ERROR]", {
          status: res.status,
          code: errCode,
          message: twilioMsg,
          moreInfo: data.more_info,
        });

        let helpfulDetail = twilioMsg;
        if (errCode === 21211) {
          helpfulDetail = `Invalid recipient phone number (${phone.e164}). Check number format.`;
        } else if (errCode === 21608) {
          helpfulDetail = `Recipient (${phone.e164}) has not joined your Twilio WhatsApp sandbox or channel.`;
        } else if (errCode === 63015) {
          helpfulDetail = `Twilio WhatsApp channel configuration error or template missing.`;
        } else if (errCode === 20003) {
          helpfulDetail = `Twilio authentication failed. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.`;
        }

        return {
          success: false,
          provider: "twilio",
          errorCode: errCode,
          error: `Twilio WhatsApp API Error (Code ${errCode}): ${helpfulDetail}`,
        };
      }

      console.log(`[TWILIO WHATSAPP SUCCESS] Dispatched OTP to ${phone.e164}. SID: ${data.sid}`);
      return { success: true, provider: "twilio" };
    } catch (err: any) {
      console.error("[TWILIO WHATSAPP FETCH EXCEPTION]", err);
      return {
        success: false,
        provider: "twilio",
        error: `Twilio WhatsApp Gateway Connection Failure: ${err.message || "Unable to reach Twilio API endpoint."}`,
      };
    }
  }

  // 3. Sandbox / Dev Mode
  console.log(`\n================================================================`);
  console.log(`[WHATSAPP BUSINESS API GATEWAY - SANDBOX PREVIEW] Outbound Message`);
  console.log(`Recipient E.164: ${phone.e164}`);
  console.log(`Generated OTP:   [ ${otpCode} ]`);
  console.log(`Mode:            Sandbox / Dev Preview (No META or TWILIO keys configured)`);
  console.log(`Timestamp:       ${new Date().toISOString()}`);
  console.log(`================================================================\n`);

  return {
    success: true,
    provider: "sandbox",
    devOtp: otpCode,
  };
}