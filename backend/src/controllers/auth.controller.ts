import { Request, Response } from "express";
import crypto from "crypto";
import { env } from "../config/env";
import { isMongoConnected, getUserModel } from "../config/db";
import { normalizeToE164, maskPhoneNumber } from "../services/phone.util";
import {
  sendWhatsAppOtp,
  saveOtp,
  getOtp,
  deleteOtp,
  isRateLimited,
  hashOtp,
} from "../services/whatsapp.service";

/**
 * WhatsApp OTP verification flow — shared auth.
 * - check-number: is this number already registered?
 * - send-otp: dispatch rate-limited, hashed OTP via WhatsApp gateway
 * - verify-otp: verify hash, create-or-update user, return session token
 */

export async function checkNumber(req: Request, res: Response) {
  const { mobile, countryCode = "+91" } = req.body || {};
  const phoneResult = normalizeToE164(mobile, countryCode);

  if (!phoneResult.isValid) {
    return res.status(400).json({ error: phoneResult.error });
  }

  try {
    const existingUser = await getUserModel()
      
      .findOne({ mobile: phoneResult.nationalDigits, countryCode: phoneResult.countryCode })
      ?.lean();

    if (existingUser) {
      return res.json({
        exists: true,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          role: existingUser.role,
          maskedPhone: maskPhoneNumber(phoneResult),
          e164: phoneResult.e164,
          location: existingUser.location,
        },
      });
    }

    return res.json({ exists: false, e164: phoneResult.e164 });
  } catch (err) {
    console.error("[DB ERROR] check-number:", err);
    return res.status(500).json({ error: "Database error while checking user." });
  }
}

export async function whatsappStatus(_req: Request, res: Response) {
  const activeProvider =
    env.metaWhatsappToken && env.metaPhoneNumberId
      ? "Meta WhatsApp Cloud API"
      : env.twilioSid && env.twilioToken
      ? "Twilio WhatsApp API"
      : "Sandbox Preview Mode";

  res.json({
    status: "online",
    activeProvider,
    metaConfigured: !!(env.metaWhatsappToken && env.metaPhoneNumberId),
    twilioConfigured: !!(env.twilioSid && env.twilioToken),
    templateName: env.whatsappTemplateName,
  });
}

export async function sendOtp(req: Request, res: Response) {
  const { mobile, countryCode = "+91" } = req.body || {};

  const phoneResult = normalizeToE164(mobile, countryCode);
  if (!phoneResult.isValid) {
    return res.status(400).json({ error: phoneResult.error });
  }

  const fullPhone = phoneResult.e164;

  if (isRateLimited(fullPhone)) {
    return res.status(429).json({ error: "Please wait 15 seconds before requesting another verification code." });
  }

  const randomInt = crypto.randomInt(100000, 999999);
  const otpCode = randomInt.toString();

  saveOtp(fullPhone, otpCode);

  const sendResult = await sendWhatsAppOtp(phoneResult, otpCode);

  if (!sendResult.success) {
    return res.status(sendResult.errorCode ? 400 : 502).json({
      error: sendResult.error || "WhatsApp OTP delivery failed. Please check your number and try again.",
      provider: sendResult.provider,
      errorCode: sendResult.errorCode,
    });
  }

  try {
    const existingUser = await getUserModel()
      
      .findOne({ mobile: phoneResult.nationalDigits, countryCode: phoneResult.countryCode })
      ?.lean();

    return res.json({
      success: true,
      maskedPhone: maskPhoneNumber(phoneResult),
      e164: phoneResult.e164,
      provider: sendResult.provider,
      isReturning: !!existingUser,
      existingName: existingUser ? existingUser.name : undefined,
      existingRole: existingUser ? existingUser.role : undefined,
      devOtp: sendResult.devOtp,
    });
  } catch (err) {
    console.error("[DB ERROR] send-otp:", err);
    return res.status(500).json({ error: "Database error while checking user status." });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  const { mobile, countryCode = "+91", code, userData } = req.body || {};

  const phoneResult = normalizeToE164(mobile, countryCode);
  if (!phoneResult.isValid) {
    return res.status(400).json({ error: phoneResult.error });
  }

  if (!code || typeof code !== "string" || code.trim().length !== 6) {
    return res.status(400).json({ error: "Valid 6-digit verification code is required." });
  }

  const fullPhone = phoneResult.e164;
  const storedOtp = getOtp(fullPhone);

  if (!storedOtp) {
    return res.status(400).json({ error: "No pending verification code found for this number. Please request a new code." });
  }

  if (Date.now() > storedOtp.expiresAt) {
    deleteOtp(fullPhone);
    return res.status(400).json({ error: "The verification code has expired. Please request a new one." });
  }

  if (storedOtp.attempts >= 5) {
    deleteOtp(fullPhone);
    return res.status(429).json({ error: "Too many failed verification attempts. Please request a new OTP." });
  }

  const incomingHash = hashOtp(code.trim());
  if (incomingHash !== storedOtp.hashedCode) {
    storedOtp.attempts += 1;
    const remaining = 5 - storedOtp.attempts;
    return res.status(400).json({
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    });
  }

  deleteOtp(fullPhone);

  const UserModel = getUserModel();
  let user;

  if (isMongoConnected()) {
    user = await UserModel.findOne({
      mobile: phoneResult.nationalDigits,
      countryCode: phoneResult.countryCode,
    }).lean();

    if (!user && userData) {
      user = new UserModel({
        id: `user_${Date.now()}`,
        name: userData.name || "Civic Citizen",
        mobile: phoneResult.nationalDigits,
        countryCode: phoneResult.countryCode,
        email: userData.email || "",
        age: userData.age || 21,
        location: userData.location || { city: "Mumbai", state: "Maharashtra", country: "India" },
        role: userData.role || "citizen",
        supplementaryData: userData.supplementaryData || {},
        verifiedWhatsApp: true,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      await user.save();
    } else if (user) {
      user.verifiedWhatsApp = true;
      user.verifiedAt = new Date().toISOString();
      await user.save();
    }
  } else {
    let existingUser = UserModel.findOne({
      mobile: phoneResult.nationalDigits,
      countryCode: phoneResult.countryCode,
    })?.lean();

    if (!existingUser && userData) {
      existingUser = await UserModel.create({
        id: `user_${Date.now()}`,
        name: userData.name || "Civic Citizen",
        mobile: phoneResult.nationalDigits,
        countryCode: phoneResult.countryCode,
        email: userData.email || "",
        age: userData.age || 21,
        location: userData.location || { city: "Mumbai", state: "Maharashtra", country: "India" },
        role: userData.role || "citizen",
        supplementaryData: userData.supplementaryData || {},
        verifiedWhatsApp: true,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    } else if (existingUser) {
      existingUser.verifiedWhatsApp = true;
      existingUser.verifiedAt = new Date().toISOString();
    }
    user = existingUser;
  }

  if (!user) {
    return res.status(400).json({ error: "User profile creation failed." });
  }

  const sessionToken = `civicfix_session_${user.id}_${Date.now()}`;

  return res.json({
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      countryCode: user.countryCode,
      email: user.email,
      age: user.age,
      location: user.location,
      role: user.role,
      verifiedWhatsApp: user.verifiedWhatsApp,
      verifiedAt: user.verifiedAt,
      createdAt: user.createdAt,
      supplementaryData: user.supplementaryData,
    },
  });
}