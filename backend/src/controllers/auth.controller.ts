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

/** Auto-map Google email domain to platform role. */
function mapGoogleEmailToRole(email: string): "citizen" | "organization" | "worker" | "investor" {
  const lower = email.toLowerCase();
  if (lower.includes("gov") || lower.includes("municipal") || lower.includes("official")) return "organization";
  if (lower.includes("worker") || lower.includes("contractor") || lower.includes("build") || lower.includes("infra")) return "worker";
  if (lower.includes("audit") || lower.includes("vigilance") || lower.includes("investor") || lower.includes("fund")) return "investor";
  return "citizen";
}

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

/**
 * Google OAuth — accepts a Google ID token (or credential), verifies it
 * against Google's tokeninfo endpoint, and upserts the user in the DB.
 */
export async function googleAuth(req: Request, res: Response) {
  const { credential, email: fallbackEmail, name: fallbackName, avatarUrl } = req.body || {};

  if (!credential && !fallbackEmail) {
    return res.status(400).json({ error: "Google credential or email is required." });
  }

  let googleId = "";
  let verifiedEmail = fallbackEmail || "";
  let verifiedName = fallbackName || "";
  let picture = avatarUrl || "";

  // Try to verify the real Google ID token via Google's tokeninfo endpoint
  if (credential) {
    try {
      const tokenRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
      );
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        googleId = tokenData.sub || "";
        verifiedEmail = tokenData.email || verifiedEmail;
        verifiedName = tokenData.name || verifiedName;
        picture = tokenData.picture || picture;
      } else {
        // Token verification failed — for hackathon, we still allow sign-in
        // with the email/name provided by the frontend
        console.warn("[GOOGLE AUTH] Token verification returned non-OK, using fallback data");
        googleId = `g_${Date.now()}`;
      }
    } catch (err) {
      console.warn("[GOOGLE AUTH] Token verification failed, using fallback data:", err);
      googleId = `g_${Date.now()}`;
    }
  } else {
    googleId = `g_${Date.now()}`;
  }

  if (!verifiedEmail) {
    return res.status(400).json({ error: "Could not determine Google account email." });
  }

  const role = mapGoogleEmailToRole(verifiedEmail);

  try {
    const UserModel = getUserModel();

    // Check if user already exists by googleId or email
    let user;
    if (isMongoConnected()) {
      user = await UserModel.findOne({
        $or: [
          { googleId: googleId },
          { email: verifiedEmail.toLowerCase() },
        ],
      }).lean();

      if (user) {
        // Update existing user with latest Google info
        await UserModel.updateOne(
          { _id: user._id },
          {
            $set: {
              googleId: googleId || user.googleId,
              authProvider: "google",
              avatarUrl: picture || user.avatarUrl,
              verifiedWhatsApp: true,
            },
          }
        );
        user = await UserModel.findOne({ _id: user._id }).lean();
      } else {
        // Create new user
        const newUser = new UserModel({
          id: `user_g_${Date.now()}`,
          name: verifiedName,
          mobile: "Google Auth",
          countryCode: "+1",
          email: verifiedEmail.toLowerCase(),
          age: 25,
          location: { city: "Mumbai", state: "Maharashtra", country: "India" },
          role,
          googleId,
          authProvider: "google",
          avatarUrl: picture,
          verifiedWhatsApp: true,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          supplementaryData: {},
        });
        await newUser.save();
        user = newUser.toObject();
      }
    } else {
      // In-memory fallback
      const existingUsers = UserModel.find
        ? (UserModel as any).find({ email: verifiedEmail.toLowerCase() })
        : [];
      const existingList = Array.isArray(existingUsers) ? existingUsers : [];
      user = existingList[0] || null;

      if (!user) {
        user = await UserModel.create({
          id: `user_g_${Date.now()}`,
          name: verifiedName,
          mobile: "Google Auth",
          countryCode: "+1",
          email: verifiedEmail.toLowerCase(),
          age: 25,
          location: { city: "Mumbai", state: "Maharashtra", country: "India" },
          role,
          googleId,
          authProvider: "google",
          avatarUrl: picture,
          verifiedWhatsApp: true,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          supplementaryData: {},
        });
      } else {
        user.authProvider = "google";
        user.avatarUrl = picture;
        user.verifiedWhatsApp = true;
      }
    }

    if (!user) {
      return res.status(500).json({ error: "Failed to create or retrieve user." });
    }

    const sessionToken = `civicfix_session_${user.id || (user as any)._id}_${Date.now()}`;

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
        avatarUrl: user.avatarUrl || "",
        authProvider: user.authProvider || "google",
      },
    });
  } catch (err) {
    console.error("[DB ERROR] google-auth:", err);
    return res.status(500).json({ error: "Database error during Google authentication." });
  }
}